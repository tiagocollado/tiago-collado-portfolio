'use client'

import { useEffect, useRef, useState, Fragment } from 'react'
import { motion, useReducedMotion, type Transition } from 'framer-motion'

type Props = {
  text: string
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
  stagger?: number
  delay?: number
  yFrom?: number
  blurFrom?: number
  duration?: number
  className?: string
  charClassName?: string
  /** Si true, anima al entrar al viewport en lugar de en el mount. */
  whileInView?: boolean
}

/**
 * SplitText — char reveal con stagger.
 *
 * Implementación:
 *  - El texto se splittea por palabras; cada palabra es un `<span class="inline-block whitespace-nowrap">`
 *    así sus chars no pueden romper en medio de la palabra cuando el viewport
 *    es estrecho. Entre palabras va un espacio normal (text node) que SÍ
 *    permite line break, así "Diseño experiencias con empatía" wrapea en
 *    espacios y nunca corta `experien‧cias` por la mitad.
 *  - Cada char es `<motion.span>` con `delay` calculado manualmente
 *    (`delay + idx * stagger`). Evita variants/staggerChildren — la stagger
 *    de Framer no propaga a través de spans intermedios sin variants, y
 *    necesitamos los spans intermedios para el word grouping.
 *  - a11y: el texto plano queda accesible vía `sr-only`; los chars visibles
 *    se marcan `aria-hidden` para no leerse letra a letra.
 *  - `prefers-reduced-motion`: render directo sin animación ni delays.
 *  - `whileInView`: usa una sola IntersectionObserver al container — no una
 *    por char (sería muy caro con muchos chars).
 */
export default function SplitText({
  text,
  as = 'span',
  stagger = 0.04,
  delay = 0,
  yFrom = 16,
  blurFrom = 4,
  duration = 0.6,
  className,
  charClassName,
  whileInView = false,
}: Props) {
  const reduced = useReducedMotion()
  const containerRef = useRef<HTMLSpanElement>(null)
  // Si no hay whileInView, animamos en el mount (inView arranca en true).
  const [inView, setInView] = useState(!whileInView)

  useEffect(() => {
    if (!whileInView || !containerRef.current) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { rootMargin: '-10% 0px' }
    )
    obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [whileInView])

  const Tag = as
  const words = text.split(' ')

  // Pre-cálculo: índice global del primer char de cada palabra. Usado para
  // calcular el `delay` de cada char con stagger global (no por palabra).
  const wordStartIdx: number[] = []
  let acc = 0
  for (const w of words) {
    wordStartIdx.push(acc)
    acc += w.length
  }

  const initialState = reduced
    ? { opacity: 1 }
    : { opacity: 0, y: yFrom, filter: `blur(${blurFrom}px)` }
  const visibleState = { opacity: 1, y: 0, filter: 'blur(0px)' }
  const animateState = inView ? visibleState : initialState

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span ref={containerRef} aria-hidden="true">
        {words.map((word, wi) => {
          const startIdx = wordStartIdx[wi]
          return (
            <Fragment key={wi}>
              <span className="inline-block whitespace-nowrap">
                {Array.from(word).map((char, ci) => {
                  const idx = startIdx + ci
                  const transition: Transition = reduced
                    ? { duration: 0 }
                    : {
                        duration,
                        ease: [0.16, 1, 0.3, 1],
                        delay: delay + idx * stagger,
                      }
                  return (
                    <motion.span
                      key={ci}
                      initial={initialState}
                      animate={animateState}
                      transition={transition}
                      className={`inline-block ${charClassName ?? ''}`}
                    >
                      {char}
                    </motion.span>
                  )
                })}
              </span>
              {/* Espacio entre palabras como text node — permite line break
                  natural en este punto y nada más. */}
              {wi < words.length - 1 && ' '}
            </Fragment>
          )
        })}
      </span>
    </Tag>
  )
}
