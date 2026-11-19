import { useEffect, useRef, useState } from 'react';

/*
 * Lo que estoy escuchando, con datos de Last.fm, como un tocadiscos. Pide los
 * datos al endpoint propio, que es el que tiene la clave. El disco gira
 * siempre; si de verdad suena algo lo dice el cartel "En vivo".
 */

const ENDPOINT = '/api/now-playing.json';

// El endpoint cachea 30 s: pedir más seguido al volver a la pestaña no trae
// nada nuevo.
const REFRESH_AFTER_MS = 60_000;

// Si cambia, cambia también el texto "Últimos 5".
const TRACKS_IN_LIST = 5;

const LIST_LABEL_ID = 'now-playing-list-label';

// 44 px con el dedo y 28 px con mouse (WCAG 2.5.8 pide 24). Lo decide el
// puntero y no el ancho: una tablet en horizontal es ancha y se usa con el dedo.
const ROW_HEIGHT = 'h-11 pointer-fine:h-7';

// El endpoint siempre manda JSON con `state`, también en los errores, así que
// no hace falta mirar el código HTTP.
function viewFromResponse(body) {
  if (body?.state === 'ok' && body.tracks?.length > 0) {
    return { status: 'ok', tracks: body.tracks.slice(0, TRACKS_IN_LIST) };
  }
  if (body?.state === 'empty') return { status: 'empty' };
  if (body?.state === 'private') return { status: 'private' };
  return { status: 'error' };
}

export default function NowPlaying({ texts }) {
  const [view, setView] = useState({ status: 'loading' });
  const [contentRef, contentHeight] = useElementHeight();

  useEffect(() => {
    let lastFetchAt = 0;
    let controller;

    async function load() {
      controller?.abort();
      controller = new AbortController();
      lastFetchAt = Date.now();
      try {
        const response = await fetch(ENDPOINT, { signal: controller.signal });
        setView(viewFromResponse(await response.json()));
      } catch (error) {
        if (error.name !== 'AbortError') setView({ status: 'error' });
      }
    }

    function onVisibilityChange() {
      const isBack = document.visibilityState === 'visible';
      if (isBack && Date.now() - lastFetchAt > REFRESH_AFTER_MS) load();
    }

    load();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      controller?.abort();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  // El endpoint manda primero el que suena o, si no suena nada, el último.
  const featured = view.status === 'ok' ? view.tracks[0] : null;
  const isLive = view.status === 'ok' && view.tracks.some((track) => track.isNowPlaying);

  return (
    <div>
      <h3 className="text-[11px] font-mono tracking-[0.2em] uppercase text-(--ink-secondary)">{texts.label}</h3>

      {/* El alto sigue al del contenido con una transición, así el cambio de
          estado desliza en vez de saltar. box-content: el alto medido incluye
          el padding y el borde va por fuera. */}
      <div
        className="mt-3 box-content overflow-hidden rounded-xl border border-(--border-default) bg-(--color-surface) transition-[height] duration-600 ease-expo-out"
        style={{ height: contentHeight ?? 'auto' }}
      >
        <div ref={contentRef} className="p-4">
          <div className="flex justify-end">
            <LiveSign isLive={isLive} texts={texts} />
          </div>

          <div className="mt-3">
            {view.status === 'loading' && <LoadingSkeleton label={texts.loading} />}

            {view.status === 'ok' && (
              <>
                <Turntable track={featured} texts={texts} />
                {view.tracks.length > 1 && <Tracklist tracks={view.tracks} texts={texts} />}
              </>
            )}

            {view.status === 'empty' && <EmptyTurntable message={texts.empty} />}
            {view.status === 'private' && <EmptyTurntable message={texts.private} />}
            {view.status === 'error' && <EmptyTurntable message={texts.error} />}
          </div>

          {/* Los términos de la API de Last.fm piden este link en todos los
              estados. */}
          <div className="flex justify-end mt-2">
            <a
              href="https://www.last.fm"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="text-[11px] leading-none font-mono tracking-[0.18em] transition-colors duration-300 ease-expo-out text-(--ink-muted) hover:text-accent"
            >
              {texts.credit}
              <span className="sr-only select-none"> {texts.opensNewTab}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * Prendido: relleno terracota con tinta #111110 fija (5:1), y el estado no
 * depende solo del color: pasa de contorno a bloque lleno. Apagado no anuncia
 * nada: mientras carga o ante un error no se sabe si suena algo.
 */
function LiveSign({ isLive, texts }) {
  return (
    <div>
      <span
        aria-hidden="true"
        className={`block border px-1.5 py-0.5 text-[11px] leading-none font-mono uppercase tracking-[0.18em] transition-colors duration-600 ease-expo-out ${
          isLive ? 'border-accent bg-accent text-[#111110]' : 'border-(--border-strong) text-(--ink-muted)'
        }`}
      >
        {texts.live}
      </span>
      {isLive && <span className="sr-only">{texts.statusPlaying}</span>}
    </div>
  );
}

const TRACK_LINK_HOVER =
  'transition-[color,text-decoration-color,text-underline-offset] duration-300 ease-expo-out hover:text-accent hover:decoration-accent hover:underline-offset-8';

// El título se corta en dos líneas balanceadas para que el bloque mida lo
// mismo que el disco.
function Turntable({ track, texts }) {
  const byline = track.album ? `${track.artist} — ${track.album}` : track.artist;

  return (
    <div className="flex items-center gap-4">
      <Vinyl />

      {/* key: si un refresco trae otro tema, el bloque se vuelve a montar y
          entra con un fade. */}
      <div key={`${track.url}-${track.playedAt}`} className="min-w-0 motion-safe:animate-fade-in">
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          className={`line-clamp-2 text-balance font-display text-base leading-tight text-(--ink-primary) underline decoration-(--border-strong) underline-offset-4 ${TRACK_LINK_HOVER}`}
        >
          {track.title}
          {/* select-none: el texto sr-only es seleccionable y aparecería al
              copiar el título. */}
          <span className="sr-only select-none"> {texts.trackLink} {texts.opensNewTab}</span>
        </a>

        {byline && <p className="mt-1 truncate text-xs leading-relaxed text-(--ink-secondary)">{byline}</p>}
      </div>
    </div>
  );
}

// Incluye al destacado, así la lista siempre tiene cinco, suene algo o no.
function Tracklist({ tracks, texts }) {
  return (
    <div className="mt-3">
      <p
        id={LIST_LABEL_ID}
        className="text-[11px] font-mono uppercase tracking-[0.18em] text-(--ink-secondary)"
      >
        {texts.listLabel}
      </p>

      <ol aria-labelledby={LIST_LABEL_ID} className="mt-1">
        {tracks.map((track, index) => (
          <li key={`${index}-${track.url}`}>
            <a
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className={`group flex items-center gap-3 ${ROW_HEIGHT} -mx-2 px-2 rounded-lg text-xs`}
            >
              <span aria-hidden="true" className="flex items-center w-5 shrink-0">
                {track.isNowPlaying ? (
                  <Equalizer />
                ) : (
                  <span className="font-mono text-[11px] text-(--ink-secondary)">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}
              </span>

              {/* El artista entra al lado del título o baja a una segunda
                  línea oculta (alto de una línea + overflow-hidden), así nunca
                  queda un "·" suelto. */}
              <span className="flex flex-1 flex-wrap h-4 min-w-0 overflow-hidden">
                <span className="max-w-full truncate text-(--ink-primary) underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color,text-underline-offset] duration-300 ease-expo-out group-hover:text-accent group-hover:decoration-accent group-hover:underline-offset-8">
                  {track.title}
                </span>
                {track.artist && (
                  <span className="flex-1 basis-16 min-w-0 truncate text-(--ink-secondary)">
                    <span aria-hidden="true" className="px-1.5">
                      ·
                    </span>
                    {track.artist}
                  </span>
                )}
              </span>

              {track.isNowPlaying && <span className="sr-only">{texts.statusPlaying}</span>}
              <span className="sr-only select-none"> {texts.trackLink} {texts.opensNewTab}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

/*
 * Mismos colores en los dos temas, como una imagen. El borde separa el disco
 * de la card en tema oscuro, donde los dos negros casi coinciden. motion-safe
 * evita que la regla global de movimiento reducido haga parpadear la
 * animación infinita. El reflejo va en una capa aparte que no gira.
 */
const RECORD_COLOR = '#111110';
const LABEL_COLOR = '#EDE2CD';
const GROOVE_COLOR = '#F0EDE8';
const GROOVE_RADII = [44, 39, 34, 29];

function Vinyl() {
  return (
    <div aria-hidden="true" className="relative size-16 shrink-0">
      <div className="size-full motion-safe:animate-spin-record">
        <svg viewBox="0 0 100 100" className="size-full">
          <circle cx="50" cy="50" r="49.25" fill={RECORD_COLOR} strokeWidth="1.5" className="stroke-(--ink-subtle)" />
          {GROOVE_RADII.map((radius) => (
            <circle
              key={radius}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={GROOVE_COLOR}
              strokeOpacity="0.08"
              strokeWidth="0.6"
            />
          ))}
          <circle cx="50" cy="50" r="18" fill={LABEL_COLOR} />
          <image href="/favicon.svg" x="39" y="39" width="22" height="22" />
        </svg>
      </div>

      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full pointer-events-none">
        <defs>
          <linearGradient id="now-playing-sheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0.38" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="0.62" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48.5" fill="url(#now-playing-sheen)" />
      </svg>
    </div>
  );
}

function EmptyTurntable({ message }) {
  return (
    <div className="flex items-center gap-4 motion-safe:animate-fade-in">
      <Vinyl />
      <p className="text-xs leading-relaxed text-(--ink-secondary)">{message}</p>
    </div>
  );
}

const EQUALIZER_BARS = [
  { restHeight: 'h-1.5', delay: '0s' },
  { restHeight: 'h-3', delay: '0.2s' },
  { restHeight: 'h-2', delay: '0.4s' },
];

function Equalizer() {
  return (
    <span aria-hidden="true" className="flex items-end gap-0.5 h-3 shrink-0">
      {EQUALIZER_BARS.map((bar) => (
        <span
          key={bar.delay}
          className={`w-0.5 ${bar.restHeight} motion-safe:h-3 origin-bottom motion-safe:animate-equalizer`}
          style={{ backgroundColor: 'var(--color-accent)', animationDelay: bar.delay }}
        />
      ))}
    </span>
  );
}

// Mismas medidas que el caso común (el destacado y cinco filas), así el paso
// de "cargando" a los datos no cambia el alto.
function LoadingSkeleton({ label }) {
  const pulse = 'bg-(--border-default) motion-safe:animate-pulse';
  const bar = `rounded-sm ${pulse}`;
  return (
    <div>
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">
        <div className="flex items-center gap-4">
          <div className={`size-16 shrink-0 rounded-full ${pulse}`} />
          <div className="flex-1">
            <div className={`h-4 w-3/4 ${bar}`} />
            <div className={`h-3 w-1/2 mt-2 ${bar}`} />
          </div>
        </div>
        <div className="mt-3">
          <div className={`h-3 w-20 ${bar}`} />
          <div className="mt-1">
            {Array.from({ length: TRACKS_IN_LIST }, (_, index) => (
              <div key={index} className={`flex items-center ${ROW_HEIGHT}`}>
                <div className={`h-2.5 w-3/4 ${bar}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Arranca en null: la card usa 'auto' y la primera medida se aplica sin
// animación, porque CSS no anima desde 'auto'.
function useElementHeight() {
  const ref = useRef(null);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.borderBoxSize[0].blockSize);
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, height];
}
