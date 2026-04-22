'use client'

import { useTranslations } from 'next-intl'
import FadeInSection from '../ui/FadeInSection'

export default function About() {
  const t = useTranslations('about')

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        
        <FadeInSection>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-12" style={{ color: 'var(--ink-primary)' }}>
            {t('title')}
          </h2>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <div className="space-y-6">
            <p className="text-lg leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
              {t('p1')}
            </p>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
              {t('p2')}
            </p>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
              {t('p3')}
            </p>
          </div>
        </FadeInSection>

      </div>
    </section>
  )
}