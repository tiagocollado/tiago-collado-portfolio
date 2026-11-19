import { LASTFM_API_KEY, LASTFM_USERNAME } from 'astro:env/server';

/*
 * El tema que suena ahora (si hay uno) y los últimos cinco, según Last.fm.
 * Corre a pedido, como "/". Siempre responde JSON con `state`: ok,
 * empty, private, user-not-found, invalid-key, key-suspended,
 * not-configured, rate-limited, timeout o unavailable.
 */
export const prerender = false;

const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';
const RECENT_TRACKS_TO_SHOW = 5;
const LASTFM_TIMEOUT_MS = 5000;

// La CDN de Vercel guarda la respuesta 30 s: Last.fm recibe como mucho un
// pedido cada 30 s por región, con cualquier cantidad de visitas. Los errores
// no se guardan, así el próximo pedido vuelve a intentar.
const CACHE_SUCCESS = 'public, s-maxage=30, stale-while-revalidate=60';
const CACHE_ERROR = 'no-store';

// Códigos de https://www.last.fm/api/errorcodes. Como intermediario, el
// endpoint responde 502 si Last.fm rechazó el pedido y 503 si está caído.
const LASTFM_ERRORS = {
  // "Invalid parameters": el pedido lleva todos, así que en la práctica es un
  // usuario inexistente.
  6: { state: 'user-not-found', httpStatus: 502 },
  8: { state: 'unavailable', httpStatus: 503 }, // "Operation failed"
  10: { state: 'invalid-key', httpStatus: 502 },
  11: { state: 'unavailable', httpStatus: 503 }, // "Service Offline"
  16: { state: 'unavailable', httpStatus: 503 }, // error temporal
  17: { state: 'private', httpStatus: 403 }, // "Login required": perfil privado
  26: { state: 'key-suspended', httpStatus: 502 },
  29: { state: 'rate-limited', httpStatus: 503 },
};

export async function GET() {
  if (!LASTFM_API_KEY || !LASTFM_USERNAME) {
    return errorResponse('not-configured', 500);
  }

  const params = new URLSearchParams({
    method: 'user.getrecenttracks',
    user: LASTFM_USERNAME,
    api_key: LASTFM_API_KEY,
    format: 'json',
    // Uno más, por si el primero es el que suena y no cuenta como "último".
    limit: String(RECENT_TRACKS_TO_SHOW + 1),
  });

  // fetch no tiene timeout propio.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), LASTFM_TIMEOUT_MS);

  let data;
  try {
    const response = await fetch(`${LASTFM_API_URL}?${params}`, { signal: controller.signal });
    // Last.fm manda JSON también en los errores, con un status distinto de 200.
    data = await response.json();
  } catch (error) {
    // Sin la URL en el log: lleva la clave.
    if (error.name === 'AbortError') {
      console.error('[now-playing] Last.fm no respondió en', LASTFM_TIMEOUT_MS, 'ms');
      return errorResponse('timeout', 504);
    }
    console.error('[now-playing] Falló el pedido a Last.fm:', error.name);
    return errorResponse('unavailable', 502);
  } finally {
    clearTimeout(timeoutId);
  }

  if (data?.error) {
    const known = LASTFM_ERRORS[data.error];
    console.error('[now-playing] Last.fm respondió el error', data.error, data.message);
    return known ? errorResponse(known.state, known.httpStatus) : errorResponse('unavailable', 502);
  }

  if (!data?.recenttracks) {
    console.error('[now-playing] Last.fm respondió sin recenttracks');
    return errorResponse('unavailable', 502);
  }

  const tracks = pickTracksToShow(data.recenttracks.track);
  const body = tracks.length > 0 ? { state: 'ok', tracks } : { state: 'empty', tracks: [] };
  return Response.json(body, { headers: { 'Cache-Control': CACHE_SUCCESS } });
}

// Con un solo tema, Last.fm devuelve un objeto suelto en vez de una lista.
function pickTracksToShow(rawTracks) {
  const list = Array.isArray(rawTracks) ? rawTracks : rawTracks ? [rawTracks] : [];
  const tracks = list.map(normalizeTrack);

  const nowPlaying = tracks.find((track) => track.isNowPlaying);
  const recent = tracks.filter((track) => !track.isNowPlaying).slice(0, RECENT_TRACKS_TO_SHOW);
  return nowPlaying ? [nowPlaying, ...recent] : recent;
}

// Sin portadas: los términos de la API las excluyen (cláusula 5.1.8). Los
// textos vacíos pasan a null.
function normalizeTrack(raw) {
  const isNowPlaying = raw['@attr']?.nowplaying === 'true';

  return {
    title: raw.name,
    artist: raw.artist?.['#text'] || null,
    album: raw.album?.['#text'] || null,
    url: raw.url,
    isNowPlaying,
    // El que suena no tiene fecha. `uts` son segundos Unix.
    playedAt: isNowPlaying || !raw.date?.uts ? null : new Date(Number(raw.date.uts) * 1000).toISOString(),
  };
}

function errorResponse(state, httpStatus) {
  return Response.json({ state }, { status: httpStatus, headers: { 'Cache-Control': CACHE_ERROR } });
}
