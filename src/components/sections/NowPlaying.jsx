import { useEffect, useRef, useState } from 'react';

/*
 * NowPlaying: lo que estoy escuchando, con datos de Last.fm.
 *
 * Pide los datos a /api/now-playing.json, el endpoint propio del sitio (que
 * es el que habla con Last.fm y guarda la clave). Un solo pedido trae el tema
 * que suena ahora (si hay uno) y los últimos cinco, así que las dos vistas
 * del widget salen de la misma respuesta:
 *
 *   Ahora       el tema que suena o, si no suena nada, el último que sonó
 *   Últimos 5   los últimos cinco temas escuchados
 *
 * Se elige con pestañas (patrón Tabs de WAI-ARIA). Si la lista no muestra
 * nada que la vista "Ahora" no muestre, las pestañas no aparecen.
 *
 * Estados de los datos:
 *   loading   esqueleto con las medidas del contenido
 *   ok        hay temas: las dos vistas
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

// IDs fijos: el widget aparece una sola vez por página (en el About). Los
// usan aria-labelledby y aria-controls para conectar label, pestañas y
// paneles.
const LABEL_ID = 'now-playing-label';
const TABS = ['now', 'recent'];
const tabId = (tab) => `now-playing-tab-${tab}`;
const panelId = (tab) => `now-playing-panel-${tab}`;

/*
 * Convierte la respuesta del endpoint en lo que necesita la vista. El
 * endpoint siempre manda JSON con `state`, también cuando responde un error,
 * así que el JSON se lee sin mirar el código HTTP.
 *
 * `featured` es el tema de la vista "Ahora": el que suena o, si no suena
 * nada, el último. `recent` son los últimos escuchados, sin el que suena.
 */
function viewFromResponse(body) {
  if (body?.state === 'ok' && body.tracks?.length > 0) {
    const playing = body.tracks.find((track) => track.isNowPlaying) ?? null;
    const recent = body.tracks.filter((track) => !track.isNowPlaying);
    return { status: 'ok', featured: playing ?? recent[0], isPlaying: playing !== null, recent };
  }
  if (body?.state === 'empty') return { status: 'empty' };
  if (body?.state === 'private') return { status: 'private' };
  return { status: 'error' };
}

export default function NowPlaying({ texts, locale }) {
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
        id={LABEL_ID}
        className="text-xs font-mono tracking-[0.2em] uppercase"
        style={{ color: 'var(--color-accent)' }}
      >
        {texts.label}
      </h3>

      {/* El alto de la card se anima: sigue al del contenido (medido abajo)
          con una transición CSS, así el paso entre estados o entre
          pestañas desliza lo que viene después en vez de hacerlo saltar.
          box-content: el alto medido es el del contenido con su padding, y
          el borde va por fuera. Con movimiento reducido, la regla global de
          global.css deja la transición en 0 y el cambio es instantáneo. */}
      <div
        className="mt-4 box-content overflow-hidden rounded-xl border border-(--border-default) bg-(--color-surface) transition-[height] duration-600 ease-expo-out"
        style={{ height: contentHeight ?? 'auto' }}
      >
        <div ref={contentRef} className="p-5 md:p-6">
          {view.status === 'loading' && <LoadingSkeleton label={texts.loading} />}
          {view.status === 'ok' && <TrackViews view={view} texts={texts} locale={locale} />}
          {view.status === 'empty' && <Message text={texts.empty} />}
          {view.status === 'private' && <Message text={texts.private} />}
          {view.status === 'error' && <Message text={texts.error} />}
        </div>
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

/*
 * Las dos vistas con sus pestañas, según el patrón Tabs de WAI-ARIA:
 *
 * - Activación automática: la pestaña se activa al recibir el foco, porque
 *   las dos vistas ya están cargadas y no hay espera.
 * - Teclado: Tab entra a la pestaña activa (la otra queda con tabindex -1),
 *   las flechas izquierda y derecha cambian de pestaña y dan la vuelta,
 *   Inicio y Fin van a la primera y a la última, y Tab sale al panel.
 * - Los dos paneles están siempre en el DOM (el inactivo con `hidden`), así
 *   aria-controls apunta a algo que existe.
 */
function TrackViews({ view, texts, locale }) {
  const [selectedTab, setSelectedTab] = useState('now');
  const tabRefs = useRef([]);

  const featured = (
    <TrackView track={view.featured} isPlaying={view.isPlaying} texts={texts} locale={locale} />
  );

  // La lista solo suma si muestra algún tema que la vista "Ahora" no
  // muestra. Si no suena nada y la cuenta tiene un solo tema, las dos
  // vistas serían iguales: van sin pestañas.
  const hasList = view.recent.some((track) => track !== view.featured);
  if (!hasList) return <div className="motion-safe:animate-fade-in">{featured}</div>;

  const tabLabels = { now: texts.tab_now, recent: texts.tab_recent };

  function selectTabAt(index) {
    setSelectedTab(TABS[index]);
    tabRefs.current[index].focus();
  }

  function onTabKeyDown(event) {
    const current = TABS.indexOf(selectedTab);
    const last = TABS.length - 1;
    if (event.key === 'ArrowRight') selectTabAt(current === last ? 0 : current + 1);
    else if (event.key === 'ArrowLeft') selectTabAt(current === 0 ? last : current - 1);
    else if (event.key === 'Home') selectTabAt(0);
    else if (event.key === 'End') selectTabAt(last);
    else return;
    // Que Inicio, Fin y las flechas no scrolleen la página.
    event.preventDefault();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-labelledby={LABEL_ID}
        onKeyDown={onTabKeyDown}
        className="relative grid grid-cols-2 h-10 md:h-9 p-1 rounded-full border border-(--border-default)"
      >
        {/* Indicador de la pestaña activa: una pill invertida que se desliza
            de una mitad a la otra. Mide la mitad del ancho interior (el
            50% menos el padding de 4px) y se corre su propio ancho. */}
        <span
          aria-hidden="true"
          className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-(--ink-primary) transition-transform duration-600 ease-expo-out ${
            selectedTab === 'recent' ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
        {TABS.map((tab, index) => {
          const isSelected = tab === selectedTab;
          return (
            <button
              key={tab}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={tabId(tab)}
              aria-selected={isSelected}
              aria-controls={panelId(tab)}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelectedTab(tab)}
              data-cursor="link"
              className={`relative cursor-pointer rounded-full text-[11px] font-mono uppercase tracking-[0.18em] transition-colors duration-300 ${
                isSelected ? 'text-(--bg-primary)' : 'text-(--ink-secondary) hover:text-(--ink-primary)'
              }`}
            >
              {tabLabels[tab]}
            </button>
          );
        })}
      </div>

      {/* tabIndex 0: ninguno de los dos paneles empieza con algo enfocable,
          y así Tab llega al panel desde la pestaña. */}
      <div
        role="tabpanel"
        id={panelId('now')}
        aria-labelledby={tabId('now')}
        tabIndex={0}
        hidden={selectedTab !== 'now'}
        className="mt-5 md:mt-6 motion-safe:animate-fade-in"
      >
        {featured}
      </div>
      <div
        role="tabpanel"
        id={panelId('recent')}
        aria-labelledby={tabId('recent')}
        tabIndex={0}
        hidden={selectedTab !== 'recent'}
        className="mt-5 md:mt-6 motion-safe:animate-fade-in"
      >
        <RecentList tracks={view.recent} texts={texts} locale={locale} />
      </div>
    </div>
  );
}

function TrackView({ track, isPlaying, texts, locale }) {
  const byline = track.album ? `${track.artist} — ${track.album}` : track.artist;

  return (
    <div>
      <p className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-(--ink-secondary)">
        {isPlaying && <Equalizer />}
        <span>{isPlaying ? texts.status_playing : texts.status_recent}</span>
        {!isPlaying && track.playedAt && (
          <>
            <span aria-hidden="true">·</span>
            <time dateTime={track.playedAt}>{formatRelativeTime(track.playedAt, locale)}</time>
          </>
        )}
      </p>

      <TrackLink track={track} linkLabel={texts.track_link} variant="featured" />

      {byline && <p className="mt-1 text-sm leading-relaxed text-(--ink-secondary)">{byline}</p>}
    </div>
  );
}

/*
 * Los últimos cinco, del más nuevo al más viejo (por eso <ol>). El título
 * va en una sola línea y se corta con "…" si no entra: el corte es solo
 * visual, el lector de pantalla lee el título completo.
 */
function RecentList({ tracks, texts, locale }) {
  return (
    <ol className="divide-y divide-(--border-default)">
      {tracks.map((track, index) => (
        <li key={`${index}-${track.url}`} className="py-3 first:pt-0 last:pb-0">
          <TrackLink track={track} linkLabel={texts.track_link} variant="row" />
          <p className="flex mt-1 text-sm leading-relaxed text-(--ink-secondary)">
            {track.artist && <span className="truncate">{track.artist}</span>}
            {track.artist && track.playedAt && (
              <span aria-hidden="true" className="shrink-0 px-2">
                ·
              </span>
            )}
            {track.playedAt && (
              <time dateTime={track.playedAt} className="shrink-0">
                {formatRelativeTime(track.playedAt, locale)}
              </time>
            )}
          </p>
        </li>
      ))}
    </ol>
  );
}

/*
 * Link a la página del tema en Last.fm (los términos de la API piden
 * enlazar a esas páginas). Dos tamaños: el destacado de la vista "Ahora" y
 * la fila de la lista, que se corta en una línea.
 */
const TRACK_LINK_STYLES = {
  featured: { link: 'inline-flex mt-3 text-xl leading-tight', title: '', arrow: 'text-base' },
  row: { link: 'flex text-base leading-snug', title: 'truncate', arrow: 'shrink-0 text-sm' },
};

function TrackLink({ track, linkLabel, variant }) {
  const styles = TRACK_LINK_STYLES[variant];

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      className={`group items-baseline gap-2 font-display transition-colors duration-300 text-(--ink-primary) hover:text-accent ${styles.link}`}
    >
      <span className={styles.title}>
        {track.title}
        {/* select-none: el texto sr-only sigue siendo seleccionable y
            aparecería al copiar el título. */}
        <span className="sr-only select-none"> {linkLabel}</span>
      </span>
      <span
        aria-hidden="true"
        className={`inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-1 group-hover:-translate-y-1 ${styles.arrow}`}
        style={{ color: 'var(--color-accent)' }}
      >
        ↗
      </span>
    </a>
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

/*
 * Mismas medidas que el contenido más común (pestañas + un tema), así el
 * paso de "cargando" a los datos no cambia el alto de la card.
 */
function LoadingSkeleton({ label }) {
  const pulse = 'bg-(--border-default) motion-safe:animate-pulse';
  const bar = `rounded-sm ${pulse}`;
  return (
    <div>
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">
        <div className={`h-10 md:h-9 rounded-full ${pulse}`} />
        <div className="mt-5 md:mt-6">
          <div className={`h-3 w-28 ${bar}`} />
          <div className={`h-6 w-3/4 mt-4 ${bar}`} />
          <div className={`h-4 w-1/2 mt-2 ${bar}`} />
        </div>
      </div>
    </div>
  );
}

function Message({ text }) {
  return <p className="text-sm leading-relaxed text-(--ink-secondary)">{text}</p>;
}

/*
 * Alto de un elemento, medido con ResizeObserver cada vez que cambia.
 * Devuelve la ref para el elemento y su alto en píxeles. Arranca en null
 * (todavía sin medir): la card usa 'auto' y la primera medida se aplica sin
 * animación, porque CSS no anima desde 'auto'.
 */
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
