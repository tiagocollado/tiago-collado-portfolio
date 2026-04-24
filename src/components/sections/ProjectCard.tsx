'use client'

import { Project, Locale } from '@/types'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface ProjectCardProps {
  project: Project
  locale: Locale
}

export default function ProjectCard({ project, locale }: ProjectCardProps) {
  const t = useTranslations('projects')

  // Bento grid: featured = 2×2, resto = 1×1 (intacto)
  const spanClasses = project.featured
    ? 'md:col-span-2 md:row-span-2'
    : 'md:col-span-1 md:row-span-1'

  return (
    <article
      className={`${spanClasses} rounded-card overflow-hidden group relative border transition-all duration-500 ease-out
                  hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/5`}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Link invisible sobre toda la card */}
      {!project.comingSoon && (
        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="absolute inset-0 z-30"
          aria-label={`Ver caso de estudio: ${project.title}`}
        />
      )}

      {/* Cover image — dimmed y en grayscale por default, vivo en hover */}
      {project.coverImage ? (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover
                       opacity-25 grayscale scale-105
                       transition-all duration-700 ease-out
                       group-hover:opacity-55 group-hover:grayscale-0 group-hover:scale-100"
          />
          {/* Velo oscuro que se disipa en hover */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.55) 100%)',
            }}
          />
        </div>
      ) : null}

      {/* Overlay coming soon */}
      {project.comingSoon && (
        <div
          className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-20"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <span
            className="px-4 py-2 rounded-full font-medium text-[11px] tracking-widest uppercase"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--ink-primary)' }}
          >
            {t('coming_soon')}
          </span>
        </div>
      )}

      {/* Contenido: título + stack siempre visibles, CTA aparece en hover */}
      {!project.comingSoon && (
        <div className="relative z-10 h-full p-6 md:p-7 flex flex-col justify-between">

          {/* Top row: categoría del proyecto */}
          <div className="flex items-start justify-between">
            <span
              className="text-[10px] font-mono tracking-[0.18em] uppercase px-2.5 py-1 rounded-full border
                         transition-colors duration-300"
              style={{
                color: 'var(--ink-muted)',
                borderColor: 'var(--border-default)',
                backgroundColor: 'var(--bg-primary)',
              }}
            >
              {project.type === 'ux' ? 'UX / UI' : project.type === 'fullstack' ? 'Full-stack' : 'Design'}
            </span>
          </div>

          {/* Bottom: título + stack + CTA */}
          <div className="mt-auto">
            {/* Título */}
            <h3
              className="font-display font-semibold leading-tight mb-3 transition-colors duration-300
                         text-xl md:text-2xl"
              style={{ color: 'var(--ink-primary)' }}
            >
              {project.title}
            </h3>

            {/* Stack tecnológico */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.tags.slice(0, project.featured ? 5 : 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10.5px] font-mono tracking-wide px-2 py-0.5 rounded-full border transition-colors duration-300"
                  style={{
                    color: 'var(--ink-muted)',
                    borderColor: 'var(--border-default)',
                    backgroundColor: 'transparent',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA que aparece en hover */}
            <div
              className="inline-flex items-center gap-1.5 text-sm font-medium
                         opacity-0 translate-y-1 transition-all duration-400 ease-out
                         group-hover:opacity-100 group-hover:translate-y-0"
              style={{ color: 'var(--color-accent)' }}
            >
              <span className="px-3.5 py-2 rounded-full border inline-flex items-center gap-1.5"
                    style={{ borderColor: 'var(--color-accent)', backgroundColor: 'var(--bg-primary)' }}>
                {t('view_case')}
                <span aria-hidden>→</span>
              </span>
            </div>
          </div>
        </div>
      )}

    </article>
  )
}
