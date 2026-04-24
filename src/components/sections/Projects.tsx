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
    <section id="projects" className="py-20 md:py-28 lg:py-36 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        <FadeInSection>
          <div>
            <p
              className="text-xs font-mono tracking-[0.2em] mb-6 uppercase"
              style={{ color: 'var(--color-accent)' }}
            >
              {t('label')}
            </p>
            <h2
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]"
              style={{ color: 'var(--ink-primary)' }}
            >
              {t('statement')}
            </h2>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-[280px] md:auto-rows-[320px] mt-12">
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