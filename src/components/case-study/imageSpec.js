/*
 * Traducción del vocabulario de imágenes a layout: qué ancho, qué recorte y qué
 * `sizes` le toca a cada `type`. La dirección de arte (qué se muestra, con qué
 * luz y color) vive en `.claude/rules/imagenes.md`; acá solo lo que necesita
 * el código.
 *
 * Por cada tipo:
 * - bleed:    true = va a sangre, de borde a borde del viewport, fuera del
 *             shell de 1280px. Solo mockup y long-strip, las dos piezas que
 *             muestran el sitio entero.
 * - aspect:   recorte en desktop (md+). null = sin recorte: la imagen se ve
 *             entera y define su alto. La tira significa su largo y el mockup
 *             es una composición cerrada, así que ninguno se recorta.
 * - frame:    proporción nominal, para reservar el alto antes de que la imagen
 *             cargue (evita el salto de layout). Los tipos sin recorte la
 *             pueden sobrescribir con el `frame` del brief.
 * - parallax: la imagen se mueve ±24px al scrollear. Necesita recorte, porque
 *             se mueve dentro de un contenedor de alto fijo.
 *
 * El ancho lo decide QUÉ es la imagen, nunca DÓNDE cae: por eso es un tipo
 * (mockup) y no "el slot hero va a sangre".
 */
export const IMAGE_TYPE_SPEC = {
  mockup: {
    bleed: true,
    aspect: null,
    frame: { width: 1280, height: 549 },
    parallax: false,
  },
  'long-strip': {
    bleed: true,
    aspect: null,
    frame: { width: 1200, height: 3600 },
    parallax: false,
  },
  'screen-cluster': {
    bleed: false,
    aspect: 'wide',
    frame: { width: 1200, height: 800 },
    parallax: true,
  },
  palette: {
    bleed: false,
    aspect: 'video',
    frame: { width: 1600, height: 900 },
    parallax: true,
  },
  diagram: {
    bleed: false,
    aspect: 'wide',
    frame: { width: 1200, height: 800 },
    parallax: true,
  },
  detail: {
    bleed: false,
    aspect: 'wide',
    frame: { width: 1200, height: 800 },
    parallax: true,
  },
};

// A sangre la imagen ocupa el viewport entero: 100vw es el valor exacto.
export const SIZES_BLEED = '100vw';

/*
 * Dentro del shell (`max-w-7xl` = 1280px, con el gutter
 * `px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32`). Los escalones salen del
 * layout real:
 *   < 1024px  el gutter va de 24 a 40px por lado; 100vw sobra un poco, que
 *             es el lado seguro (nunca baja una variante borrosa).
 *   1024-1279 gutter de 64px por lado = 8rem en total.
 *   1280-1471 gutter de 96px por lado = 12rem en total.
 *   >= 1472   el shell toca su máximo y queda clavado en 1280px.
 * Si el shell cambia de ancho, estos valores se mueven en la misma pasada.
 */
export const SIZES_SHELL = [
  '(max-width: 1023px) 100vw',
  '(max-width: 1279px) calc(100vw - 8rem)',
  '(max-width: 1471px) calc(100vw - 12rem)',
  '1280px',
].join(', ');

// Las cards del home ocupan una columna del shell en desktop; la forma cambia el alto, no el ancho.
export const SIZES_COVER = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px';

/*
 * Card `portrait` (3:4 desde md) con un cover cuadrado: object-cover escala la
 * imagen por el alto, así que se dibuja a 4/3 del ancho de la card (50vw → 67vw,
 * 640px → 854px). Con SIZES_COVER el navegador pediría una variante un tercio
 * más chica y se vería blanda. En mobile la card vuelve a 4:3: queda igual.
 * Si algún día el cover se exporta en 3:4, esa card vuelve a SIZES_COVER.
 */
export const SIZES_COVER_PORTRAIT = '(max-width: 768px) 100vw, (max-width: 1280px) 67vw, 854px';

// El thumbnail de "Próximo proyecto": ancho completo en mobile, 160px como máximo en desktop.
export const SIZES_NEXT_THUMBNAIL = '(max-width: 768px) 100vw, 160px';

// Los anchos del srcset son los mismos que generaba next/image por defecto, más el ancho original.
const SRCSET_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048];

/*
 * Anchos para el `srcset` de una imagen: los de la lista que entran en el
 * archivo original, más el original. Nunca uno más grande que el archivo:
 * agrandar una imagen solo suma peso sin sumar detalle.
 */
export function srcsetWidthsFor(image) {
  const smallerWidths = SRCSET_WIDTHS.filter((width) => width < image.width);
  return [...smallerWidths, image.width];
}

// Calidad de compresión: 75, la que usaba next/image por defecto.
export const IMAGE_QUALITY = 75;
