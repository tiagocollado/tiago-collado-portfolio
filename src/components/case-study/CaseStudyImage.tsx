'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { CaseStudyImageType } from '@/types'
import {
  AspectRatio,
  IMAGE_TYPE_SPEC,
  SIZES_BLEED,
  SIZES_SHELL,
} from './imageSpec'

/*
 * next/image envuelto en framer-motion.
 *
 * `motion.create()` es la forma de animar un componente que NO es una etiqueta
 * HTML suelta. Hace falta acá porque el parallax aplica un motion value (`y`)
 * sobre la imagen, y `motion.img` ya no sirve: el <img> ahora lo rendea Next.
 *
 * Va a nivel de módulo, NO adentro del componente: si se creara en cada render,
 * React vería un tipo de componente distinto cada vez, desmontaría el <img> y
 * la imagen volvería a cargar en cada re-render.
 */
const MotionImage = motion.create(Image)

/**
 * Bloque de imagen del case study.
 *
 * ⚠️ El componente ya NO decide cómo se ve la imagen: eso lo decide su
 * `type`, vía `imageSpec.ts`. Antes recibía `aspectRatio` y la page le pasaba
 * `"wide"` hardcodeado en los cuatro slots, así que las cuatro imágenes de
 * todos los case studies medían exactamente lo mismo (2400x1600) y no había
 * jerarquía: el ojo no sabía qué mirar primero.
 *
 * Lo que sale del `type`:
 * - el ancho (a sangre vs shell de 1280px),
 * - el recorte en desktop (o ninguno, en la tira larga),
 * - el parallax (solo si hay recorte que lo contenga),
 * - el `sizes` que necesita `next/image`,
 * - el radius (0 a sangre: una imagen de viewport completo con esquinas
 *   redondeadas se lee como un bug, no como una decisión).
 *
 * ⚠️ El ancho de a sangre lo da el wrapper, no este componente: quien decide
 * si la imagen va adentro o afuera del shell es `CaseStudyImageRun`. Acá solo
 * se usa `bleed` para el radius y el `sizes`.
 *
 * En mobile, cualquier tipo se renderea completo, en flujo normal y quieto:
 * sin recorte y sin parallax. Es la razón por la que la regla de comprensión
 * a 330px existe (ver `.claude/rules/imagenes.md`).
 *
 * Modos:
 * 1. Imagen real: pasar `src`. Renderea <img>.
 * 2. Placeholder: sin `src`, muestra una caja dashed con `description` y
 *    `prompt` como guía. Hoy no se usa — la page filtra los briefs sin `src`
 *    para no llenar el sitio de cajas "en obra".
 */

// Recorte del placeholder: ahí SÍ queremos una caja de altura fija en
// cualquier viewport, porque no hay imagen que dicte la altura.
const ASPECT_CLASSES: Record<AspectRatio, string> = {
  video:    'aspect-video',
  square:   'aspect-square',
  wide:     'aspect-[3/2]',
  portrait: 'aspect-[3/4]',
}

// Recorte de la imagen real: arranca recién en md+.
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
  /** Tipo del vocabulario. Decide ancho, recorte, parallax, sizes y radius. */
  type:        CaseStudyImageType
  src?:        string
  alt:         string
  caption?:    string
  /** Proporción real del archivo. Para los tipos sin recorte (ver types). */
  frame?:      { width: number; height: number }
  /** `true` en la imagen del slot `hero`: es la candidata a LCP de la página. */
  priority?:   boolean
  description?: string
  prompt?:     string
}

export default function CaseStudyImage({
  type,
  src,
  alt,
  caption,
  frame,
  priority = false,
  description,
  prompt,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isDesktop = useIsDesktop()

  const spec = IMAGE_TYPE_SPEC[type]
  const dimensions = frame ?? spec.frame
  const sizes = spec.bleed ? SIZES_BLEED : SIZES_SHELL
  // A sangre el radius va a 0. Adentro del shell, el de cards de la marca.
  const radius = spec.bleed ? '' : 'rounded-xl'

  // Parallax: cuando el bloque entra/sale del viewport, la imagen se mueve
  // verticalmente. offset ['start end','end start'] = empieza el progress
  // cuando el top entra al bottom de la viewport y termina cuando el bottom
  // sale por el top (rango completo de visibilidad).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [24, -24])

  // Entrada compartida por los dos modos: la imagen arranca borrosa + un
  // pelín achicada y se enfoca a medida que aparece. Refuerza el feeling
  // editorial de "foto que se va resolviendo". Una sola vez (`once: true`).
  const reveal = {
    initial:     { opacity: 0, filter: 'blur(12px)', scale: 0.98 },
    whileInView: { opacity: 1, filter: 'blur(0px)',  scale: 1 },
    viewport:    { once: true, margin: '-15% 0px' },
    transition:  { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  }

  // Modo placeholder — sin src, mostramos guía visual de qué imagen falta.
  if (!src) {
    return (
      <figure ref={ref} className="relative w-full">
        <div
          className={`${ASPECT_CLASSES[spec.aspect ?? 'portrait']} w-full rounded-xl border-2 border-dashed flex items-center justify-center p-8`}
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

  /*
   * TIPOS SIN RECORTE (`mockup` y `long-strip`).
   *
   * La imagen va en flujo normal en todos los breakpoints, `h-auto`, entera.
   * No hay container de alto fijo, así que no hay recorte ni parallax: la
   * tira significa su largo y el mockup es una composición cerrada. Se ven
   * igual en mobile y en desktop, solo más anchas.
   */
  if (spec.aspect === null) {
    return (
      <motion.figure ref={ref} className="relative w-full" {...reveal}>
        <div
          className={`${radius} relative w-full overflow-hidden`}
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <Image
            src={src}
            alt={alt}
            width={dimensions.width}
            height={dimensions.height}
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            className="block w-full h-auto"
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

  return (
    <motion.figure
      ref={ref}
      className="relative w-full"
      // Sin cursor variant ni hover: estas imágenes no abren lightbox ni
      // navegan a ningún lado. Un cursor "VIEW" prometía una interacción
      // que no existe.
      {...reveal}
    >
      <div
        className={`${MD_ASPECT_CLASSES[spec.aspect]} ${radius} relative w-full overflow-hidden`}
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
        <MotionImage
          src={src}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          style={isDesktop && spec.parallax ? { y } : undefined}
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
