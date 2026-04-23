'use client'

import { useTranslations } from 'next-intl'
import FadeInSection from '../ui/FadeInSection'
import { Palette, Code2, Layers } from 'lucide-react'

const CHIPS = [
  { icon: Palette,  label: 'UX / UI' },
  { icon: Code2,    label: 'Frontend Dev' },
  { icon: Layers,   label: 'Product Design' },
] as const

export default function About() {
  const t = useTranslations('about')

  return (
    <section id="about" className="py-28 md:py-36 px-6">
      <div className="max-w-3xl mx-auto">

        <FadeInSection>
          {/* Label minimal — no compite con el contenido */}
          <p
            className="text-xs font-mono tracking-[0.2em] uppercase mb-10"
            style={{ color: 'var(--ink-muted)' }}
          >
            {t('title')}
          </p>

          {/* Contenido es el protagonista */}
          <div className="space-y-6 mb-14">
            <p className="text-lg md:text-xl leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
              {t('p1')}
            </p>
            <p className="text-lg md:text-xl leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
              {t('p2')}
            </p>
            <p className="text-lg md:text-xl leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
              {t('p3')}
            </p>
          </div>

          {/* Chips de aptitud — resumen ejecutivo visual */}
          <div className="flex flex-wrap gap-3">
            {CHIPS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-5 py-3 rounded-full border
                           transition-all duration-200 cursor-default group
                           hover:border-accent hover:-translate-y-0.5"
                style={{ borderColor: 'var(--border-strong)' }}
              >
                <Icon
                  size={15}
                  strokeWidth={1.75}
                  className="transition-colors duration-200 group-hover:text-accent"
                  style={{ color: 'var(--ink-muted)' }}
                />
                <span
                  className="text-sm font-medium transition-colors duration-200 group-hover:text-(--ink-primary)"
                  style={{ color: 'var(--ink-secondary)' }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </FadeInSection>

      </div>
    </section>
  )
}
