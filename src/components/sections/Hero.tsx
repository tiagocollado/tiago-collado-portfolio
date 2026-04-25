'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import InteractiveDotGrid from '@/components/ui/InteractiveDotGrid'

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="min-h-screen flex items-center px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 py-24 md:py-32 lg:py-40 relative overflow-hidden">

      {/* Fondo interactivo: canvas en desktop con repulsión del cursor, CSS estático en touch. */}
      <InteractiveDotGrid opacity={0.55} />

      {/* Contenedor principal. Sin gap-* en el flex: cada bloque define su propio mt-* para
          poder agrupar identidad (nombre + role) más pegada que el resto. */}
      <motion.div
        className="max-w-6xl w-full relative z-10 flex flex-col items-start"
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
            className="inline-flex items-center gap-2.5 rounded-full border text-xs font-medium px-6 py-2"
            style={{
              borderColor: 'var(--border-strong)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--ink-secondary)',
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

        {/* Identidad: nombre + role agrupados con poco gap (son la misma "unidad" visual) */}
        <div className="mt-8 md:mt-10 flex flex-col gap-2 md:gap-3">
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.05] text-balance"
            style={{ color: 'var(--ink-primary)' }}
          >
            {t('name')}
          </h1>
          <p
            className="text-base md:text-xl font-medium tracking-wide text-balance"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {t('role')}
          </p>
        </div>

        {/* Headlines (claim del portfolio) — separados de la identidad */}
        <div className="mt-10 md:mt-14 space-y-3 max-w-3xl">
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
          className="mt-10 md:mt-12 inline-flex items-center gap-2 rounded-xl font-semibold text-base px-8 py-4 transition-all duration-300 hover:-translate-y-1"
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