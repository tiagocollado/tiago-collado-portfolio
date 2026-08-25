'use client'

import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { projects } from '@/data/projects'
import ProjectCard from './ProjectCard'
import SplitText from '../ui/SplitText'
import { Locale } from '@/types'

export default function Projects() {
  const t = useTranslations('projects')
  const locale = useLocale() as Locale

  const sortedProjects = [...projects].sort((a, b) => a.order - b.order)

  return (
    <section id="projects" className="py-16 md:py-20 lg:py-28 px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
      <div className="max-w-7xl mx-auto">

        {/* Header stagger: label entra primero (fade-up corto), después el
            statement con SplitText char reveal cuando entra al viewport. */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-mono tracking-[0.2em] mb-6 uppercase"
            style={{ color: 'var(--color-accent)' }}
          >
            {t('label')}
          </motion.p>
          <SplitText
            as="h2"
            text={t('statement')}
            stagger={0.015}
            delay={0.15}
            yFrom={20}
            blurFrom={4}
            duration={0.6}
            whileInView
            className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] block text-(--ink-primary)"
          />
        </div>

        {/* Grid de cards con stagger entre hijos. El `index` que se pasa a
            cada ProjectCard se traduce en delay incremental (0.08s por card)
            del whileInView — entran una por una con offset, no todas a la
            vez como bloque. Patrón consistente con la regla "Stagger en
            grupos repetidos" del CLAUDE.md. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-[280px] md:auto-rows-[320px] mt-12 md:mt-16">
          {sortedProjects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
              index={i}
            />
          ))}
        </div>

      </div>
    </section>
  )
}