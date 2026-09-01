'use client'

import { useTranslations } from 'next-intl'
import { Project, Locale } from '@/types'
import { useCursor } from '@/hooks/useCursor'
import Image from 'next/image'

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
      <div className="max-w-7xl mx-auto">

        {/* Los dos paths en UNA fila desde md+: pill secundaria a la
            izquierda (columna `auto`, ocupa solo lo que mide) y card
            primaria a la derecha (`1fr`, se queda con todo el resto).
            Hick — dos opciones, jerarquía inequívoca: la card gana por
            tamaño, color de fondo, thumbnail y glow en hover; la pill es
            ghost y no compite.

            Orden del DOM: card PRIMERO, pill después. En mobile eso ya da
            el apilado correcto (primario arriba) sin necesidad de `order`,
            y en desktop el `md:order-*` las cruza. Así el CTA primario
            también es el primero en el orden de tabulación. */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-10 md:items-center">

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
            className="group block p-6 md:p-8 lg:p-10 rounded-2xl border transition-all duration-300 hover:-translate-y-2 border-(--border-default) hover:border-accent hover:shadow-2xl hover:shadow-accent/15 md:order-2"
            style={{ backgroundColor: 'var(--color-surface)' }}
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
                  <Image
                    src={nextProject.coverImage}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(max-width: 768px) 100vw, 160px"
                    className="object-cover
                               opacity-70 grayscale scale-105
                               transition-all duration-500 ease-out
                               group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110"
                  />
                </div>
              )}
            </div>
          </a>

          {/* Pill ghost: secondary path al listado completo. Anchor `#projects`
              para aterrizar directo en la grid (Lenis lo respeta).
              En mobile se centra bajo la card; en desktop se alinea al
              inicio de su columna y queda centrada verticalmente contra
              la card por el `md:items-center` del grid padre. */}
          <div className="flex justify-center md:justify-start md:order-1">
            <a
              href={`/${locale}#projects`}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 hover:-translate-y-0.5 border-(--border-default) text-(--ink-secondary) hover:border-accent hover:text-(--ink-primary)"
              style={{ backgroundColor: 'var(--color-surface)' }}
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
    </div>
  )
}
