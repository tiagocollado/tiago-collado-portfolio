'use client'

/**
 * About — versión 3.0
 * -------------------
 *  Layout 2 columnas en lg+:
 *   - IZQUIERDA: 4 bloques de copy (Miller — chunks) + ubicación al final.
 *   - DERECHA: 3 cards distribuidas en grid-rows-3 — ocupan la misma
 *     altura que la columna izquierda (Similitud + Proximidad).
 *
 *  Sin H2 claim — la copy entra directo (Estética-Usabilidad: menos
 *  cromo, más contenido). El eyebrow "Sobre mí" es el h2 semántico
 *  (mono micro), section marker, no protagonista.
 */

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import FadeInSection from '../ui/FadeInSection'

const TOOLKIT_ITEMS = [
  { num: '01', titleKey: 'toolkit_1_title' },
  { num: '02', titleKey: 'toolkit_2_title' },
  { num: '03', titleKey: 'toolkit_3_title' },
] as const

export default function About() {
  const t = useTranslations('about')
  const tc = useTranslations('contact')

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="pt-16 md:pt-20 lg:pt-28 pb-8 md:pb-10 lg:pb-12 px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32"
    >
      <div className="max-w-6xl mx-auto">
        <FadeInSection>

          {/* Section marker — el h2 semántico es el eyebrow micro */}
          <h2
            id="about-heading"
            className="text-xs font-mono tracking-[0.2em] uppercase mb-10 md:mb-14"
            style={{ color: 'var(--color-accent)' }}
          >
            {t('title')}
          </h2>

          {/* Grid 2 columnas: copy/ubicación · cards distribuidas */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-12 lg:gap-16 items-stretch">

            {/* Izquierda: copy + ubicación al final */}
            <div className="flex flex-col">
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
                {/* Hook — focal point en bold + display */}
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

              {/* Ubicación al final de la columna izquierda */}
              <p
                className="flex items-center gap-3 text-sm font-mono tracking-wide mt-10 md:mt-12"
                style={{ color: 'var(--ink-muted)' }}
              >
                <span className="uppercase tracking-[0.18em]">{tc('location_label')}</span>
                <span aria-hidden>·</span>
                <span style={{ color: 'var(--ink-secondary)' }}>{tc('location')}</span>
              </p>
            </div>

            {/* Derecha: 3 cards content-height, gap generoso, animación
                decorativa one-shot en scroll-in (no hover — no son botones) */}
            <div className="flex flex-col gap-8 md:gap-12">
              {TOOLKIT_ITEMS.map(({ num, titleKey }, i) => (
                <motion.article
                  key={num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex flex-col p-5 md:p-6 rounded-xl"
                  style={{
                    border: '1px solid var(--border-default)',
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  <span
                    className="font-mono text-xs tracking-wider"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {num}
                  </span>
                  {/* Línea accent decorativa — se dibuja de izq a der */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3 + i * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-px w-8 mt-3"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      transformOrigin: 'left',
                    }}
                  />
                  <h3
                    className="font-display text-base md:text-lg font-semibold leading-tight mt-4"
                    style={{ color: 'var(--ink-primary)' }}
                  >
                    {t(titleKey)}
                  </h3>
                </motion.article>
              ))}
            </div>

          </div>

        </FadeInSection>
      </div>
    </section>
  )
}
