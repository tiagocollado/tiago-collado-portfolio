import { LASTFM_API_KEY, LASTFM_USERNAME } from 'astro:env/server';

/*
 * GET /api/now-playing.json
 *
 * Lo que estoy escuchando, según Last.fm: el tema que suena ahora (si hay
 * uno) y los últimos cinco. Es la única ruta del sitio que se ejecuta a
 * pedido: las páginas son estáticas, pero estos datos cambian solos.
 *
 * El navegador nunca habla con Last.fm. Llama a este endpoint, que agrega la
 * clave del lado del servidor y devuelve solo lo que muestra el widget.
 *
 * Siempre responde JSON con un campo `state`, así el widget sabe qué mostrar
 * sin interpretar códigos HTTP:
 *
 *   ok               hay temas en `tracks`
 *   empty            la cuenta no tiene ningún tema registrado
 *   private          el perfil oculta lo que escucha
 *   user-not-found   el usuario configurado no existe
 *   invalid-key      Last.fm no reconoce la clave
 *   key-suspended    Last.fm suspendió la clave
 *   not-configured   falta la clave o el usuario en el entorno
 *   rate-limited     se superó el límite de pedidos de Last.fm
 *   timeout          Last.fm no respondió a tiempo
 *   unavailable      Last.fm está caído o respondió algo inesperado
 */
export const prerender = false;

const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';
const RECENT_TRACKS_TO_SHOW = 5;
const LASTFM_TIMEOUT_MS = 5000;

// Solo se cachean las respuestas correctas. La CDN de Vercel guarda la
// respuesta 30 s (s-maxage) y, durante 60 s más, sigue sirviendo la copia
// vieja mientras pide una nueva en segundo plano (stale-while-revalidate).
// Así Last.fm recibe como mucho un pedido cada 30 s por región de la CDN,
// sin importar cuántas visitas haya. Last.fm no manda headers de caché
// propios, así que no hay una duración suya que respetar.
const CACHE_SUCCESS = 'public, s-maxage=30, stale-while-revalidate=60';
// Los errores no se guardan: el próximo pedido vuelve a intentar.
const CACHE_ERROR = 'no-store';

/*
 * Errores de Last.fm (https://www.last.fm/api/errorcodes) → estado del
 * endpoint y código HTTP. El endpoint funciona como intermediario, así que
 * usa los códigos de intermediario: 502 si Last.fm rechazó el pedido, 503 si
 * está caído o limitando.
 */
const LASTFM_ERRORS = {
  // "Invalid parameters". El pedido siempre lleva todos los parámetros, así
  // que en la práctica es el usuario: Last.fm responde "User not found".
  6: { state: 'user-not-found', httpStatus: 502 },
  8: { state: 'unavailable', httpStatus: 503 }, // "Operation failed"
  10: { state: 'invalid-key', httpStatus: 502 },
  11: { state: 'unavailable', httpStatus: 503 }, // "Service Offline"
  16: { state: 'unavailable', httpStatus: 503 }, // error temporal
  // "Login required". Es lo que devuelve getRecentTracks cuando el perfil
  // oculta lo que escucha.
  17: { state: 'private', httpStatus: 403 },
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
    // Uno más que los que se muestran, por si el primero es el que suena
    // ahora y no cuenta como "último escuchado".
    limit: String(RECENT_TRACKS_TO_SHOW + 1),
  });

  // fetch no tiene timeout propio: si Last.fm no responde, el pedido queda
  // colgado. El AbortController lo cancela pasado el tiempo límite.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), LASTFM_TIMEOUT_MS);

  let data;
  try {
    const response = await fetch(`${LASTFM_API_URL}?${params}`, { signal: controller.signal });
    // Last.fm manda JSON también en los errores ({ error, message }), con un
    // status HTTP distinto de 200. Por eso se lee siempre.
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

/*
 * El que suena ahora (si hay uno) más los últimos cinco escuchados, ya
 * normalizados. Last.fm devuelve un objeto suelto en vez de una lista cuando
 * hay un solo tema, así que primero se lleva todo a lista.
 */
function pickTracksToShow(rawTracks) {
  const list = Array.isArray(rawTracks) ? rawTracks : rawTracks ? [rawTracks] : [];
  const tracks = list.map(normalizeTrack);

  const nowPlaying = tracks.find((track) => track.isNowPlaying);
  const recent = tracks.filter((track) => !track.isNowPlaying).slice(0, RECENT_TRACKS_TO_SHOW);
  return nowPlaying ? [nowPlaying, ...recent] : recent;
}

/*
 * Del tema de Last.fm se queda solo lo que muestra el widget. Los campos de
 * texto vacíos ("") pasan a null, para que el widget no tenga que distinguir
 * entre "vacío" y "no está".
 *
 * Las portadas quedan afuera a propósito: los términos de la API de Last.fm
 * excluyen las imágenes y el arte de los discos de lo que se puede usar
 * (cláusula 5.1.8).
 */
function normalizeTrack(raw) {
  const isNowPlaying = raw['@attr']?.nowplaying === 'true';

  return {
    title: raw.name,
    artist: raw.artist?.['#text'] || null,
    album: raw.album?.['#text'] || null,
    url: raw.url,
    isNowPlaying,
    // El que suena ahora no tiene fecha: todavía no terminó de escucharse.
    // `uts` es la fecha en segundos desde 1970 (formato Unix).
    playedAt: isNowPlaying || !raw.date?.uts ? null : new Date(Number(raw.date.uts) * 1000).toISOString(),
  };
}

function errorResponse(state, httpStatus) {
  return Response.json({ state }, { status: httpStatus, headers: { 'Cache-Control': CACHE_ERROR } });
}
