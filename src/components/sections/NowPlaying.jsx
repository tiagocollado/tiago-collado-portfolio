import { useEffect, useRef, useState } from 'react';

/*
 * NowPlaying: lo que estoy escuchando, con datos de Last.fm, como un
 * tocadiscos. Es un detalle personal del About, no su protagonista: por eso
 * es compacto y va en tonos neutros.
 *
 * Pide los datos a /api/now-playing.json, el endpoint propio del sitio (que
 * es el que habla con Last.fm y guarda la clave). Arriba va el tema
 * destacado: un vinilo con la G como etiqueta, el título y el artista. Abajo,
 * los últimos cinco temas, como el listado de un disco. Elegir uno lo pone
 * en el tocadiscos.
 *
 * El disco gira siempre: es ambiente, dice "esto es música". Si de verdad
 * estoy escuchando algo lo dice el cartel "En vivo" de arriba a la derecha,
 * como el cartel "On Air" de un estudio: apagado si no suena nada, prendido
 * si algún tema tiene isNowPlaying. El widget nunca dice algo que no es
 * cierto.
 *
 * Estados de los datos:
 *   loading   esqueleto con las medidas del contenido
 *   ok        hay temas: el destacado y, si hay más de uno, la lista
 *   empty     la cuenta no tiene temas
 *   private   el perfil oculta lo que escucha
 *   error     cualquier otra falla (el endpoint distingue el motivo para los
 *             logs; a quien visita el sitio le alcanza con un mensaje)
 *
 * `texts` trae los textos ya traducidos.
 */

const ENDPOINT = '/api/now-playing.json';

// Al volver a la pestaña se vuelve a pedir, pero no antes de este tiempo: el
// endpoint cachea 30 s, así que pedir más seguido no trae nada nuevo.
const REFRESH_AFTER_MS = 60_000;

// Cuántos temas muestra la lista. El endpoint trae hasta seis (el que suena
// más los últimos cinco); la lista toma los cinco más recientes, contando el
// que suena. Si cambia, cambia también el texto "Últimos 5".
const TRACKS_IN_LIST = 5;

// ID fijo: el widget aparece una sola vez por página (en el About). Lo usa
// aria-labelledby para que la lista tome su nombre del label visible.
const LIST_LABEL_ID = 'now-playing-list-label';

/*
 * Alto de cada fila de la lista: 44 px con un dedo (la medida táctil
 * recomendada) y 28 px con mouse o trackpad, por encima de los 24 px que pide
 * WCAG 2.5.8 y lo bastante compacto para que el widget no supere al texto
 * del About en escritorio. Lo decide el tipo de puntero, no el ancho de
 * pantalla: una tablet en horizontal es ancha y se usa con el dedo.
 */
const ROW_HEIGHT = 'h-11 pointer-fine:h-7';

/*
 * Convierte la respuesta del endpoint en lo que necesita la vista. El
 * endpoint siempre manda JSON con `state`, también cuando responde un error,
 * así que el JSON se lee sin mirar el código HTTP.
 *
 * Cada respuesta nueva vuelve a destacar el tema más reciente
 * (selectedIndex 0): si se conservara la posición elegida, con datos nuevos
 * quedaría elegido otro tema sin aviso.
 */
function viewFromResponse(body) {
  if (body?.state === 'ok' && body.tracks?.length > 0) {
    return { status: 'ok', tracks: body.tracks.slice(0, TRACKS_IN_LIST), selectedIndex: 0 };
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

  // Pone un tema en el tocadiscos.
  function selectTrack(index) {
    if (index === view.selectedIndex) return;
    setView({ ...view, selectedIndex: index });
  }

  const featured = view.status === 'ok' ? view.tracks[view.selectedIndex] : null;
  // El cartel dice si estoy escuchando algo, no si suena el tema elegido.
  const isLive = view.status === 'ok' && view.tracks.some((track) => track.isNowPlaying);

  return (
    <div>
      {/* En tinta secundaria y no en terracota: el widget no compite con
          el eyebrow del About. */}
      <h3 className="text-[11px] font-mono tracking-[0.2em] uppercase text-(--ink-secondary)">{texts.label}</h3>

      {/* El alto de la card se anima: sigue al del contenido (medido abajo)
          con una transición CSS, así el paso entre estados desliza en vez de
          saltar. Elegir un tema no cambia el alto: el destacado mide
          siempre lo que el disco.
          box-content: el alto medido es el del contenido con su padding, y
          el borde va por fuera. Con movimiento reducido, la regla global de
          global.css deja la transición en 0 y el cambio es instantáneo. */}
      <div
        className="mt-3 box-content overflow-hidden rounded-xl border border-(--border-default) bg-(--color-surface) transition-[height] duration-600 ease-expo-out"
        style={{ height: contentHeight ?? 'auto' }}
      >
        <div ref={contentRef} className="p-4">
          {/* Fila de arriba: el crédito a la izquierda y el cartel a la
              derecha. Los dos están siempre, en cualquier estado (el cartel,
              apagado mientras carga o ante un error: no hay nada que diga
              que suena algo), y compartir la fila ahorra un renglón. */}
          <div className="flex items-center justify-between gap-3">
            <a
              href="https://www.last.fm"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="text-[11px] font-mono tracking-[0.18em] transition-colors duration-300 ease-expo-out text-(--ink-secondary) hover:text-accent"
            >
              {texts.credit}
              <span className="sr-only select-none"> {texts.new_tab}</span>
            </a>
            <LiveSign isLive={isLive} texts={texts} />
          </div>

          <div className="mt-3">
            {view.status === 'loading' && <LoadingSkeleton label={texts.loading} />}

            {view.status === 'ok' && (
              <>
                <Turntable track={featured} texts={texts} />
                {view.tracks.length > 1 && (
                  <Tracklist
                    tracks={view.tracks}
                    selectedIndex={view.selectedIndex}
                    onSelect={selectTrack}
                    texts={texts}
                  />
                )}
              </>
            )}

            {view.status === 'empty' && <EmptyTurntable message={texts.empty} />}
            {view.status === 'private' && <EmptyTurntable message={texts.private} />}
            {view.status === 'error' && <EmptyTurntable message={texts.error} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * Cartel "En vivo", como el "On Air" de un estudio: un rectángulo chico con
 * el texto adentro, sin animación.
 *
 * - Apagado: borde y texto tenues, como un cartel sin corriente.
 * - Prendido: relleno terracota sólido con el texto en la tinta oscura de la
 *   marca (#111110), fija en los dos temas porque el fondo terracota también
 *   lo es. Contraste 5:1.
 *
 * El estado no depende solo del color (WCAG 1.4.1): prendido, el cartel pasa
 * de un contorno a un bloque lleno.
 *
 * Para el lector de pantalla, lo visible va oculto (aria-hidden) y solo se
 * anuncia "Sonando ahora" cuando está prendido. Apagado no se anuncia nada:
 * el texto "En vivo" leído sería falso, y "No está sonando" tampoco sería
 * cierto mientras carga o ante un error, cuando no se sabe.
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
      {isLive && <span className="sr-only">{texts.status_playing}</span>}
    </div>
  );
}

/*
 * El tema destacado: el disco y, al lado, el título (link a su página en
 * Last.fm, como piden los términos de la API) y el artista.
 *
 * El texto va centrado al lado del disco y el título se corta en dos líneas
 * (solo visual: el lector de pantalla lee el título completo), así el bloque
 * mide siempre lo que el disco y elegir otro tema no cambia el alto.
 */
function Turntable({ track, texts }) {
  const byline = track.album ? `${track.artist} — ${track.album}` : track.artist;

  return (
    <div className="flex items-center gap-4">
      <Vinyl />

      {/* key: al cambiar de tema el bloque se vuelve a montar y entra con
          un fade corto. */}
      <div key={`${track.url}-${track.playedAt}`} className="min-w-0 motion-safe:animate-fade-in">
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          className="line-clamp-2 font-display text-base leading-tight text-(--ink-primary) underline decoration-(--border-strong) underline-offset-4 transition-[color,text-decoration-color,text-underline-offset] duration-300 ease-expo-out hover:text-accent hover:decoration-accent hover:underline-offset-8"
        >
          {track.title}
          {/* select-none: el texto sr-only sigue siendo seleccionable y
              aparecería al copiar el título. */}
          <span className="sr-only select-none"> {texts.track_link}</span>
        </a>

        {byline && <p className="mt-1 truncate text-xs leading-relaxed text-(--ink-secondary)">{byline}</p>}
      </div>
    </div>
  );
}

/*
 * Los últimos cinco, como el listado de un disco, según el patrón Listbox de
 * WAI-ARIA (selección única):
 *
 * - La lista incluye al tema destacado, marcado como elegido, y el orden no
 *   cambia nunca: si la fila elegida desapareciera, las demás se correrían
 *   bajo el cursor.
 * - La selección sigue al foco: las flechas mueven y eligen a la vez, porque
 *   el cambio es local e instantáneo (no hace ningún pedido).
 * - Teclado: Tab entra a la fila elegida (las demás quedan con tabindex -1),
 *   flecha abajo y arriba van a la siguiente y a la anterior, Inicio y Fin a
 *   la primera y a la última, y Tab sale.
 * - Las filas no tienen links adentro (el patrón no lo admite): el link a
 *   Last.fm es el título del destacado.
 */
function Tracklist({ tracks, selectedIndex, onSelect, texts }) {
  const optionRefs = useRef([]);

  function selectAndFocus(index) {
    onSelect(index);
    optionRefs.current[index].focus();
  }

  function onListKeyDown(event) {
    const last = tracks.length - 1;
    if (event.key === 'ArrowDown') selectAndFocus(Math.min(selectedIndex + 1, last));
    else if (event.key === 'ArrowUp') selectAndFocus(Math.max(selectedIndex - 1, 0));
    else if (event.key === 'Home') selectAndFocus(0);
    else if (event.key === 'End') selectAndFocus(last);
    else return;
    // Que las flechas, Inicio y Fin no scrolleen la página.
    event.preventDefault();
  }

  return (
    <div className="mt-3">
      <p
        id={LIST_LABEL_ID}
        className="text-[11px] font-mono uppercase tracking-[0.18em] text-(--ink-secondary)"
      >
        {texts.list_label}
      </p>

      <ul role="listbox" aria-labelledby={LIST_LABEL_ID} onKeyDown={onListKeyDown} className="mt-1">
        {tracks.map((track, index) => {
          const isSelected = index === selectedIndex;
          return (
            <li
              key={`${index}-${track.url}`}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              role="option"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelect(index)}
              data-cursor="link"
              className={`group flex items-center gap-3 ${ROW_HEIGHT} -mx-2 px-2 rounded-lg cursor-pointer text-xs transition-colors duration-300 ease-expo-out ${
                isSelected ? 'bg-(--color-surface-hover) font-medium' : ''
              }`}
            >
              <span aria-hidden="true" className="flex items-center w-5 shrink-0">
                <TrackMarker number={index + 1} isPlaying={track.isNowPlaying} isSelected={isSelected} />
              </span>

              {/* Título y artista en una sola línea. El artista, con su
                  separador, entra al lado del título o baja a una segunda
                  línea que no se ve (flex-wrap, alto de una línea y
                  overflow-hidden): así nunca queda un "·" suelto. Si el
                  título solo no entra, se corta con "…". El artista sigue en
                  el DOM, así que el lector de pantalla lo lee igual. */}
              <span className="flex flex-1 flex-wrap h-4 min-w-0 overflow-hidden">
                <span className="max-w-full truncate text-(--ink-primary) transition-colors duration-300 ease-expo-out group-hover:text-accent">
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

              {track.isNowPlaying && <span className="sr-only">{texts.status_playing}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/*
 * Lo que va a la izquierda de cada fila: el ecualizador si el tema suena
 * (aunque esté elegido otro: el cartel dice que algo suena, el ecualizador
 * dice cuál), un mini disco si es el que está en el tocadiscos, y si no, su
 * número. El mini disco hace que el elegido no se distinga solo por el color.
 */
function TrackMarker({ number, isPlaying, isSelected }) {
  if (isPlaying) return <Equalizer />;
  if (isSelected) {
    return (
      <span className="flex items-center justify-center size-2.5 rounded-full bg-accent">
        <span className="size-1 rounded-full bg-(--color-surface-hover)" />
      </span>
    );
  }
  return (
    <span className="font-mono text-[11px] text-(--ink-secondary)">
      {String(number).padStart(2, '0')}
    </span>
  );
}

/*
 * El vinilo. Es un objeto, como una imagen: el cuerpo y la etiqueta tienen
 * los mismos colores en los dos temas. El borde va en --ink-muted para que
 * el disco se distinga de la card también en tema oscuro, donde el negro del
 * disco y el de la card casi coinciden.
 *
 * Gira siempre, con motion-safe: con movimiento reducido queda quieto (y sin
 * motion-safe, la regla global de global.css haría que una animación
 * infinita parpadee). El reflejo va en otra capa que no gira, como en un
 * disco de verdad: lo que se ve girar es la G.
 *
 * La G es /favicon.svg como imagen: el trazado vive en un solo archivo, y si
 * la marca cambia, el disco la sigue.
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
          <circle cx="50" cy="50" r="49.25" fill={RECORD_COLOR} strokeWidth="1.5" className="stroke-(--ink-muted)" />
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

      {/* Reflejo fijo: una franja de luz en diagonal que no gira. */}
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

/*
 * Vacío, privado o error: el disco y el mensaje en el lugar del título. La
 * card queda del alto del disco, compacta pero no vacía.
 */
function EmptyTurntable({ message }) {
  return (
    <div className="flex items-center gap-4 motion-safe:animate-fade-in">
      <Vinyl />
      <p className="text-xs leading-relaxed text-(--ink-secondary)">{message}</p>
    </div>
  );
}

/*
 * Tres barras que suben y bajan en la fila del tema que suena. Con
 * movimiento reducido no se animan (motion-safe) y quedan quietas a
 * distintas alturas.
 */
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

/*
 * Mismas medidas que el contenido más común (el destacado y cinco filas),
 * así el paso de "cargando" a los datos no cambia el alto de la card.
 */
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
