import { notFound } from 'next/navigation'
import { projects } from '@/data/projects'
import { Locale } from '@/types'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Gallery from '@/components/sections/Gallery'

interface ProjectPageProps {
  params: Promise<{
    locale: Locale
    slug: string
  }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

// Mapeo de sección → tipo de label
const SECTION_KEYS = ['context', 'role', 'process', 'solution', 'results'] as const

function getSectionLabelPrefix(projectType: string) {
  if (projectType === 'fullstack') return 'fs'
  return 'ux'
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  const cs = await getTranslations('case_study')
  const labelPrefix = getSectionLabelPrefix(project.type)

  // Cargar contenido del caso de estudio
  const caseStudyKey = `case_study_${slug}`
  let hasCaseStudy = false
  const caseStudyContent: Record<string, string> = {}

  if (!project.comingSoon) {
    try {
      const t = await getTranslations(caseStudyKey)
      hasCaseStudy = true
      for (const key of SECTION_KEYS) {
        caseStudyContent[key] = t(key)
      }
    } catch {
      hasCaseStudy = false
    }
  }

  const hasLinks = Boolean(
    project.links.behance || project.links.live || project.links.github || project.links.githubBack
  )

  return (
    <main className="min-h-screen pb-24 md:pb-32" style={{ paddingTop: '64px' }}>

      {/* ============ HEADER ============ */}
      <div className="px-6 md:px-10 pt-16 md:pt-20">
        <div className="max-w-4xl mx-auto">

          {/* Back link */}
          <a
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm mb-10 md:mb-14 transition-opacity duration-200 hover:opacity-70"
            style={{ color: 'var(--ink-secondary)' }}
          >
            <span aria-hidden>←</span>
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
            className="font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-6 md:mb-8"
            style={{ color: 'var(--ink-primary)' }}
          >
            {project.title}
          </h1>

          {/* 3. Herramientas / Tags */}
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

          {/* 4. Descripción / Tagline */}
          <p
            className="text-lg md:text-2xl leading-relaxed mb-12 md:mb-16 max-w-3xl"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {project.tagline[locale]}
          </p>
        </div>
      </div>

      {/* ============ CASE STUDY SECTIONS ============ */}
      <div className="px-6 md:px-10">
        <div className="max-w-3xl mx-auto space-y-24 md:space-y-32">

          {SECTION_KEYS.map((key, index) => {
            const sectionNumber = String(index + 1).padStart(2, '0')
            const sectionLabel = cs(`${labelPrefix}_s${index}`)
            const content = hasCaseStudy ? caseStudyContent[key] : ''

            return (
              <section key={key} className="relative">
                {/* Número + Título */}
                <div className="flex items-baseline gap-4 md:gap-5 mb-8 md:mb-10">
                  <span
                    className="font-mono text-sm md:text-base font-semibold tracking-wider"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {sectionNumber}
                  </span>
                  <span
                    className="h-px flex-1 max-w-10 mt-3"
                    style={{ backgroundColor: 'var(--border-strong)' }}
                  />
                  <h2
                    className="font-display text-3xl md:text-4xl font-semibold tracking-tight"
                    style={{ color: 'var(--ink-primary)' }}
                  >
                    {sectionLabel}
                  </h2>
                </div>

                {/* Contenido */}
                <div
                  className="text-lg md:text-xl leading-[1.75] space-y-6 pl-0 md:pl-14"
                  style={{ color: 'var(--ink-secondary)' }}
                >
                  {hasCaseStudy ? (
                    content.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))
                  ) : key === 'context' ? (
                    <p>{project.description[locale]}</p>
                  ) : (
                    <p className="italic opacity-60">[{cs('pending_content')}]</p>
                  )}
                </div>
              </section>
            )
          })}

        </div>
      </div>

      {/* ============ GALERÍA ============ */}
      {project.gallery && project.gallery.length > 0 && (
        <Gallery slug={slug} images={project.gallery} />
      )}

      {/* ============ DEMO LINKS ============ */}
      {hasLinks && (
        <div className="px-6 md:px-10 mt-28 md:mt-40">
          <div className="max-w-5xl mx-auto">

            <div className="mb-12 md:mb-16 max-w-2xl">
              <p
                className="text-xs font-mono tracking-[0.2em] uppercase mb-5"
                style={{ color: 'var(--color-accent)' }}
              >
                06 · {cs('demo_title').toUpperCase()}
              </p>
              <h2
                className="font-display text-3xl md:text-5xl font-semibold tracking-tight leading-tight"
                style={{ color: 'var(--ink-primary)' }}
              >
                {cs('demo_title')}
              </h2>
            </div>

            {/* Grid de links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {project.links.live && (
                <DemoLink
                  href={project.links.live}
                  label={cs('view_live')}
                  variant="primary"
                />
              )}
              {project.links.behance && (
                <DemoLink
                  href={project.links.behance}
                  label={cs('view_behance')}
                />
              )}
              {project.links.github && (
                <DemoLink
                  href={project.links.github}
                  label={cs('view_github_frontend')}
                />
              )}
              {project.links.githubBack && (
                <DemoLink
                  href={project.links.githubBack}
                  label={cs('view_github_backend')}
                />
              )}
            </div>

            <p
              className="mt-10 md:mt-12 text-xs font-mono tracking-wide"
              style={{ color: 'var(--ink-muted)' }}
            >
              {cs('demo_placeholder')}
            </p>
          </div>
        </div>
      )}

    </main>
  )
}

function DemoLink({
  href,
  label,
  variant = 'secondary',
}: {
  href: string
  label: string
  variant?: 'primary' | 'secondary'
}) {
  const isPrimary = variant === 'primary'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group p-6 md:p-7 rounded-2xl border flex items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-2"
      style={{
        borderColor: isPrimary ? 'var(--color-accent)' : 'var(--border-default)',
        backgroundColor: isPrimary ? 'var(--color-accent)' : 'var(--color-surface)',
        color: isPrimary ? '#FFFFFF' : 'var(--ink-primary)',
      }}
    >
      <span className="font-display text-base md:text-lg font-semibold tracking-tight">
        {label}
      </span>
      <span className="text-xl transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
        →
      </span>
    </a>
  )
}