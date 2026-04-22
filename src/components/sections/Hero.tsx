'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      
      {/* Dot grid background */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--ink-muted) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <motion.div 
        className="max-w-4xl w-full relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        
        <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight mb-4" style={{ color: 'var(--ink-primary)' }}>
          {t('headline')}
        </h1>

        <p className="font-display text-5xl md:text-7xl font-semibold tracking-tight mb-12" style={{ color: 'var(--ink-primary)' }}>
          {t('subheadline')}
        </p>

        <motion.a 
          href="#projects"
          className="inline-block px-8 py-4 rounded-lg font-medium text-base transition-all duration-200"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: '#FFFFFF',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('cta_projects')}
        </motion.a>

      </motion.div>
    </section>
  )
}