'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useRef, useCallback } from 'react'

export default function Hero() {
  const t = useTranslations('hero')
  const accentLayerRef = useRef<HTMLDivElement>(null)

  // Mutación directa del DOM → cero re-renders, animación fluida
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!accentLayerRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const mask = `radial-gradient(circle 240px at ${x}px ${y}px, black 0%, transparent 100%)`
    accentLayerRef.current.style.maskImage = mask
    accentLayerRef.current.style.webkitMaskImage = mask
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!accentLayerRef.current) return
    accentLayerRef.current.style.maskImage = 'none'
    accentLayerRef.current.style.webkitMaskImage = 'none'
  }, [])

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="min-h-screen flex items-center justify-center px-6 md:px-10 py-20 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      {/* Dot grid base — sutil, siempre visible */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--ink-muted) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Dot grid accent — terracota, se ilumina cerca del mouse */}
      <div
        ref={accentLayerRef}
        className="absolute inset-0 opacity-55 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-accent) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'none',
          WebkitMaskImage: 'none',
        }}
      />

      <motion.div
        className="max-w-4xl w-full relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >

        {/* Identidad: nombre + rol + status */}
        <motion.div
          className="mb-10 md:mb-14"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Status pill con dot animado */}
          <div
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border mb-6
                       text-xs font-medium"
            style={{
              borderColor: 'var(--border-strong)',
              backgroundColor: 'var(--bg-primary)',
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

          {/* Nombre — protagonista de la identidad */}
          <p
            className="font-display text-xl md:text-2xl font-semibold tracking-tight mb-1.5"
            style={{ color: 'var(--ink-primary)' }}
          >
            {t('name')}
          </p>

          {/* Rol — contexto inmediato para el reclutador */}
          <p
            className="text-sm md:text-base font-mono tracking-wide"
            style={{ color: 'var(--ink-muted)' }}
          >
            {t('role')}
          </p>
        </motion.div>

        {/* Headline display */}
        <h1
          className="font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-3 md:mb-4"
          style={{ color: 'var(--ink-primary)' }}
        >
          {t('headline')}
        </h1>

        <p
          className="font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-12 md:mb-16"
          style={{ color: 'var(--ink-primary)' }}
        >
          {t('subheadline')}
        </p>

        {/* CTAs: primario + secundario */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
          <motion.a
            href="#projects"
            className="inline-flex items-center gap-2 px-7 md:px-8 py-4 rounded-lg font-medium text-base transition-colors duration-200 w-full sm:w-auto justify-center sm:justify-start"
            style={{ backgroundColor: 'var(--color-accent)', color: '#FFFFFF' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('cta_projects')}
            <span aria-hidden>→</span>
          </motion.a>

          <motion.button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-7 md:px-8 py-4 rounded-lg font-medium text-base border transition-all duration-200 w-full sm:w-auto justify-center sm:justify-start hover:bg-(--bg-secondary)"
            style={{
              borderColor: 'var(--border-strong)',
              color: 'var(--ink-primary)',
              backgroundColor: 'transparent',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('cta_contact')}
            <span aria-hidden>↓</span>
          </motion.button>
        </div>

      </motion.div>
    </section>
  )
}
