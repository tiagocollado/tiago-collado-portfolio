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

  const spanClasses = project.featured
    ? 'md:col-span-2 md:row-span-1'
    : 'md:col-span-1 md:row-span-1'

  return (
    <article
      className={`${spanClasses} rounded-2xl overflow-hidden group relative border transition-all duration-500 ease-out
                  hover:-translate-y-2 hover:shadow-xl`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Link invisible */}
      {!project.comingSoon && (
        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="absolute inset-0 z-30"
          aria-label={`Ver caso de estudio: ${project.title}`}
        />
      )}

      {/* Cover */}
      {project.coverImage ? (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover
                       opacity-40 grayscale scale-105
                       transition-all duration-700 ease-out
                       group-hover:opacity-60 group-hover:grayscale-0 group-hover:scale-100"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 100%)',
            }}
          />
        </div>
      ) : null}

      {/* Coming soon */}
      {project.comingSoon && (
        <div
          className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-20"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <span
            className="px-5 py-2.5 rounded-full font-medium text-xs tracking-widest uppercase"
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--ink-primary)' }}
          >
            {t('coming_soon')}
          </span>
        </div>
      )}

      {/* Contenido */}
      {!project.comingSoon && (
        <div className="relative z-10 h-full flex flex-col justify-end px-8 py-7">

          {/* Contenido */}
          <div className="mt-auto">
            {/* Tipo */}
            <span
              className="text-[9px] font-mono tracking-[0.2em] uppercase rounded-full border mb-3 inline-block px-2.5 py-1"
              style={{
                color: 'var(--ink-muted)',
                borderColor: 'var(--border-default)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              {project.type === 'ux' ? 'UX / UI' : project.type === 'fullstack' ? 'Full-stack' : 'Design'}
            </span>

            {/* Título */}
            <h3
              className="font-display font-semibold leading-tight uppercase text-xl mt-2 mb-4"
              style={{ color: 'var(--ink-primary)' }}
            >
              {project.title}
            </h3>

            {/* Tags y CTA - aparecen en hover */}
            <div className="flex flex-col gap-3 group-hover:opacity-100 group-hover:translate-y-0 opacity-0 translate-y-3 transition-all duration-400">
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, project.featured ? 4 : 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium tracking-wide rounded-full border px-3 py-1.5"
                    style={{
                      color: 'var(--color-accent)',
                      borderColor: 'var(--color-accent)',
                      backgroundColor: 'transparent',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <span
                className="text-sm font-semibold rounded-full border inline-flex items-center gap-2 mt-1 px-5 py-2.5 w-fit"
                style={{
                  color: 'var(--color-accent)',
                  borderColor: 'var(--color-accent)',
                  backgroundColor: 'transparent',
                }}
              >
                {t('view_case')}
                <span>→</span>
              </span>
            </div>
          </div>
        </div>
      )}

    </article>
  )
}