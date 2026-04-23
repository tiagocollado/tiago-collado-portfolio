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

  // Featured = 2×2, el resto = 1×1 (bento grid intacto)
  const spanClasses = project.featured
    ? 'md:col-span-2 md:row-span-2'
    : 'md:col-span-1 md:row-span-1'

  return (
    <article
      className={`${spanClasses} rounded-card overflow-hidden group relative`}
      style={{ backgroundColor: 'var(--bg-tertiary)' }}
    >
      {/* Link que cubre toda la card */}
      {!project.comingSoon && (
        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`Ver caso de estudio: ${project.title}`}
        />
      )}

      {/* Cover image con zoom sutil en hover */}
      {project.coverImage ? (
        <img
          src={project.coverImage}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        >
          <span className="text-xs font-mono" style={{ color: 'var(--ink-muted)' }}>
            Cover image
          </span>
        </div>
      )}

      {/* Overlay coming soon */}
      {project.comingSoon && (
        <div
          className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-20"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        >
          <span
            className="px-4 py-2 rounded-full font-medium text-xs tracking-widest uppercase"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--ink-primary)' }}
          >
            {t('coming_soon')}
          </span>
        </div>
      )}

      {/* Panel inferior — siempre visible, más opaco en hover */}
      {!project.comingSoon && (
        <div
          className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex flex-col justify-end z-5
                     transition-all duration-300
                     group-hover:[--gradient-opacity:1]"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)',
          }}
        >
          <h3
            className="font-display font-semibold text-white leading-tight mb-1
                       text-lg md:text-xl group-hover:text-white transition-colors"
          >
            {project.title}
          </h3>

          <p className="text-sm text-white/70 leading-snug mb-3 line-clamp-2">
            {project.tagline[locale]}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, project.featured ? 4 : 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

    </article>
  )
}
