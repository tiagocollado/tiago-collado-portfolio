import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Imagen de Open Graph generada en build time: la marca G sobre el fondo
 * oscuro, centrada. Nada más.
 *
 * Por qué existe: sin una og:image declarada, el scraper de la red social
 * agarra la primera imagen grande del HTML (el cover de un case study).
 * Este archivo fuerza que SIEMPRE se use la marca.
 *
 * ⚠️ Por qué NO lleva texto (la versión anterior sí)
 * --------------------------------------------------
 * 1. **El recorte.** WhatsApp y varios clientes de chat no muestran la card
 *    ancha de 1200x630: recortan un CUADRADO del centro (x de ~285 a ~915).
 *    La composición anterior estaba alineada a la izquierda, así que ese
 *    recorte entraba por la mitad del wordmark y se leía "ya" con el resto
 *    del texto ilegible. Una marca centrada sobrevive cualquier recorte.
 *
 * 2. **La tipografía.** Al no haber texto, esta imagen ya no depende de
 *    Space Grotesk. Antes cargaba los TTF del repo y por eso F3 (cambio de
 *    tipografía) la arrastraba: si se cambiaba la fuente sin rehacer la OG,
 *    la miniatura quedaba con una tipografía que el sitio ya no usa. Ahora
 *    F3 no la toca.
 *
 * 3. **Redundancia.** WhatsApp, LinkedIn y X ya muestran el título
 *    ("Gotya by Tiago Collado") y la descripción como TEXTO al lado de la
 *    miniatura. Repetirlos adentro de la imagen no sumaba información.
 *
 * ⚠️ Las dos imágenes (es / en) ahora son IDÉNTICAS byte a byte, y está
 * bien: al no haber texto no hay nada que localizar. Ojo con §9.15 de
 * CLAUDE.md, que describe imágenes idénticas entre locales como el síntoma
 * de un bug — ese caso era no leer `params`. Acá es intencional.
 *
 * Al vivir en app/[locale]/, la convención de Next hace que aplique a este
 * segmento y a todos los de abajo (incluido /projects/[slug]).
 */

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Gotya by Tiago Collado'

// Prerenderea la imagen en build time en vez de generarla on-demand en cada
// scrape. Además evita el bug de §9.13: mientras la ruta es dinámica, los
// errores de satori no aparecen en el build y explotan recién en producción.
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }]
}

// Mismo token que globals.css en dark mode, hardcodeado porque ImageResponse
// no tiene acceso a las CSS variables del sitio.
const BG = '#111110'

export default async function OpenGraphImage() {
  /**
   * La marca se lee del MISMO archivo que el favicon, no se duplica el path
   * del SVG acá. Si algún día cambia el logotipo, se toca `icon.svg` y esta
   * imagen se actualiza sola.
   *
   * Va como data URI en un <img> y no como <svg> inline porque es el camino
   * que satori soporta de forma más confiable.
   */
  const svg = await readFile(join(process.cwd(), 'src', 'app', 'icon.svg'))
  const mark = `data:image/svg+xml;base64,${svg.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: BG,
        }}
      >
        {/* Medidas verificadas decodificando el PNG generado, no estimadas.
            La tinta real de la marca mide 315x314 px dentro de este box de
            460, o sea ~68%: el icon.svg tiene su propio encuadre interno.
            Sobre el recorte cuadrado de 630 que hace WhatsApp eso es ~50%
            del cuadro, que es el objetivo. El centro de la tinta cae a 1px
            del centro del lienzo, asi que la marca se lee centrada.
            Si cambia el path de icon.svg, volver a medir: satori dibuja un
            <img> que no puede resolver como elemento vacio y el build pasa
            igual (CLAUDE.md 9.26). */}
        {/* Este <img> NO se migra a next/image y la regla se apaga a mano.
            Acá no rendea el browser sino satori, que arma el PNG en build
            time y solo entiende un subset de HTML/CSS: no ejecuta React ni
            sabe nada del optimizador de imágenes de Next. Un <Image /> saldría
            como un elemento vacío y el PNG se generaría igual, sin la marca
            (ver CLAUDE.md 9.26 — un build verde no prueba que se haya
            dibujado). Es la única excepción del repo: el resto de los <img>
            ya son next/image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mark} width={460} height={460} alt="" />
      </div>
    ),
    size
  )
}
