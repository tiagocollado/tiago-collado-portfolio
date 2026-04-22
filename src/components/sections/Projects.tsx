'use client'

import { useTranslations, useLocale } from 'next-intl'
import { projects } from '@/data/projects'
import ProjectCard from './ProjectCard'
import FadeInSection from '../ui/FadeInSection'
import { Locale } from '@/types'

export default function Projects() {
  const t = useTranslations('projects')
  const locale = useLocale() as Locale

  const sortedProjects = [...projects].sort((a, b) => a.order - b.order)

  return (
    <section id="projects" className="min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        <FadeInSection>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-16" style={{ color: 'var(--ink-primary)' }}>
            {t('title')}
          </h2>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
            {sortedProjects.map((project) => (
              <ProjectCard 
                key={project.slug} 
                project={project} 
                locale={locale}
              />
            ))}
          </div>
        </FadeInSection>

      </div>
    </section>
  )
}