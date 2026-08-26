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
 *  2. Type label (UX/UI Case Study, etc.)
 *  3. H1 con SplitText char reveal
 *  4. Tags (solo cuando NO awwwardsLayout — en Awwwards el stack vive en sidebar)
 *  5. Tagline
 *  6. CTAs (solo cuando NO awwwardsLayout — en Awwwards los links viven en sidebar)
 *
 * Cascade: container variant con `staggerChildren: 0.12`. Cada bloque es
 * motion.* con `variants={item}`. El SplitText H1 anima sus chars internos
 * con stagger propio que arranca después del delay del container.
 *
 * Cursor variants: `link` en back / CTAs (anchors). En el H1 el cursor
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

  const typeLabel =
    project.type === 'ux'
      ? 'UX / UI Case Study'
      : project.type === 'fullstack'
      ? 'Full-stack Project'
      : project.type === 'wordpress'
      ? 'WordPress Project'
      : 'Design Project'

  const hasLinks = Boolean(
    project.links.live || project.links.github || project.links.githubBack
  )

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="max-w-7xl mx-auto"
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

      {/* 2. Tipo de proyecto */}
      <motion.p
        variants={item}
        className="text-xs font-mono tracking-[0.2em] uppercase mb-5"
        style={{ color: 'var(--color-accent)' }}
      >
        {typeLabel}
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

      {/* 4. Tags (solo non-awwwards layout) */}
      {!project.awwwardsLayout && (
        <motion.div variants={item} className="flex flex-wrap gap-2 mb-8 md:mb-10">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono tracking-wide px-3 py-1.5 rounded-full border"
              style={{
                borderColor: 'var(--border-default)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--ink-secondary)',
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>
      )}

      {/* 5. Tagline */}
      <motion.p
        variants={item}
        className="text-lg md:text-2xl leading-relaxed mb-10 md:mb-12 max-w-3xl text-balance"
        style={{ color: 'var(--ink-secondary)' }}
      >
        {project.tagline[locale]}
      </motion.p>

      {/* 6. CTAs (solo non-awwwards layout + has links). En Awwwards los links
          viven en el sidebar. */}
      {!project.awwwardsLayout && hasLinks && (
        <motion.div variants={item} className="flex flex-wrap gap-3 mb-12 md:mb-16">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={onLinkEnter}
              onMouseLeave={onLinkLeave}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: '#FFFFFF',
              }}
            >
              <span>{cs('view_live')}</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={onLinkEnter}
              onMouseLeave={onLinkLeave}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 hover:-translate-y-0.5 border-(--border-default) hover:border-accent"
              style={{ color: 'var(--ink-primary)' }}
            >
              <span>{cs('view_github_frontend')}</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          )}
          {project.links.githubBack && (
            <a
              href={project.links.githubBack}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={onLinkEnter}
              onMouseLeave={onLinkLeave}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 hover:-translate-y-0.5 border-(--border-default) hover:border-accent"
              style={{ color: 'var(--ink-primary)' }}
            >
              <span>{cs('view_github_backend')}</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
