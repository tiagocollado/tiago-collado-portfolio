import { notFound } from 'next/navigation'
import { publishedProjects } from '@/data/projects'
import { CaseStudyImageSlot, Locale } from '@/types'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import CaseStudyMetaBar from '@/components/case-study/CaseStudyMetaBar'
import CaseStudySection from '@/components/case-study/CaseStudySection'
import CaseStudyImageRun from '@/components/case-study/CaseStudyImageRun'
import CaseStudyHeader from '@/components/case-study/CaseStudyHeader'
import CaseStudyNextNav from '@/components/case-study/CaseStudyNextNav'
import Footer from '@/components/ui/Footer'

interface ProjectPageProps {
  params: Promise<{
    locale: Locale
    slug: string
  }>
}

/*
 * Solo se buildean las páginas de los proyectos publicados.
 *
 * ⚠️ Sacarlos de acá NO alcanza para que den 404. Por defecto Next genera a
 * pedido cualquier slug que no esté en esta lista (`dynamicParams = true`),
 * y como los datos siguen en el repo, la página de un proyecto oculto se
 * seguiría viendo entrando por la URL. `dynamicParams = false` corta eso: un
 * slug que no está en la lista da 404, sin render a pedido.
 */
export async function generateStaticParams() {
  return publishedProjects.map((project) => ({ slug: project.slug }))
}

export const dynamicParams = false

/**
 * El shell de la marca: gutter afuera, ancho máximo adentro.
 *
 * ⚠️ El `max-w` y el gutter NUNCA van en el mismo elemento — con
 * `box-sizing: border-box` el padding cuenta adentro del `max-w` y el
 * contenido queda corrido (ver `.claude/rules/design-tokens.md`). Existe como
 * componente y no como string suelto para que el gutter sea literalmente el
 * mismo en los seis bloques de la página.
 *
 * Todo lo que NO es una imagen a sangre vive adentro de un Shell.
 */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  )
}

// Devuelve el siguiente proyecto publicado, en el orden del home, y vuelve
// al primero cuando estamos en el último. Antes recorría los 7 del array, así
// que al final de Ritual aparecía Multibrand, que no está publicado.
function getNextProject(currentOrder: number) {
  const idx = publishedProjects.findIndex((p) => p.order === currentOrder)
  return publishedProjects[(idx + 1) % publishedProjects.length]
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  // Se busca en los publicados, no en todos: es la segunda red, por si algún
  // día se toca `dynamicParams`. Un proyecto oculto da 404 igual.
  const project = publishedProjects.find((p) => p.slug === slug)
  if (!project) notFound()

  const cs = await getTranslations('case_study')

  // Cargar contenido del caso de estudio (shape Awwwards: intro/challenge/
  // decision_1-3/delivered_1-3/closing). Si falta alguna key — porque el
  // bloque case_study_<slug> no fue creado en i18n — el catch deja
  // hasCaseStudy en false y el body simplemente no se renderea.
  const caseStudyKey = `case_study_${slug}`
  let hasCaseStudy = false
  const awwwardsContent: Record<string, string> = {}

  if (project.awwwardsLayout) {
    try {
      const t = await getTranslations(caseStudyKey)
      const awwwardsKeys = [
        'intro',
        'challenge',
        'decision_1_title', 'decision_1_body',
        'decision_2_title', 'decision_2_body',
        'decision_3_title', 'decision_3_body',
        'delivered_1', 'delivered_2', 'delivered_3',
        'closing',
      ]
      for (const key of awwwardsKeys) {
        awwwardsContent[key] = t(key)
      }
      // 'process' es opcional: solo algunos case studies cuentan el cómo
      // arrancaron antes de listar las decisiones. t.has() evita que un
      // proyecto sin la key tire y apague el case study entero.
      if (t.has('process')) awwwardsContent.process = t('process')
      hasCaseStudy = true
    } catch {
      hasCaseStudy = false
    }
  }

  const nextProject = getNextProject(project.order)

  /*
   * Las imágenes ya NO están atadas a cuatro posiciones fijas.
   *
   * Antes la page leía `imageBriefs[0]` … `[3]` en cuatro puntos hardcodeados,
   * uno por sección. Esa cuota de 4 se decidió antes de saber qué necesitaba
   * cada caso, así que obligaba a inventar qué poner en cada slot — y una
   * quinta imagen no se rendeaba en ningún lado sin dar error.
   *
   * Ahora cada brief declara su `slot` y la page pregunta por slot. De ahí
   * salen las dos cosas que el layout viejo no podía dar:
   * - cantidad libre por proyecto (pueden ser 2 o 6),
   * - varias imágenes en el mismo slot, o sea grupos de 2-3 seguidas sin
   *   texto entre medio, en vez de la alternancia 1 a 1 párrafo-imagen.
   *
   * El filtro por `src` es el mismo de antes: un brief sin imagen no renderea
   * el placeholder "BUILDING". Con 28 imágenes por producir, esas cajas
   * punteadas convertían el sitio en una obra en construcción. Los briefs
   * sin `src` siguen en `projects.ts` documentando qué va en cada lugar.
   */
  const imagesIn = (slot: CaseStudyImageSlot) =>
    (project.imageBriefs ?? []).filter((b) => b.slot === slot && b.src)

  return (
    // `id="top"` es el ancla del back-to-top del Footer, que también cierra
    // los case studies. Sin este id el ancla no existe y el botón queda
    // muerto sin dar ningún error (ver Footer.tsx).
    <div id="top" className="min-h-screen">

      {/* ============ HEADER ============
          Cabecera entera (back link + servicios + h1 con SplitText + tagline
          + CTAs) en un client component que orquesta cascade entrance via
          variants stagger. La page sigue siendo server (SEO / SSG). */}
      <div className="pt-16 md:pt-20">
        <Shell>
          <CaseStudyHeader project={project} locale={locale} />
        </Shell>
      </div>

      {/* ============ CASE STUDY BODY ============
          Solo se renderea si el proyecto tiene awwwardsLayout: true Y se
          pudieron cargar todas las keys i18n. Si no, queda solo el header
          + la navegación de abajo.

          ⚠️ La página ya no es una grilla de 12 columnas con sidebar: es una
          secuencia vertical de bloques hermanos, y cada uno declara su propio
          ancho. Ese cambio es lo que permite que una imagen vaya a sangre:
          mientras todo vivía adentro de `col-span-9`, ninguna imagen podía
          pasar de 944px. El `gap` de acá es el ritmo entre bloques; las
          imágenes agrupadas de un mismo slot van más juntas entre sí.

          ⚠️ Es `flex` + `gap` y no `space-y` porque la barra de metadata
          cambia de lugar según el breakpoint (ver METADATA abajo), y eso se
          hace con `order`. `space-y` pone el margen según el orden del DOM,
          no el visual: con `order` el bloque que sube quedaría sin separación
          y el que baja con margen de más. `gap` separa según el orden visual. */}
      {project.awwwardsLayout && hasCaseStudy && (
        <div className="mt-12 md:mt-16 flex flex-col gap-20 md:gap-28">

          {/* HERO — el mockup del sitio, a sangre. Es la misma composición
              que el cover del home en encuadre panorámico: hacés clic en la
              card y aterrizás en la misma imagen, ahora grande y completa. */}
          <CaseStudyImageRun briefs={imagesIn('hero')} locale={locale} priority />

          {/* INTRO — sin label, hook de 2-3 líneas */}
          <Shell>
            <CaseStudySection label={null}>
              <p
                className="font-display text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight max-w-3xl text-balance"
                style={{ color: 'var(--ink-primary)' }}
              >
                {awwwardsContent.intro}
              </p>
            </CaseStudySection>
          </Shell>

          {/* METADATA — barra horizontal, reemplaza al sidebar sticky.

              En MOBILE va debajo del intro; en DESKTOP, arriba de todo.
              La primera pantalla del celular es la que decide si alguien
              sigue scrolleando, y ahí tiene que estar la frase que explica
              el proyecto, no cuatro filas de metadata. Los estudios de
              referencia ponen la barra arriba porque ya tienen nombre; un
              portfolio que todavía no lo tiene necesita el gancho primero.
              En desktop se queda arriba, como en las referencias: ahí son
              dos filas anchas que se escanean de un vistazo, no cuatro
              filas apiladas que empujan todo lo demás.

              Por qué el DOM va en el orden de MOBILE y desktop se cruza con
              `md:order-first`, y no al revés: el hero y el intro no tienen
              nada enfocable, así que el orden de tabulación es el mismo en
              los dos breakpoints (back link → links de la barra). Y un lector
              de pantalla escucha primero de qué se trata el proyecto.

              El wrapper existe solo para llevar el `order`: tiene que ser
              hijo directo del flex. */}
          <div className="md:order-first">
            <Shell>
              <CaseStudyMetaBar project={project} locale={locale} />
            </Shell>
          </div>

          <CaseStudyImageRun briefs={imagesIn('intro')} locale={locale} />

          {/* EL DESAFÍO */}
          <Shell>
            <CaseStudySection label={cs('cs_challenge')}>
              {/* El desafío puede tener más de un párrafo: en el JSON van
                  separados por una línea en blanco (\n\n). Hace falta
                  partirlo acá porque HTML colapsa los saltos de línea, y un
                  solo <p> pegaría los dos párrafos en uno. Un challenge sin
                  línea en blanco da un array de un elemento y se ve igual
                  que antes. */}
              <div className="max-w-2xl space-y-6">
                {awwwardsContent.challenge.split('\n\n').map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-lg md:text-xl leading-relaxed text-pretty"
                    style={{ color: 'var(--ink-secondary)' }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </CaseStudySection>
          </Shell>
          {/* Pulso no tiene imagen acá, a propósito: su desafío era texto
              denso y conflictos de plantillas, y no hay nada visual honesto
              que mostrar. El run devuelve `null` y no deja hueco. */}
          <CaseStudyImageRun briefs={imagesIn('challenge')} locale={locale} />

          {/* CÓMO LO RESOLVÍ — 3 decisiones (título + body) */}
          <Shell>
            <CaseStudySection label={cs('cs_decisions')}>
              {/* Bajada opcional: cómo encaré el proyecto antes de entrar
                  en las decisiones puntuales. Si el case study no define
                  'process', no se renderea nada. */}
              {awwwardsContent.process && (
                <p
                  className="text-lg md:text-xl leading-relaxed max-w-2xl text-pretty"
                  style={{ color: 'var(--ink-secondary)' }}
                >
                  {awwwardsContent.process}
                </p>
              )}
              <ol className="space-y-12 md:space-y-16 list-none">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                    <span
                      className="md:col-span-1 text-xs font-mono"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      0{i}
                    </span>
                    <div className="md:col-span-11 space-y-3">
                      <h3
                        className="font-display text-xl md:text-2xl tracking-tight text-balance"
                        style={{ color: 'var(--ink-primary)' }}
                      >
                        {awwwardsContent[`decision_${i}_title`]}
                      </h3>
                      <p
                        className="text-base md:text-lg leading-relaxed max-w-2xl text-pretty"
                        style={{ color: 'var(--ink-secondary)' }}
                      >
                        {awwwardsContent[`decision_${i}_body`]}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </CaseStudySection>
          </Shell>
          <CaseStudyImageRun briefs={imagesIn('decisions')} locale={locale} />

          {/* LO ENTREGADO — lista visual de outputs */}
          <Shell>
            <CaseStudySection label={cs('cs_delivered')}>
              <ul className="space-y-4 list-none max-w-2xl">
                {[1, 2, 3].map((i) => (
                  <li
                    key={i}
                    className="flex gap-4 items-baseline pb-4 border-b"
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    <span
                      aria-hidden
                      className="text-xs font-mono shrink-0"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      →
                    </span>
                    <span
                      className="text-base md:text-lg font-display"
                      style={{ color: 'var(--ink-primary)' }}
                    >
                      {awwwardsContent[`delivered_${i}`]}
                    </span>
                  </li>
                ))}
              </ul>
            </CaseStudySection>
          </Shell>
          <CaseStudyImageRun briefs={imagesIn('delivered')} locale={locale} />

          {/* CIERRE — 2-3 líneas */}
          <Shell>
            <CaseStudySection label={cs('cs_closing')}>
              <p
                className="text-lg md:text-xl leading-relaxed max-w-2xl text-pretty"
                style={{ color: 'var(--ink-secondary)' }}
              >
                {awwwardsContent.closing}
              </p>
            </CaseStudySection>
          </Shell>
          <CaseStudyImageRun briefs={imagesIn('end')} locale={locale} />

        </div>
      )}

      {/* ============ PROJECT NAVIGATION ============
          Card prominente "Próximo proyecto" + pill ghost "Ver todos".
          Encapsulado en client component para tener cursor variants en hover. */}
      <CaseStudyNextNav nextProject={nextProject} locale={locale} />

      {/* ============ FOOTER ============
          Antes el case study cerraba en la card de "proximo proyecto" y no
          tenia pie. Ahora comparte el mismo cierre que el home, sobre todo
          por el back-to-top: al pie de un case study largo era el unico
          camino de vuelta arriba que faltaba. */}
      <Footer />

    </div>
  )
}
