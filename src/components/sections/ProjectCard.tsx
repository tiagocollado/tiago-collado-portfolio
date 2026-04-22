import { Project, Locale } from '@/types'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface ProjectCardProps {
  project: Project
  locale: Locale
}

export default function ProjectCard({ project, locale }: ProjectCardProps) {
  const t = useTranslations('projects')
  
  const cardClasses = project.featured 
    ? 'md:col-span-2 md:row-span-2' 
    : 'md:col-span-1 md:row-span-1'

  return (
    <article 
      className={`${cardClasses} rounded-card border transition-all duration-300 overflow-hidden group relative`}
      style={{
        borderColor: 'var(--border-default)',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      
      {/* Link invisible que cubre toda la card - siempre va a la página del proyecto */}
      {!project.comingSoon && (
        <Link 
          href={`/${locale}/projects/${project.slug}`}
          className="absolute inset-0 z-10"
          aria-label={project.title}
        />
      )}

      {/* Cover image */}
      {project.coverImage ? (
        <img 
          src={project.coverImage} 
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <span className="text-xs font-mono" style={{ color: 'var(--ink-muted)' }}>
            Cover image
          </span>
        </div>
      )}

      {/* Coming soon overlay */}
      {project.comingSoon && (
        <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <span className="px-4 py-2 rounded-lg font-medium text-sm" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--ink-primary)' }}>
            {t('coming_soon')}
          </span>
        </div>
      )}

      {/* Contenido en hover */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        
        <h3 className="font-display text-2xl font-semibold mb-2 text-white">
          {project.title}
        </h3>
        <p className="text-sm text-white/80 mb-3">
          {project.tagline[locale]}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="text-xs px-2 py-1 rounded"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              {tag}
            </span>
          ))}
        </div>

      </div>

    </article>
  )
}