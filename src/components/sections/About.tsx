'use client'

/**
 * About
 * -----
 * Sección "Sobre mí" — diseñada para escaneabilidad en patrón F:
 *  - <header> con eyebrow + claim (lo primero que lee un reclutador).
 *  - 4 bloques de copy cortos (Ley de Miller — chunks digeribles), con el
 *    "hook" diferenciador en bold como focal point.
 *  - <aside> con la lista de áreas de práctica — sin chrome de botón
 *    (no son interactivas, deben leerse como label tipográfico).
 *  - <footer> con ubicación.
 */

import { useTranslations } from 'next-intl'
import FadeInSection from '../ui/FadeInSection'

const PRACTICE_AREAS = [
  { num: '01', label: 'UX / UI' },
  { num: '02', label: 'Frontend Dev' },
  { num: '03', label: 'Product Design' },
] as const

export default function About() {
  const t = useTranslations('about')

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="pt-16 md:pt-20 lg:pt-28 pb-8 md:pb-10 lg:pb-12 px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32"
    >
      <div className="max-w-6xl mx-auto">
        <FadeInSection>

          {/* Header — eyebrow + claim. Top de la "F", primero en escanear. */}
          <header className="mb-10 md:mb-14">
            <p
              className="text-xs font-mono tracking-[0.2em] uppercase mb-4"
              style={{ color: 'var(--color-accent)' }}
            >
              {t('title')}
            </p>
            <h2
              id="about-heading"
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]"
              style={{ color: 'var(--ink-primary)' }}
            >
              {t('claim')}
            </h2>
          </header>

          {/* Grid: copy a la izquierda, áreas de práctica a la derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-[6fr_1fr] gap-12 lg:gap-20 items-start">

            {/* Copy — 4 bloques cortos */}
            <div className="space-y-6 max-w-prose">
              <p
                className="text-lg md:text-xl leading-relaxed"
                style={{ color: 'var(--ink-secondary)' }}
              >
                {t('background')}
              </p>

              <p
                className="text-lg md:text-xl leading-relaxed"
                style={{ color: 'var(--ink-secondary)' }}
              >
                {t('hybrid_path')}
              </p>

              {/* Hook — focal point en bold + display, foco visual del bloque. */}
              <p
                className="font-display text-xl md:text-2xl font-semibold leading-snug"
                style={{ color: 'var(--ink-primary)' }}
              >
                {t('hook')}
              </p>

              <p
                className="text-lg md:text-xl leading-relaxed"
                style={{ color: 'var(--ink-secondary)' }}
              >
                {t('mission')}
              </p>
            </div>

            {/* Áreas de práctica — lista numerada editorial, sin chrome de botón */}
            <aside aria-label="Áreas de práctica">
              <ul>
                {PRACTICE_AREAS.map(({ num, label }, i) => (
                  <li
                    key={label}
                    className="flex items-baseline gap-4 py-4"
                    style={{
                      borderBottom: i < PRACTICE_AREAS.length - 1
                        ? '1px solid var(--border-default)'
                        : 'none',
                    }}
                  >
                    <span
                      className="font-mono text-sm tracking-wider"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {num}
                    </span>
                    <span
                      className="font-display text-base md:text-lg font-medium"
                      style={{ color: 'var(--ink-primary)' }}
                    >
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          {/* Ubicación al final */}
          <footer className="mt-12 md:mt-16">
            <p
              className="flex items-center gap-3 text-sm font-mono tracking-wide"
              style={{ color: 'var(--ink-muted)' }}
            >
              <span className="uppercase tracking-[0.18em]">{t('location_label')}</span>
              <span aria-hidden>·</span>
              <span style={{ color: 'var(--ink-secondary)' }}>{t('location')}</span>
            </p>
          </footer>

        </FadeInSection>
      </div>
    </section>
  )
}
