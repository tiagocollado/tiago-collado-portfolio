'use client'

import { useTranslations } from 'next-intl'
import { motion, type Variants } from 'framer-motion'
import { Project, Locale } from '@/types'
import SplitText from '@/components/ui/SplitText'
import { useCursor } from '@/hooks/useCursor'

/**
 * CaseStudyHeader — cabecera del case study con cascade entrance.
 *
 * Estructura:
 *  1. Back link (← Volver)
 *  2. Categorías del servicio (`services`)
 *  3. H1 con SplitText char reveal
 *  4. Tagline
 *
 * El stack y los links del proyecto no van acá: viven en la barra de
 * metadata (`CaseStudyMetaBar`).
 *
 * Cascade: container variant con `staggerChildren: 0.12`. Cada bloque es
 * motion.* con `variants={item}`. El SplitText H1 anima sus chars internos
 * con stagger propio que arranca después del delay del container.
 *
 * Cursor variants: `link` en el back link. En el H1 el cursor
 * queda en `default` — es texto, no interactivo.
 */

const container: Variants = {
  hidden: { opacity: 1 }, // dejamos hijos manejar opacity individualmente
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function CaseStudyHeader({
  project,
  locale,
}: {
  project: Project
  locale: Locale
}) {
  const cs = useTranslations('case_study')
  const { setVariant } = useCursor()

  const onLinkEnter = () => setVariant('link')
  const onLinkLeave = () => setVariant('default')

  // Categorías del servicio prestado, en formato de agencia. Reemplazó al
  // label derivado de `project.type` ("UX / UI Case Study"), que describía
  // a Tiago en vez del trabajo. El `&` es el separador de la marca.
  const servicesLabel = project.services[locale].join(' & ')

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      // Sin `max-w-7xl` propio: el ancho lo da el <Shell> de la page, igual
      // que en todos los demas bloques del case study.
    >
      {/* 1. Back link — pill ghost con flecha que se desliza 4px a la
          izquierda en hover. Mismo lenguaje visual que las pills del resto
          del portfolio (Email, WhatsApp, project nav). En reposo: border
          default + bg surface + texto secondary. Hover: border accent +
          texto primary + lift sutil. */}
      <div className="mb-10 md:mb-14">
        <motion.a
          variants={item}
          href={`/${locale}`}
          onMouseEnter={onLinkEnter}
          onMouseLeave={onLinkLeave}
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 hover:-translate-y-0.5 border-(--border-default) text-(--ink-secondary) hover:border-accent hover:text-(--ink-primary)"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 ease-expo-out group-hover:-translate-x-1"
          >
            ←
          </span>
          {cs('back')}
        </motion.a>
      </div>

      {/* 2. Categorías del servicio prestado */}
      <motion.p
        variants={item}
        className="text-xs font-mono tracking-[0.2em] uppercase mb-5"
        style={{ color: 'var(--color-accent)' }}
      >
        {servicesLabel}
      </motion.p>

      {/* 3. Título — SplitText char reveal. El delay arranca después del
          stagger del container (back + type ya entraron). */}
      <SplitText
        as="h1"
        text={project.title}
        stagger={0.025}
        delay={0.35}
        yFrom={20}
        blurFrom={6}
        duration={0.7}
        className="font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-6 md:mb-8 max-w-4xl text-balance block text-(--ink-primary)"
      />

      {/* 4. Tagline */}
      <motion.p
        variants={item}
        className="text-lg md:text-2xl leading-relaxed mb-10 md:mb-12 max-w-3xl text-balance"
        style={{ color: 'var(--ink-secondary)' }}
      >
        {project.tagline[locale]}
      </motion.p>
    </motion.div>
  )
}
