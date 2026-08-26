'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/**
 * Bloque de imagen contextual para el layout Awwwards-style.
 *
 * Client component porque usa `useScroll` + `useTransform` para parallax
 * suave: la imagen se mueve verticalmente ~24px relativo al scroll mientras
 * está en viewport, creando una sensación de profundidad sin ruido visual.
 *
 * ⚠️ El parallax y el recorte 3:2 son SOLO desktop (md+). En mobile la
 * imagen se renderea completa, en flujo normal y quieta — ver notas abajo.
 *
 * Modos:
 * 1. Imagen real: pasar `src` + `alt`. Renderea <img>.
 * 2. Placeholder: si `src` es undefined, muestra un cuadrado con border
 *    dashed + el contenido de `description` y `prompt` como guía para que
 *    Tiago genere la imagen y la reemplace después.
 *
 * Props:
 * - `src`: path absoluto desde /public (ej. "/images/case-study/...").
 * - `alt`: texto alternativo (a11y) — siempre obligatorio.
 * - `caption?`: texto que aparece debajo de la imagen como pie de foto.
 * - `aspectRatio?`: "video" (16/9) | "square" (1/1) | "wide" (3/2 — default)
 *                   | "portrait" (3/4). Controla la altura del bloque EN DESKTOP.
 * - `description?`: SOLO en modo placeholder — qué imagen tiene que ir.
 * - `prompt?`: SOLO en modo placeholder — prompt sugerido para Nano Banana
 *              o Gemini Pro.
 */

type AspectRatio = 'video' | 'square' | 'wide' | 'portrait'

// Usado por el placeholder: ahí SÍ queremos una caja de altura fija en
// cualquier viewport, porque no hay imagen que dicte la altura.
const ASPECT_CLASSES: Record<AspectRatio, string> = {
  video:    'aspect-video',
  square:   'aspect-square',
  wide:     'aspect-[3/2]',
  portrait: 'aspect-[3/4]',
}

// Usado por la imagen real: el recorte arranca recién en md+.
// En mobile el container no tiene aspect fijo, así que la imagen se ve
// entera (sin crop) y define ella misma la altura del bloque.
const MD_ASPECT_CLASSES: Record<AspectRatio, string> = {
  video:    'md:aspect-video',
  square:   'md:aspect-square',
  wide:     'md:aspect-[3/2]',
  portrait: 'md:aspect-[3/4]',
}

/**
 * Devuelve true cuando el viewport es md+ (768px).
 *
 * Arranca en false a propósito: el HTML que Next pre-renderea es el mismo
 * para todos, así que si asumiéramos desktop tendríamos un mismatch de
 * hidratación. El layout de mobile-a-desktop lo resuelve CSS (clases md:),
 * así que este hook solo decide si el parallax corre o no.
 */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return isDesktop
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
  const isDesktop = useIsDesktop()

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
              · BUILDING ·
            </p>
            {/* Mostramos description si existe, alt como fallback. Esto sirve
                de guía al usuario para saber qué imagen tiene que ir acá. */}
            {(description || alt) && (
              <p
                className="text-sm md:text-base font-display"
                style={{ color: 'var(--ink-primary)' }}
              >
                {description || alt}
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
    <motion.figure
      ref={ref}
      className="relative w-full"
      // Sin cursor variant ni hover: estas imágenes no abren lightbox ni
      // navegan a ningún lado. Un cursor "VIEW" prometía una interacción
      // que no existe.
      //
      // Blur-in cuando entra al viewport: la imagen arranca borrosa + un
      // pelín achicada y se enfoca a medida que aparece. Refuerza el feeling
      // editorial de "foto que se va resolviendo". Una sola vez (`once: true`).
      initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.98 }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`${MD_ASPECT_CLASSES[aspectRatio]} relative w-full rounded-xl overflow-hidden`}
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/*
          MOBILE (default): la imagen va en flujo normal, `h-auto`, sin crop.
          Se ve completa y no se mueve al scrollear.

          DESKTOP (md+): pasa a `absolute` y se recorta al aspect del
          container. Es 48px más alta (`h-[calc(100%+48px)]`) y arranca en
          `-top-6` (-24px), para que el parallax (y va de +24 a -24) tenga
          margen y no exponga el fondo del container arriba/abajo.
        */}
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          style={isDesktop ? { y } : undefined}
          className="block w-full h-auto md:absolute md:left-0 md:-top-6 md:h-[calc(100%+48px)] md:object-cover"
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
    </motion.figure>
  )
}
