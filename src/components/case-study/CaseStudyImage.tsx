'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/**
 * Bloque de imagen contextual para el layout Awwwards-style.
 *
 * Client component porque usa `useScroll` + `useTransform` para parallax
 * suave: la imagen se mueve verticalmente ~24px relativo al scroll mientras
 * está en viewport, creando una sensación de profundidad sin ruido visual.
 *
 * Modos:
 * 1. Imagen real: pasar `src` + `alt`. Renderea <img> con parallax.
 * 2. Placeholder: si `src` es undefined, muestra un cuadrado con border
 *    dashed + el contenido de `description` y `prompt` como guía para que
 *    Tiago genere la imagen y la reemplace después.
 *
 * Props:
 * - `src`: path absoluto desde /public (ej. "/images/case-study/...").
 * - `alt`: texto alternativo (a11y) — siempre obligatorio.
 * - `caption?`: texto que aparece debajo de la imagen como pie de foto.
 * - `aspectRatio?`: "video" (16/9) | "square" (1/1) | "wide" (3/2 — default)
 *                   | "portrait" (3/4). Controla la altura del bloque.
 * - `description?`: SOLO en modo placeholder — qué imagen tiene que ir.
 * - `prompt?`: SOLO en modo placeholder — prompt sugerido para Nano Banana
 *              o Gemini Pro.
 */

type AspectRatio = 'video' | 'square' | 'wide' | 'portrait'

const ASPECT_CLASSES: Record<AspectRatio, string> = {
  video:    'aspect-video',
  square:   'aspect-square',
  wide:     'aspect-[3/2]',
  portrait: 'aspect-[3/4]',
}

interface Props {
  src?:         string
  alt:          string
  caption?:     string
  aspectRatio?: AspectRatio
  description?: string
  prompt?:      string
}

export default function CaseStudyImage({
  src,
  alt,
  caption,
  aspectRatio = 'wide',
  description,
  prompt,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  // Parallax: cuando el bloque entra/sale del viewport, la imagen se mueve
  // verticalmente. offset ['start end','end start'] = empieza el progress
  // cuando el top entra al bottom de la viewport y termina cuando el bottom
  // sale por el top (rango completo de visibilidad).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [24, -24])

  // Modo placeholder — sin src, mostramos guía visual de qué imagen falta.
  if (!src) {
    return (
      <figure ref={ref} className="relative w-full">
        <div
          className={`${ASPECT_CLASSES[aspectRatio]} w-full rounded-xl border-2 border-dashed flex items-center justify-center p-8`}
          style={{
            borderColor: 'var(--border-strong)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <div className="max-w-md text-center space-y-3">
            <p
              className="text-[11px] font-mono uppercase tracking-[0.18em]"
              style={{ color: 'var(--color-accent)' }}
            >
              TODO · Imagen pendiente
            </p>
            {description && (
              <p
                className="text-sm md:text-base font-display"
                style={{ color: 'var(--ink-primary)' }}
              >
                {description}
              </p>
            )}
            {prompt && (
              <p
                className="text-xs font-mono leading-relaxed"
                style={{ color: 'var(--ink-secondary)' }}
              >
                <span className="opacity-60">Prompt sugerido: </span>
                {prompt}
              </p>
            )}
          </div>
        </div>
        {caption && (
          <figcaption
            className="mt-3 text-xs font-mono"
            style={{ color: 'var(--ink-muted)' }}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  return (
    <figure ref={ref} className="relative w-full">
      <div
        className={`${ASPECT_CLASSES[aspectRatio]} relative w-full rounded-xl overflow-hidden`}
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* La imagen es 48px más alta que el container y arranca con top:-24px.
            Eso le da 24px de "extra" arriba y 24px abajo para absorber el rango
            de parallax (y va de +24 a -24). Sin ese extra, el parallax exponía
            el fondo del container arriba/abajo cuando se desplazaba. */}
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          style={{ y, top: -24, height: 'calc(100% + 48px)' }}
          className="absolute left-0 w-full object-cover"
        />
      </div>
      {caption && (
        <figcaption
          className="mt-3 text-xs font-mono"
          style={{ color: 'var(--ink-muted)' }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
