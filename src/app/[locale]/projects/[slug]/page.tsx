import { notFound } from 'next/navigation'
import { projects } from '@/data/projects'
import { Locale } from '@/types'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Gallery from '@/components/sections/Gallery'
import CaseStudySidebar from '@/components/case-study/CaseStudySidebar'
import CaseStudySection from '@/components/case-study/CaseStudySection'
import CaseStudyImage from '@/components/case-study/CaseStudyImage'

interface ProjectPageProps {
  params: Promise<{
    locale: Locale
    slug: string
  }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

// Devuelve el siguiente proyecto en el carrusel, saltando comingSoon
// y haciendo wrap-around al primero cuando estamos en el último.
function getNextProject(currentOrder: number) {
  const eligible = projects.filter((p) => !p.comingSoon).sort((a, b) => a.order - b.order)
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
  // decision_1-3/delivered_1-3/closing). Si las keys no existen — ej. el
  // proyecto está en comingSoon, o por algún motivo el case_study_<slug>
  // bloque no fue creado en i18n — el catch deja hasCaseStudy en false y
  // el body simplemente no se renderea.
  const caseStudyKey = `case_study_${slug}`
  let hasCaseStudy = false
  const awwwardsContent: Record<string, string> = {}

  if (!project.comingSoon && project.awwwardsLayout) {
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
      hasCaseStudy = true
    } catch {
      hasCaseStudy = false
    }
  }

  // Behance excluido (decisión: sacarlos del portfolio).
  const hasLinks = Boolean(
    project.links.live || project.links.github || project.links.githubBack
  )

  const nextProject = getNextProject(project.order)

  return (
    <div className="min-h-screen pb-24 md:pb-32">

      {/* ============ HEADER ============ */}
      <div className="px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pt-16 md:pt-20">
        <div className="max-w-4xl mx-auto">

          {/* Back link — la flecha se desliza 4px a la izquierda en hover
              (CSS group-hover, sin Framer para mantener la page como
              server component). */}
          <a
            href={`/${locale}`}
            className="group inline-flex items-center gap-2 text-sm mb-10 md:mb-14 transition-opacity duration-200 hover:opacity-70"
            style={{ color: 'var(--ink-secondary)' }}
          >
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 ease-expo-out group-hover:-translate-x-1"
            >
              ←
            </span>
            {cs('back')}
          </a>

          {/* 1. Tipo de proyecto */}
          <p
            className="text-xs font-mono tracking-[0.2em] uppercase mb-5"
            style={{ color: 'var(--color-accent)' }}
          >
            {project.type === 'ux' ? 'UX / UI Case Study'
              : project.type === 'fullstack' ? 'Full-stack Project'
              : 'Design Project'}
          </p>

          {/* 2. Título */}
          <h1
            className="font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-6 md:mb-8 text-balance"
            style={{ color: 'var(--ink-primary)' }}
          >
            {project.title}
          </h1>

          {/* 3. Herramientas / Tags — solo cuando NO awwwardsLayout.
              En layout Awwwards el stack vive en el sidebar (metadata.stack);
              mostrarlo acá duplica info. Para coming-soon (Retro Kicks) sí
              mostramos las tags porque no hay sidebar. */}
          {!project.awwwardsLayout && (
            <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono tracking-wide px-3 py-1.5 rounded-full border"
                  style={{
                    borderColor: 'var(--border-default)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--ink-secondary)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 4. Descripción / Tagline */}
          <p
            className="text-lg md:text-2xl leading-relaxed mb-10 md:mb-12 max-w-3xl text-balance"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {project.tagline[locale]}
          </p>

          {/* 5. CTAs del proyecto — pills compactos con flecha animada.
              En layout Awwwards los links viven en el sidebar (bloque Links
              al final, sticky), más sobrios y accesibles mientras se scrollea.
              Para coming-soon (Retro Kicks) sí mostramos los CTAs acá. */}
          {!project.awwwardsLayout && hasLinks && (
            <div className="flex flex-wrap gap-3 mb-12 md:mb-16">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: '#FFFFFF',
                  }}
                >
                  <span>{cs('view_live')}</span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
                  style={{
                    borderColor: 'var(--border-default)',
                    color: 'var(--ink-primary)',
                  }}
                >
                  <span>{cs('view_github_frontend')}</span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              )}
              {project.links.githubBack && (
                <a
                  href={project.links.githubBack}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
                  style={{
                    borderColor: 'var(--border-default)',
                    color: 'var(--ink-primary)',
                  }}
                >
                  <span>{cs('view_github_backend')}</span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============ CASE STUDY BODY (Awwwards layout) ============
          Solo se renderea si el proyecto tiene awwwardsLayout: true Y se
          pudieron cargar todas las keys i18n. Para coming-soon (Retro Kicks)
          no hay body — solo header + project navigation abajo. */}
      {project.awwwardsLayout && hasCaseStudy && (
        <div className="px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 mt-12 md:mt-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Sidebar metadata — col-span-3 sticky en lg+, full-width arriba en mobile */}
            <div className="lg:col-span-3">
              <CaseStudySidebar project={project} locale={locale} />
            </div>

            {/* Main editorial — col-span-9, secciones con imágenes intercaladas */}
            <div className="lg:col-span-9 space-y-20 md:space-y-28">

              {/* INTRO — sin label, hook 2-3 líneas + 1ª imagen */}
              <CaseStudySection label={null}>
                <p
                  className="font-display text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight max-w-3xl text-balance"
                  style={{ color: 'var(--ink-primary)' }}
                >
                  {awwwardsContent.intro}
                </p>
                {project.imageBriefs?.[0] && (
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
                {project.imageBriefs?.[1] && (
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
                {project.imageBriefs?.[2] && (
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
                {project.imageBriefs?.[3] && (
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

      {/* ============ GALERÍA ============
          Solo cuando NO awwwardsLayout. En el layout Awwwards las imágenes
          se intercalan dentro de las secciones (CaseStudyImage), así que
          repetirlas al final es ruido. */}
      {!project.awwwardsLayout && project.gallery && project.gallery.length > 0 && (
        <Gallery slug={slug} images={project.gallery} />
      )}

      {/* ============ PROJECT NAVIGATION ============
          Card prominente: próximo proyecto (con wrap-around al primero
          cuando estamos en el último).
          Link sobrio: volver al listado completo. */}
      <div className="px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 mt-28 md:mt-40">
        <div className="max-w-5xl mx-auto">

          <a
            href={`/${locale}/projects/${nextProject.slug}`}
            className="group block p-8 md:p-12 rounded-2xl border transition-all duration-300 hover:-translate-y-2"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            <p
              className="text-xs font-mono tracking-[0.2em] uppercase mb-4"
              style={{ color: 'var(--color-accent)' }}
            >
              {cs('next_project_label')}
            </p>
            <div className="flex items-end justify-between gap-6">
              <h2
                className="font-display text-3xl md:text-5xl font-semibold tracking-tight leading-tight"
                style={{ color: 'var(--ink-primary)' }}
              >
                {nextProject.title}
              </h2>
              <span
                aria-hidden
                className="text-2xl md:text-3xl inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-2"
                style={{ color: 'var(--color-accent)' }}
              >
                →
              </span>
            </div>
          </a>

          {/* Link sobrio para volver al listado completo */}
          <a
            href={`/${locale}`}
            className="group inline-flex items-center gap-2 text-sm mt-12 md:mt-16 transition-opacity duration-200 hover:opacity-70"
            style={{ color: 'var(--ink-secondary)' }}
          >
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 ease-expo-out group-hover:-translate-x-1"
            >
              ←
            </span>
            {cs('view_all_projects')}
          </a>

        </div>
      </div>

    </div>
  )
}
