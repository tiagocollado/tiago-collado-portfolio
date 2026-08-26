import { notFound } from 'next/navigation'
import { projects } from '@/data/projects'
import { Locale } from '@/types'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import CaseStudySidebar from '@/components/case-study/CaseStudySidebar'
import CaseStudySection from '@/components/case-study/CaseStudySection'
import CaseStudyImage from '@/components/case-study/CaseStudyImage'
import CaseStudyHeader from '@/components/case-study/CaseStudyHeader'
import CaseStudyNextNav from '@/components/case-study/CaseStudyNextNav'
import Footer from '@/components/ui/Footer'

interface ProjectPageProps {
  params: Promise<{
    locale: Locale
    slug: string
  }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

// Devuelve el siguiente proyecto en el carrusel, con wrap-around al
// primero cuando estamos en el último.
function getNextProject(currentOrder: number) {
  const eligible = [...projects].sort((a, b) => a.order - b.order)
  const idx = eligible.findIndex((p) => p.order === currentOrder)
  return eligible[(idx + 1) % eligible.length]
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const project = projects.find((p) => p.slug === slug)
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

  return (
    // `id="top"` es el ancla del back-to-top del Footer, que ahora tambien
    // cierra los case studies. Sin este id el ancla no existe y el boton
    // queda muerto sin dar ningun error (ver Footer.tsx).
    // El `pb` de abajo se fue: el propio Footer aporta el aire final con su
    // `pt-16 md:pt-20` + `pb-10 md:pb-12`, igual que en el home.
    <div id="top" className="min-h-screen">

      {/* ============ HEADER ============
          Cabecera entera (back link + type + h1 con SplitText + tags + tagline
          + CTAs) en un client component que orquesta cascade entrance via
          variants stagger. La page sigue siendo server (SEO / SSG). */}
      <div className="px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pt-16 md:pt-20">
        <CaseStudyHeader project={project} locale={locale} />
      </div>

      {/* ============ CASE STUDY BODY (Awwwards layout) ============
          Solo se renderea si el proyecto tiene awwwardsLayout: true Y se
          pudieron cargar todas las keys i18n. Si no, queda solo el header
          + la navegación de abajo. */}
      {project.awwwardsLayout && hasCaseStudy && (
        <div className="px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 mt-12 md:mt-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Sidebar metadata — col-span-3 sticky en lg+, full-width arriba en mobile */}
            <div className="lg:col-span-3">
              <CaseStudySidebar project={project} locale={locale} />
            </div>

            {/* Main editorial — col-span-9, secciones con imágenes intercaladas */}
            <div className="lg:col-span-9 space-y-20 md:space-y-28">

              {/* ⚠️ Las cuatro imágenes se rendean solo si el brief tiene
                  `src` — de ahí el `?.src &&` en vez de un `?.[n] &&` pelado.
                  Sin esa guarda, un brief sin imagen cae al placeholder
                  "BUILDING" de CaseStudyImage, y con las 28 imágenes
                  provisorias dadas de baja eso llenaba el sitio de cajas
                  punteadas "en obra": una señal peor que la que se quiso
                  evitar, en un portfolio que ya está circulando entre
                  reclutadores. Los `imageBriefs` siguen en `projects.ts`
                  documentando qué va en cada slot; al agregarle `src` a uno,
                  la imagen vuelve a aparecer sola. */}

              {/* INTRO — sin label, hook 2-3 líneas + 1ª imagen */}
              <CaseStudySection label={null}>
                <p
                  className="font-display text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight max-w-3xl text-balance"
                  style={{ color: 'var(--ink-primary)' }}
                >
                  {awwwardsContent.intro}
                </p>
                {project.imageBriefs?.[0]?.src && (
                  <CaseStudyImage
                    alt={project.imageBriefs[0].alt[locale]}
                    aspectRatio="wide"
                    src={project.imageBriefs[0].src}
                    description={project.imageBriefs[0].description}
                    prompt={project.imageBriefs[0].prompt}
                  />
                )}
              </CaseStudySection>

              {/* EL DESAFÍO — label + 1 párrafo + 2ª imagen */}
              <CaseStudySection label={cs('cs_challenge')}>
                <p
                  className="text-lg md:text-xl leading-relaxed max-w-2xl text-pretty"
                  style={{ color: 'var(--ink-secondary)' }}
                >
                  {awwwardsContent.challenge}
                </p>
                {project.imageBriefs?.[1]?.src && (
                  <CaseStudyImage
                    alt={project.imageBriefs[1].alt[locale]}
                    aspectRatio="wide"
                    src={project.imageBriefs[1].src}
                    description={project.imageBriefs[1].description}
                    prompt={project.imageBriefs[1].prompt}
                  />
                )}
              </CaseStudySection>

              {/* CÓMO LO RESOLVÍ — 3 decisiones (titulo + body) intercaladas con 2 imágenes */}
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

                {/* Imagen contextual entre decisiones — material que ilustra UNA de las decisiones */}
                {project.imageBriefs?.[2]?.src && (
                  <CaseStudyImage
                    alt={project.imageBriefs[2].alt[locale]}
                    aspectRatio="wide"
                    src={project.imageBriefs[2].src}
                    description={project.imageBriefs[2].description}
                    prompt={project.imageBriefs[2].prompt}
                  />
                )}
              </CaseStudySection>

              {/* LO ENTREGADO — lista visual de outputs */}
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

                {/* Imagen final — outputs/entregables del proyecto */}
                {project.imageBriefs?.[3]?.src && (
                  <CaseStudyImage
                    alt={project.imageBriefs[3].alt[locale]}
                    aspectRatio="wide"
                    src={project.imageBriefs[3].src}
                    description={project.imageBriefs[3].description}
                    prompt={project.imageBriefs[3].prompt}
                  />
                )}
              </CaseStudySection>

              {/* CIERRE — 2-3 líneas */}
              <CaseStudySection label={cs('cs_closing')}>
                <p
                  className="text-lg md:text-xl leading-relaxed max-w-2xl text-pretty"
                  style={{ color: 'var(--ink-secondary)' }}
                >
                  {awwwardsContent.closing}
                </p>
              </CaseStudySection>

            </div>
          </div>
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
