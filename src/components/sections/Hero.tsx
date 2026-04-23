'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useRef, useCallback } from 'react'

export default function Hero() {
  const t = useTranslations('hero')
  const accentLayerRef = useRef<HTMLDivElement>(null)

  // Direct DOM mutation → zero re-renders, animación fluida
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!accentLayerRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const mask = `radial-gradient(circle 220px at ${x}px ${y}px, black 0%, transparent 100%)`
    accentLayerRef.current.style.maskImage = mask
    accentLayerRef.current.style.webkitMaskImage = mask
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!accentLayerRef.current) return
    accentLayerRef.current.style.maskImage = 'none'
    accentLayerRef.current.style.webkitMaskImage = 'none'
  }, [])

  return (
    <section
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      {/* Dot grid base — siempre visible, muy sutil */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--ink-muted) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Dot grid accent — terracota, visible solo donde está el mouse */}
      <div
        ref={accentLayerRef}
        className="absolute inset-0 opacity-50"
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

        <h1
          className="font-display text-5xl md:text-7xl font-semibold tracking-tight mb-4"
          style={{ color: 'var(--ink-primary)' }}
        >
          {t('headline')}
        </h1>

        <p
          className="font-display text-5xl md:text-7xl font-semibold tracking-tight mb-14"
          style={{ color: 'var(--ink-primary)' }}
        >
          {t('subheadline')}
        </p>

        <motion.a
          href="#projects"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-medium text-base transition-colors duration-200"
          style={{ backgroundColor: 'var(--color-accent)', color: '#FFFFFF' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('cta_projects')}
          <span aria-hidden>→</span>
        </motion.a>

      </motion.div>
    </section>
  )
}
