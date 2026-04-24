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
    <section id="about" className="py-20 md:py-28 lg:py-36 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">

        <FadeInSection>
          {/* Label */}
          <div className="pb-8">
            <p
              className="text-xs font-mono tracking-[0.2em] uppercase"
              style={{ color: 'var(--color-accent)' }}
            >
              {t('title')}
            </p>
          </div>

          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-[6fr_1fr] gap-12 lg:gap-28 items-start">
            {/* Texto - columna izquierda */}
            <div className="space-y-6 max-w-prose">
              <p
                className="text-lg md:text-xl leading-relaxed"
                style={{ color: 'var(--ink-secondary)' }}
              >
                {t('p1')}
              </p>

              <p
                className="text-lg md:text-xl leading-relaxed"
                style={{ color: 'var(--ink-secondary)' }}
              >
                {t('p3')}
              </p>
            </div>

            {/* Skills - columna derecha */}
            <div className="grid grid-cols-1 gap-4">
              {CHIPS.map(({ num, label }) => (
                <div
                  key={label}
                  className="group relative overflow-hidden rounded-2xl border-2 p-8 transition-all duration-500
                             hover:border-accent hover:shadow-2xl hover:-translate-y-2
                             cursor-pointer"
                  style={{
                    borderColor: 'var(--border-default)',
                    backgroundColor: 'var(--color-surface)',
                    minHeight: '100px',
                    minWidth: '200px'
                  }}
                >
                  {/* Animated gradient background */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: 'linear-gradient(135deg, rgba(200,106,58,0.08) 0%, rgba(200,106,58,0.02) 100%)'
                    }}
                  />

                  {/* Corner accent */}
                  <div
                    className="absolute top-0 right-0 w-16 h-16 transition-all duration-500 group-hover:w-20 group-hover:h-20"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-accent) 0%, transparent 100%)',
                      opacity: 0.1
                    }}
                  />

                  {/* Content */}
                  <div className="relative flex flex-col gap-4 p-2">
                    <span
                      className="text-xs font-mono tracking-[0.2em] transition-colors duration-300"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {num}
                    </span>

                    <div
                      className="w-12 h-0.5 transition-all duration-300 group-hover:w-full group-hover:bg-accent"
                      style={{ backgroundColor: 'var(--border-default)' }}
                    />

                    <span
                      className="text-base font-semibold tracking-wide transition-all duration-300
                                 group-hover:text-accent group-hover:translate-x-1"
                      style={{ color: 'var(--ink-primary)' }}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ubicación al final */}
          <div
            className="flex items-center gap-3 text-sm font-mono tracking-wide mt-12"
            style={{ color: 'var(--ink-muted)' }}
          >
            <span className="uppercase tracking-[0.18em]">Ubicación</span>
            <span>·</span>
            <span style={{ color: 'var(--ink-secondary)' }}>Buenos Aires, Argentina</span>
          </div>
        </FadeInSection>

      </div>
    </section>
  )
}