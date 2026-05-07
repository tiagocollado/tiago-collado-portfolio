'use client'

/**
 * ProjectCard
 * -----------
 * Card de un proyecto en la grilla bento de la home.
 *
 * Layout (inspirado en VERTEX IDENTITY de las refs):
 *  - Cover image absolute, theme-aware overlay (no más overlay negro fijo).
 *  - Top-left: tipo del proyecto + año (label fijo, siempre visible).
 *  - Bottom-left: título display dominante, siempre visible.
 *  - Hover: tags pills + CTA pill SÓLIDO accent aparecen debajo del título.
 *  - Card lift sutil + shadow tinted con accent en hover.
 */

import { Project, Locale } from '@/types'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface ProjectCardProps {
  project: Project
  locale: Locale
  /**
   * Posición de la card en el grid (0-based). Se usa para calcular el delay
   * incremental del reveal scroll-driven (stagger). Si no se pasa, no hay
   * stagger — la card aparece sin delay.
   */
  index?: number
}

export default function ProjectCard({ project, locale, index = 0 }: ProjectCardProps) {
  const t = useTranslations('projects')

  const spanClasses = project.featured
    ? 'md:col-span-2 md:row-span-1'
    : 'md:col-span-1 md:row-span-1'

  // Featured cards son más anchas → título puede ser más grande.
  const titleSize = project.featured
    ? 'text-3xl md:text-4xl lg:text-5xl'
    : 'text-2xl md:text-3xl lg:text-4xl'

  const typeLabel =
    project.type === 'ux' ? 'UX / UI'
    : project.type === 'fullstack' ? 'FULL-STACK'
    : project.type === 'wordpress' ? 'WORDPRESS'
    : 'DESIGN'

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`${spanClasses} relative rounded-2xl overflow-hidden group border transition-all duration-500 ease-out
                  hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/25 hover:border-accent`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Link invisible que cubre toda la card (no aplica si está coming-soon) */}
      {!project.comingSoon && (
        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="absolute inset-0 z-30"
          aria-label={`Ver caso de estudio: ${project.title}`}
        />
      )}

      {/* Cover image — desaturada en idle, color en hover */}
      {project.coverImage && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover
                       opacity-50 grayscale scale-105
                       transition-all duration-700 ease-out
                       group-hover:opacity-80 group-hover:grayscale-0 group-hover:scale-100"
          />
          {/*
            Overlay theme-aware: usa color-mix() para mezclar el bg-primary del tema
            con transparente. En light mode el gradiente es claro (texto oscuro legible),
            en dark mode es oscuro (texto claro legible). Resuelve el bug del overlay
            negro fijo que se veía mal en light.
          */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, color-mix(in srgb, var(--bg-primary) 30%, transparent) 0%, color-mix(in srgb, var(--bg-primary) 92%, transparent) 100%)',
            }}
          />
        </div>
      )}

      {/* Coming soon overlay (también theme-aware) */}
      {project.comingSoon && (
        <div
          className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-20"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--bg-primary) 70%, transparent)',
          }}
        >
          <span
            className="px-5 py-2.5 rounded-full font-medium text-xs tracking-widest uppercase border"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--ink-primary)',
              borderColor: 'var(--border-default)',
            }}
          >
            {t('coming_soon')}
          </span>
        </div>
      )}

      {/* Tag arriba-izquierda — pills bordeadas para garantizar legibilidad
          sobre cualquier cover (el bg semi-translúcido aísla del fondo). */}
      {!project.comingSoon && (
        <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-mono font-semibold tracking-[0.15em] uppercase"
            style={{
              color: 'var(--color-accent)',
              borderColor: 'var(--color-accent)',
              backgroundColor: 'color-mix(in srgb, var(--bg-primary) 70%, transparent)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {typeLabel}
          </span>
          {project.year && (
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-mono font-semibold tracking-[0.15em]"
              style={{
                color: 'var(--ink-primary)',
                borderColor: 'var(--border-strong)',
                backgroundColor: 'color-mix(in srgb, var(--bg-primary) 70%, transparent)',
                backdropFilter: 'blur(4px)',
              }}
            >
              {project.year}
            </span>
          )}
        </div>
      )}

      {/* Bloque inferior — título + reveal en hover (tags + CTA) */}
      {!project.comingSoon && (
        <div className="absolute bottom-5 left-5 right-5 z-10">
          {/* Título — siempre visible, dominante */}
          <h3
            className={`font-display font-semibold leading-[1.05] uppercase ${titleSize}`}
            style={{ color: 'var(--ink-primary)' }}
          >
            {project.title}
          </h3>

          {/* Reveal en hover: tags pills + CTA pill SÓLIDO */}
          <div className="mt-4 flex flex-col gap-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, project.featured ? 4 : 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono tracking-wide rounded-full border px-3 py-1.5"
                  style={{
                    color: 'var(--ink-secondary)',
                    borderColor: 'var(--border-strong)',
                    backgroundColor: 'color-mix(in srgb, var(--color-surface) 80%, transparent)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA pill SÓLIDO — bg accent + texto blanco + flecha animada */}
            <span
              className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-5 py-2.5 w-fit"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: '#FFFFFF',
              }}
            >
              {t('view_case')}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      )}
    </motion.article>
  )
}
