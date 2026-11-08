import { useEffect, useState } from 'react';

/*
 * NowPlaying: lo que estoy escuchando, con datos de Last.fm.
 *
 * Pide los datos a /api/now-playing.json, el endpoint propio del sitio (que
 * es el que habla con Last.fm y guarda la clave). Muestra el tema que suena
 * ahora o, si no suena nada, el último que sonó.
 *
 * Estados:
 *   loading   esqueleto con las medidas del contenido
 *   playing   el tema que suena ahora, con el ecualizador animado
 *   recent    el último tema, con hace cuánto sonó
 *   empty     la cuenta no tiene temas
 *   private   el perfil oculta lo que escucha
 *   error     cualquier otra falla (el endpoint distingue el motivo para los
 *             logs; a quien visita el sitio le alcanza con un mensaje)
 *
 * `texts` trae los textos ya traducidos y `locale` el idioma de la página,
 * para escribir el tiempo relativo ("hace 12 minutos" / "12 minutes ago").
 */

const ENDPOINT = '/api/now-playing.json';

// Al volver a la pestaña se vuelve a pedir, pero no antes de este tiempo: el
// endpoint cachea 30 s, así que pedir más seguido no trae nada nuevo.
const REFRESH_AFTER_MS = 60_000;

/*
 * Convierte la respuesta del endpoint en lo que necesita la vista. El
 * endpoint siempre manda JSON con `state`, también cuando responde un error,
 * así que el JSON se lee sin mirar el código HTTP.
 */
function viewFromResponse(body) {
  if (body?.state === 'ok' && body.tracks?.length > 0) {
    const track = body.tracks[0];
    return { status: track.isNowPlaying ? 'playing' : 'recent', track };
  }
  if (body?.state === 'empty') return { status: 'empty' };
  if (body?.state === 'private') return { status: 'private' };
  return { status: 'error' };
}

export default function NowPlaying({ texts, locale }) {
  const [view, setView] = useState({ status: 'loading' });

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
        // Abortar es intencional (se desmontó o arrancó otro pedido): no es
        // un error que haya que mostrar.
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

  return (
    <div>
      <h3
        className="text-xs font-mono tracking-[0.2em] uppercase"
        style={{ color: 'var(--color-accent)' }}
      >
        {texts.label}
      </h3>

      {/* min-h igual al alto del contenido con un tema (con el padding de
          cada breakpoint): así el paso de "cargando" a cualquier estado no
          mueve lo que viene abajo. */}
      <div className="mt-4 min-h-32 md:min-h-36 rounded-xl border border-(--border-default) bg-(--color-surface) p-5 md:p-6">
        {view.status === 'loading' && <LoadingSkeleton label={texts.loading} />}
        {(view.status === 'playing' || view.status === 'recent') && (
          <TrackView track={view.track} isPlaying={view.status === 'playing'} texts={texts} locale={locale} />
        )}
        {view.status === 'empty' && <Message text={texts.empty} />}
        {view.status === 'private' && <Message text={texts.private} />}
        {view.status === 'error' && <Message text={texts.error} />}
      </div>

      <a
        href="https://www.last.fm"
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="link"
        className="group inline-flex items-center gap-2 mt-4 text-[11px] font-mono uppercase tracking-[0.18em] transition-colors duration-300 text-(--ink-muted) hover:text-accent"
      >
        <span>{texts.credit}</span>
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-1 group-hover:-translate-y-1"
          style={{ color: 'var(--color-accent)' }}
        >
          ↗
        </span>
      </a>
    </div>
  );
}

function TrackView({ track, isPlaying, texts, locale }) {
  const byline = track.album ? `${track.artist} — ${track.album}` : track.artist;

  return (
    <div className="motion-safe:animate-fade-in">
      <p className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-(--ink-secondary)">
        {isPlaying && <Equalizer />}
        <span>{isPlaying ? texts.status_playing : texts.status_recent}</span>
        {!isPlaying && track.playedAt && (
          <>
            <span aria-hidden="true">·</span>
            <time dateTime={track.playedAt} className="text-(--ink-muted)">
              {formatRelativeTime(track.playedAt, locale)}
            </time>
          </>
        )}
      </p>

      <a
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="link"
        className="group inline-flex items-baseline gap-2 mt-3 font-display text-xl leading-tight transition-colors duration-300 text-(--ink-primary) hover:text-accent"
      >
        <span>
          {track.title}
          {/* select-none: el texto sr-only sigue siendo seleccionable y
              aparecería al copiar el título. */}
          <span className="sr-only select-none"> {texts.track_link}</span>
        </span>
        <span
          aria-hidden="true"
          className="inline-block text-base transition-transform duration-300 ease-expo-out group-hover:translate-x-1 group-hover:-translate-y-1"
          style={{ color: 'var(--color-accent)' }}
        >
          ↗
        </span>
      </a>

      {byline && <p className="mt-1 text-sm leading-relaxed text-(--ink-secondary)">{byline}</p>}
    </div>
  );
}

/*
 * Tres barras que suben y bajan mientras suena un tema. Con movimiento
 * reducido no se animan (motion-safe) y quedan quietas a distintas alturas.
 */
const EQUALIZER_BARS = [
  { restHeight: 'h-1.5', delay: '0s' },
  { restHeight: 'h-3', delay: '0.2s' },
  { restHeight: 'h-2', delay: '0.4s' },
];

function Equalizer() {
  return (
    <span aria-hidden="true" className="flex items-end gap-0.5 h-3">
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

function LoadingSkeleton({ label }) {
  const bar = 'rounded-sm bg-(--border-default) motion-safe:animate-pulse';
  return (
    <div>
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">
        <div className={`h-3 w-28 ${bar}`} />
        <div className={`h-6 w-3/4 mt-4 ${bar}`} />
        <div className={`h-4 w-1/2 mt-2 ${bar}`} />
      </div>
    </div>
  );
}

function Message({ text }) {
  return <p className="text-sm leading-relaxed text-(--ink-secondary)">{text}</p>;
}

/*
 * "hace 12 minutos" / "12 minutes ago", con la API del navegador
 * (Intl.RelativeTimeFormat), sin librerías. Elige la unidad más grande que
 * entre al menos una vez. numeric: 'auto' escribe "ayer" en vez de
 * "hace 1 día".
 */
const TIME_UNITS = [
  { unit: 'year', seconds: 31_536_000 },
  { unit: 'month', seconds: 2_592_000 },
  { unit: 'week', seconds: 604_800 },
  { unit: 'day', seconds: 86_400 },
  { unit: 'hour', seconds: 3_600 },
  { unit: 'minute', seconds: 60 },
];

function formatRelativeTime(isoDate, locale) {
  const secondsAgo = Math.round((Date.now() - new Date(isoDate).getTime()) / 1000);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const match = TIME_UNITS.find(({ seconds }) => secondsAgo >= seconds);
  // Menos de un minuto: "ahora" / "now".
  if (!match) return formatter.format(0, 'second');
  return formatter.format(-Math.floor(secondsAgo / match.seconds), match.unit);
}
