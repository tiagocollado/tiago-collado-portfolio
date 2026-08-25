'use client'

import { useTranslations } from 'next-intl'
import { Project, Locale } from '@/types'
import { useCursor } from '@/hooks/useCursor'

/**
 * CaseStudyNextNav — bloque al pie del case study con dos paths:
 *  1. Card prominente del próximo proyecto (cover thumbnail + nombre).
 *  2. Pill ghost para volver al listado completo.
 *
 * Vive como client component porque ambos links setean cursor variant
 * en hover. El layout y la copy se mantienen idénticos al patrón server
 * que existía antes.
 */
export default function CaseStudyNextNav({
  nextProject,
  locale,
}: {
  nextProject: Project
  locale: Locale
}) {
  const cs = useTranslations('case_study')
  const { setVariant } = useCursor()

  const onEnter = () => setVariant('link')
  const onLeave = () => setVariant('default')

  return (
    <div className="px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 mt-28 md:mt-40">
      <div className="max-w-5xl mx-auto">

        {/* Card "Próximo proyecto" — grid 2-col con texto a la izquierda
            + thumbnail del cover a la derecha. El thumbnail desatura en
            idle (igual que las project cards del home) y se vuelve color
            + scale 1.04 en hover. La flecha queda chica al lado del título
            y desliza en hover. Card hover: lift -2 + border accent +
            glow accent. */}
        <a
          href={`/${locale}/projects/${nextProject.slug}`}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className="group block p-6 md:p-8 lg:p-10 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:border-accent hover:shadow-2xl hover:shadow-accent/15"
          style={{
            borderColor: 'var(--border-default)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
            <div>
              <p
                className="text-xs font-mono tracking-[0.2em] uppercase mb-3"
                style={{ color: 'var(--color-accent)' }}
              >
                {cs('next_project_label')}
              </p>
              <div className="flex items-baseline gap-4 flex-wrap">
                <h2
                  className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight"
                  style={{ color: 'var(--ink-primary)' }}
                >
                  {nextProject.title}
                </h2>
                <span
                  aria-hidden
                  className="text-xl md:text-2xl inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-2"
                  style={{ color: 'var(--color-accent)' }}
                >
                  →
                </span>
              </div>
            </div>

            {nextProject.coverImage && (
              <div className="relative w-full md:w-32 lg:w-40 aspect-square rounded-xl overflow-hidden shrink-0">
                <img
                  src={nextProject.coverImage}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover
                             opacity-70 grayscale scale-105
                             transition-all duration-500 ease-out
                             group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110"
                />
              </div>
            )}
          </div>
        </a>

        {/* Pill ghost: secondary path al listado completo. Anchor `#projects`
            para aterrizar directo en la grid (Lenis lo respeta). */}
        <div className="mt-12 md:mt-16">
          <a
            href={`/${locale}#projects`}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-(--ink-primary)"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--ink-secondary)',
            }}
          >
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 ease-expo-out group-hover:-translate-x-1"
            >
              ←
            </span>
            {cs('view_all_projects')}
          </a>
        </div>

      </div>
    </div>
  )
}
