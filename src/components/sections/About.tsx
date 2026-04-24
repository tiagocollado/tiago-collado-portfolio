'use client'

import { useTranslations } from 'next-intl'
import FadeInSection from '../ui/FadeInSection'

const CHIPS = [
  { num: '01', label: 'UX / UI' },
  { num: '02', label: 'Frontend Dev' },
  { num: '03', label: 'Product Design' },
] as const

export default function About() {
  const t = useTranslations('about')

  return (
    <section id="about" className="py-28 md:py-40 px-6 md:px-10">
      <div className="max-w-3xl mx-auto">

        <FadeInSection>
          {/* Label minimal — el contenido es el protagonista */}
          <p
            className="text-xs font-mono tracking-[0.2em] uppercase mb-12"
            style={{ color: 'var(--ink-muted)' }}
          >
            {t('title')}
          </p>

          {/* Párrafos del About con spacing generoso */}
          <div className="space-y-7 md:space-y-8 mb-16 md:mb-20">
            <p
              className="text-lg md:text-xl leading-[1.7]"
              style={{ color: 'var(--ink-secondary)' }}
            >
              {t('p1')}
            </p>
            <p
              className="text-lg md:text-xl leading-[1.7]"
              style={{ color: 'var(--ink-secondary)' }}
            >
              {t('p2')}
            </p>
            <p
              className="text-lg md:text-xl leading-[1.7]"
              style={{ color: 'var(--ink-secondary)' }}
            >
              {t('p3')}
            </p>
          </div>

          {/* Chips de aptitud — con numeración en vez de íconos decorativos */}
          <div className="flex flex-wrap gap-3 md:gap-4">
            {CHIPS.map(({ num, label }) => (
              <div
                key={label}
                className="group flex items-center gap-3 pl-3 pr-5 py-3 rounded-full border
                           transition-all duration-300 cursor-default
                           hover:border-accent hover:-translate-y-0.5"
                style={{ borderColor: 'var(--border-strong)' }}
              >
                <span
                  className="text-[10px] font-mono tracking-widest
                             transition-colors duration-300 group-hover:text-accent"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  {num}
                </span>
                <span
                  className="w-px h-3 transition-colors duration-300 group-hover:bg-accent"
                  style={{ backgroundColor: 'var(--border-strong)' }}
                />
                <span
                  className="text-sm font-medium transition-colors duration-300 group-hover:text-(--ink-primary)"
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
