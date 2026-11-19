/*
 * Ancho, recorte y `sizes` de cada `type` de imagen. El ancho lo decide qué
 * es la imagen, nunca dónde cae.
 * - bleed: a sangre, fuera del shell de 1280px.
 * - aspect: recorte desde md; null = se ve entera y define su alto.
 * - frame: proporción para reservar el alto antes de que cargue.
 * - parallax: ±24px al scrollear; necesita recorte.
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

export const SIZES_BLEED = '100vw';

/*
 * Sale del shell de 1280px y su gutter: 100vw abajo de 1024 (sobra un poco,
 * el lado seguro), menos 8rem hasta 1279, menos 12rem hasta 1471 y 1280px
 * desde ahí. Si el shell cambia, esto cambia con él.
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

// Nunca más ancho que el original: agrandar suma peso sin sumar detalle.
export function srcsetWidthsFor(image) {
  const smallerWidths = SRCSET_WIDTHS.filter((width) => width < image.width);
  return [...smallerWidths, image.width];
}

// Calidad de compresión: 75, la que usaba next/image por defecto.
export const IMAGE_QUALITY = 75;
