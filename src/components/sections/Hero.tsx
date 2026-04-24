'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import InteractiveDotGrid from '@/components/ui/InteractiveDotGrid'

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="min-h-screen flex items-center justify-center px-6 md:px-10 py-20 md:py-28 lg:py-36 relative overflow-hidden">

      {/* Fondo interactivo: canvas en desktop con repulsión del cursor, CSS estático en touch. */}
      <InteractiveDotGrid opacity={0.55} />

      {/* Contenedor principal con flex + gap */}
      <motion.div
        className="max-w-4xl w-full relative z-10 flex flex-col items-start gap-6 lg:gap-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="inline-flex items-center gap-2.5 rounded-full border text-xs font-medium"
            style={{
              borderColor: 'var(--border-strong)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--ink-secondary)',
              padding: '8px 24px',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
            </span>
            {t('availability')}
          </div>
        </motion.div>

        {/* H1 */}
        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.15] text-balance"
          style={{ color: 'var(--ink-primary)' }}
        >
          {t('name')}
        </h1>

        {/* Role */}
        <p
          className="text-lg md:text-xl font-medium tracking-wide text-balance"
          style={{ color: 'var(--ink-secondary)' }}
        >
          {t('role')}
        </p>

        {/* Headlines */}
        <div className="space-y-3 max-w-prose">
          <p
            className="font-display text-2xl md:text-4xl font-medium tracking-tight leading-[1.15]"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {t('headline')}
          </p>
          <p
            className="font-display text-2xl md:text-4xl font-medium tracking-tight leading-[1.15]"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {t('subheadline')}
          </p>
        </div>

        {/* CTA */}
        <motion.a
          href="#projects"
          className="inline-flex items-center gap-2 rounded-xl font-semibold text-base px-10 py-5 transition-all duration-300 hover:-translate-y-1"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: '#FFFFFF',
            boxShadow: '0 4px 24px rgba(201, 106, 58, 0.35)',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('cta_projects')}
          <span aria-hidden="true">↓</span>
        </motion.a>

      </motion.div>
    </section>
  )
}