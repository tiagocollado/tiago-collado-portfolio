import { CaseStudyImageType } from '@/types'

/**
 * Qué significa cada `type` del vocabulario, en términos de render.
 *
 * Este archivo es la traducción del vocabulario de imágenes a layout. La
 * dirección de arte —qué se fotografía, con qué luz, con qué color— vive en
 * `.claude/rules/imagenes.md`. Acá vive solo el ancho, el recorte y la
 * proporción, porque son lo único que necesita el código.
 *
 * Va en un módulo aparte, sin `'use client'`, a propósito: lo importan tanto
 * `CaseStudyImage` (client, por el parallax) como `CaseStudyImageRun`
 * (server, que decide el wrapper). Un objeto exportado desde un módulo
 * client y leído desde el server es un caso frágil de la frontera de React;
 * un módulo plano lo evita.
 */

/** Recortes disponibles. `null` = sin recorte, la imagen define su alto. */
export type AspectRatio = 'video' | 'square' | 'wide' | 'portrait'

export interface ImageTypeSpec {
  /**
   * `true` = la imagen va a sangre, de borde a borde del viewport, y se
   * renderea FUERA del shell de 1280px.
   *
   * Solo `mockup` y `long-strip`: las dos piezas que muestran el sitio
   * entero. El resto va al ancho del shell, y esa diferencia de escala es
   * lo que las hace leer como momentos de la página y no como una imagen
   * más de la serie.
   */
  bleed: boolean
  /**
   * Recorte en desktop (md+). `null` = sin recorte: la imagen se ve entera y
   * define ella misma el alto del bloque, igual que en mobile.
   *
   * La tira larga va en `null` por necesidad, no por gusto: su significado ES
   * su largo. Recortarla a cualquier proporción fija deja ver una franja del
   * medio y tira el resto. El mockup también: es una composición cerrada
   * (dispositivo, luz, sombra) y cualquier recorte le come el encuadre.
   */
  aspect: AspectRatio | null
  /**
   * Proporción nominal del archivo, para que `next/image` reserve el alto
   * antes de que la imagen cargue (evita el salto de layout / CLS).
   *
   * Solo importa la PROPORCIÓN, no que los números coincidan con los píxeles
   * reales. Un brief de un tipo sin recorte (`mockup`, `long-strip`) puede
   * sobrescribirla con `frame`, porque su proporción depende de la pieza.
   */
  frame: { width: number; height: number }
  /**
   * Si la imagen hace parallax al scrollear.
   *
   * Requiere recorte: el efecto mueve la imagen ±24px dentro de un container
   * de alto fijo. Sin recorte no hay container que la contenga, así que la
   * tira larga no lo lleva — y tampoco lo quiere: lo que el ojo quiere de una
   * tira es recorrerla.
   */
  parallax: boolean
}

export const IMAGE_TYPE_SPEC: Record<CaseStudyImageType, ImageTypeSpec> = {
  // El hero de cada case study: el mismo mockup que el cover del home, en
  // encuadre panorámico. A sangre, sin recorte, sin parallax.
  //
  // Es un tipo propio y no "el slot hero va a sangre" a propósito: el ancho
  // lo decide QUÉ es la imagen, nunca DÓNDE cae. Si el slot decidiera el
  // ancho, una tira puesta en `hero` y un mockup puesto en `intro` se
  // rendearían distinto según el lugar, y el nombre del archivo dejaría de
  // alcanzar para saber cómo se va a ver.
  //
  // 21:9 es el default (1280x549 es 21:9 con 1px de redondeo).
  mockup: {
    bleed: true,
    aspect: null,
    frame: { width: 1280, height: 549 },
    parallax: false,
  },
  // La página entera, capturada real. A sangre, sin recorte, sin parallax.
  // 1:3 es solo el default: cada brief declara su `frame` real, porque una
  // tira en una columna es muy alta y una partida en columnas puede ser 16:9.
  'long-strip': {
    bleed: true,
    aspect: null,
    frame: { width: 1200, height: 3600 },
    parallax: false,
  },
  // Dos o tres pantallas sobre un plano de color. 3:2 es el frame de
  // 1200x800 que ya usaba todo el case study.
  'screen-cluster': {
    bleed: false,
    aspect: 'wide',
    frame: { width: 1200, height: 800 },
    parallax: true,
  },
  // Bandas de color con su nombre. Van más anchas y más bajas que una
  // pantalla: 16:9 le da el formato de tira que tiene en la referencia.
  palette: {
    bleed: false,
    aspect: 'video',
    frame: { width: 1600, height: 900 },
    parallax: true,
  },
  // Una decisión con estructura. Su significado está en la estructura, así
  // que sobrevive a cualquier escala.
  diagram: {
    bleed: false,
    aspect: 'wide',
    frame: { width: 1200, height: 800 },
    parallax: true,
  },
  // Un recorte o zoom de UNA pantalla. Nunca la pantalla entera: a 330px
  // una pantalla completa es una mancha gris.
  detail: {
    bleed: false,
    aspect: 'wide',
    frame: { width: 1200, height: 800 },
    parallax: true,
  },
}

/**
 * `sizes` para una imagen a sangre. Ocupa el viewport entero, así que 100vw
 * es el valor exacto y no una estimación.
 */
export const SIZES_BLEED = '100vw'

/**
 * `sizes` para una imagen dentro del shell.
 *
 * ⚠️ Sin `sizes` correcto, `next/image` no sirve de nada: el browser asume
 * 100vw y baja la variante más grande del srcset. Antes este valor era
 * `944px` fijo, que era el ancho de la columna editorial cuando había
 * sidebar. Con la barra de metadata arriba, el ancho pasó a 1280px y el
 * valor viejo quedó mintiendo 336px.
 *
 * Los escalones salen del layout real, no a ojo. El shell es `max-w-7xl`
 * (1280px) adentro del gutter `px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32`:
 *
 *   < 1024px  el gutter va de 24 a 40px por lado. 100vw sobra un poco, y
 *             sobrar es el lado seguro: el browser baja una variante de más,
 *             nunca una borrosa.
 *   1024-1279 gutter lg:px-16 = 64px por lado = 8rem en total.
 *   1280-1471 gutter xl:px-24 = 96px por lado = 12rem en total.
 *   >= 1472   (1280 + 12rem) el max-w-7xl toca el techo y el ancho se
 *             clava en 1280px, sin importar cuánto mida la pantalla.
 */
export const SIZES_SHELL = [
  '(max-width: 1023px) 100vw',
  '(max-width: 1279px) calc(100vw - 8rem)',
  '(max-width: 1471px) calc(100vw - 12rem)',
  '1280px',
].join(', ')
