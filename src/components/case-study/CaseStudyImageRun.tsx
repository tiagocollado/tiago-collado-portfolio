import { CaseStudyImageBrief, Locale } from '@/types'
import { IMAGE_TYPE_SPEC } from './imageSpec'
import CaseStudyImage from './CaseStudyImage'

/**
 * Una tirada de imágenes de un mismo `slot`.
 *
 * Es el componente que reemplaza a los cuatro `<CaseStudyImage>` sueltos que
 * la page rendeaba en cuatro posiciones fijas. Recibe todos los briefs que
 * cayeron en un slot y los rendea seguidos, sin texto entre medio.
 *
 * Dos cosas que antes no se podían y ahora salen solas:
 *
 * 1. **Agrupar.** Varias imágenes con el mismo `slot` entran juntas, más
 *    apretadas entre sí (`space-y-6 md:space-y-8`) que la distancia que
 *    separa los bloques de la página (`space-y-20 md:space-y-28`). Esa
 *    diferencia de espaciado es lo que las hace leer como un grupo y no
 *    como cuatro imágenes sueltas (Proximidad).
 * 2. **Mezclar anchos.** El wrapper se decide por imagen, no por tirada: una
 *    tira a sangre y un diagrama dentro del shell pueden convivir en el
 *    mismo slot.
 *
 * Es server component: no tiene estado ni eventos, solo decide el wrapper.
 * La animación la trae adentro cada `CaseStudyImage`.
 */

/*
 * El gutter de la marca, textual e idéntico al del resto del sitio.
 *
 * ⚠️ El `max-w` y el gutter NUNCA van en el mismo elemento: con
 * `box-sizing: border-box` el padding cuenta adentro del `max-w` y el
 * contenido queda corrido respecto de las secciones que sí los separan
 * (ver `.claude/rules/design-tokens.md`). Por eso son dos divs.
 */
const GUTTER = 'px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32'

export default function CaseStudyImageRun({
  briefs,
  locale,
  priority = false,
}: {
  briefs: CaseStudyImageBrief[]
  locale: Locale
  /** `true` solo en el slot `hero`: su primera imagen es la candidata a LCP. */
  priority?: boolean
}) {
  // Un slot sin imágenes no renderea nada. Importa que sea `null` y no un
  // div vacío: el `gap` del padre se aplica entre hijos que existen, así que
  // un wrapper vacío dejaría un hueco de 80-112px donde no hay nada.
  // Pulso lo usa a propósito: su slot `challenge` no tiene imagen.
  if (briefs.length === 0) return null

  return (
    <div className="space-y-6 md:space-y-8">
      {briefs.map((brief, i) => {
        const image = (
          <CaseStudyImage
            type={brief.type}
            src={brief.src}
            alt={brief.alt[locale]}
            frame={brief.frame}
            // Solo la PRIMERA del hero: marcar varias como priority hace que
            // compitan entre sí y ninguna gana nada.
            priority={priority && i === 0}
            description={brief.description}
            prompt={brief.prompt}
          />
        )

        // A sangre: la imagen se rendea pelada, sin gutter ni shell, así que
        // ocupa el viewport de borde a borde. Son los únicos casos en toda
        // la página que salen del shell de 1280px (`mockup` y `long-strip`).
        if (IMAGE_TYPE_SPEC[brief.type].bleed) {
          return <div key={brief.src ?? i}>{image}</div>
        }

        return (
          <div key={brief.src ?? i} className={GUTTER}>
            <div className="max-w-7xl mx-auto">{image}</div>
          </div>
        )
      })}
    </div>
  )
}
