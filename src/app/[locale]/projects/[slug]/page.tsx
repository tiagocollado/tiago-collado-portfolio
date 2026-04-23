import { notFound } from 'next/navigation'
import { projects } from '@/data/projects'
import { Locale } from '@/types'
import { getTranslations, setRequestLocale } from 'next-intl/server'

interface ProjectPageProps {
  params: Promise<{
    locale: Locale
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = projects.map((project) => ({
    slug: project.slug,
  }))
  return slugs
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  // Skip case study content for coming-soon projects to avoid build warnings
  const caseStudyKey = `case_study_${slug}`
  let hasCaseStudy = false
  let caseStudyContent = {
    context: '',
    role: '',
    process: '',
    solution: '',
    results: ''
  }

  if (!project.comingSoon) {
    try {
      const t = await getTranslations(caseStudyKey)
      hasCaseStudy = true
      caseStudyContent = {
        context: t('context'),
        role: t('role'),
        process: t('process'),
        solution: t('solution'),
        results: t('results')
      }
    } catch {
      hasCaseStudy = false
    }
  }

  return (
    <main className="min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <a 
            href={`/${locale}`}
            className="inline-block text-sm mb-8 transition-colors duration-200 hover:opacity-70"
            style={{ color: 'var(--ink-secondary)' }}
          >
            ← {locale === 'es' ? 'Volver' : 'Back'}
          </a>
          
          <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight mb-6" style={{ color: 'var(--ink-primary)' }}>
            {project.title}
          </h1>
          
          <p className="text-xl leading-relaxed mb-8" style={{ color: 'var(--ink-secondary)' }}>
            {project.tagline[locale]}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span 
                key={tag}
                className="text-sm px-3 py-1 rounded-lg border"
                style={{
                  borderColor: 'var(--border-default)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--ink-primary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Cover image */}
        {project.coverImage ? (
          <img 
            src={project.coverImage} 
            alt={project.title}
            className="w-full h-96 rounded-card object-cover mb-16"
          />
        ) : (
          <div 
            className="w-full h-96 rounded-card mb-16 flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            <span className="text-sm font-mono" style={{ color: 'var(--ink-muted)' }}>
              Cover image · 1200x800
            </span>
          </div>
        )}

        {/* Contenido del caso de estudio */}
        <div className="space-y-16">
          
          {/* El contexto */}
          <section>
            <h2 className="font-display text-3xl font-semibold tracking-tight mb-6" style={{ color: 'var(--ink-primary)' }}>
              {locale === 'es' ? 'El contexto' : 'Context'}
            </h2>
            <div className="text-lg leading-relaxed space-y-4" style={{ color: 'var(--ink-secondary)' }}>
              {hasCaseStudy ? (
                caseStudyContent.context.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <p>{project.description[locale]}</p>
              )}
            </div>
          </section>

          {/* Mi rol */}
          <section>
            <h2 className="font-display text-3xl font-semibold tracking-tight mb-6" style={{ color: 'var(--ink-primary)' }}>
              {locale === 'es' ? 'Mi rol' : 'My role'}
            </h2>
            <div className="text-lg leading-relaxed space-y-4" style={{ color: 'var(--ink-secondary)' }}>
              {hasCaseStudy ? (
                caseStudyContent.role.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <p className="italic opacity-60">
                  [{locale === 'es' ? 'Contenido pendiente — qué hiciste exactamente y con quién' : 'Content pending — what you did exactly and with whom'}]
                </p>
              )}
            </div>
          </section>

          {/* Proceso y decisiones */}
          <section>
            <h2 className="font-display text-3xl font-semibold tracking-tight mb-6" style={{ color: 'var(--ink-primary)' }}>
              {locale === 'es' ? 'Proceso y decisiones' : 'Process and decisions'}
            </h2>
            <div className="text-lg leading-relaxed space-y-4" style={{ color: 'var(--ink-secondary)' }}>
              {hasCaseStudy ? (
                caseStudyContent.process.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <p className="italic opacity-60">
                  [{locale === 'es' ? 'Contenido pendiente — investigación, flujos, wireframes, prototipos descartados' : 'Content pending — research, flows, wireframes, discarded prototypes'}]
                </p>
              )}
            </div>
          </section>

          {/* La solución */}
          <section>
            <h2 className="font-display text-3xl font-semibold tracking-tight mb-6" style={{ color: 'var(--ink-primary)' }}>
              {locale === 'es' ? 'La solución' : 'The solution'}
            </h2>
            <div className="text-lg leading-relaxed space-y-4" style={{ color: 'var(--ink-secondary)' }}>
              {hasCaseStudy ? (
                caseStudyContent.solution.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <p className="italic opacity-60">
                  [{locale === 'es' ? 'Contenido pendiente — la interfaz final y su implementación' : 'Content pending — the final interface and its implementation'}]
                </p>
              )}
            </div>
          </section>

          {/* Resultados */}
          <section>
            <h2 className="font-display text-3xl font-semibold tracking-tight mb-6" style={{ color: 'var(--ink-primary)' }}>
              {locale === 'es' ? 'Resultados' : 'Results'}
            </h2>
            <div className="text-lg leading-relaxed space-y-4" style={{ color: 'var(--ink-secondary)' }}>
              {hasCaseStudy ? (
                caseStudyContent.results.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <p className="italic opacity-60">
                  [{locale === 'es' ? 'Contenido pendiente — métricas, aprendizajes, validación técnica' : 'Content pending — metrics, learnings, technical validation'}]
                </p>
              )}
            </div>
          </section>

        </div>

        {/* Enlaces del proyecto */}
        {(project.links.behance || project.links.live || project.links.github || project.links.githubBack) && (
          <div className="mt-16 pt-8 border-t flex flex-wrap gap-4" style={{ borderColor: 'var(--border-default)' }}>
            {project.links.behance && (
              <a 
                href={project.links.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-medium text-sm border transition-all duration-200 hover:opacity-70"
                style={{
                  borderColor: 'var(--border-default)',
                  color: 'var(--ink-primary)',
                }}
              >
                {locale === 'es' ? 'Ver en Behance →' : 'View on Behance →'}
              </a>
            )}
            {project.links.live && (
              <a 
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: '#FFFFFF',
                }}
              >
                {locale === 'es' ? 'Ver demo en vivo →' : 'View live demo →'}
              </a>
            )}
            {project.links.github && (
              <a 
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-medium text-sm border transition-all duration-200 hover:opacity-70"
                style={{
                  borderColor: 'var(--border-default)',
                  color: 'var(--ink-primary)',
                }}
              >
                {locale === 'es' ? 'Ver código (Frontend) →' : 'View code (Frontend) →'}
              </a>
            )}
            {project.links.githubBack && (
              <a 
                href={project.links.githubBack}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-medium text-sm border transition-all duration-200 hover:opacity-70"
                style={{
                  borderColor: 'var(--border-default)',
                  color: 'var(--ink-primary)',
                }}
              >
                {locale === 'es' ? 'Ver código (Backend) →' : 'View code (Backend) →'}
              </a>
            )}
          </div>
        )}

      </div>
    </main>
  )
}