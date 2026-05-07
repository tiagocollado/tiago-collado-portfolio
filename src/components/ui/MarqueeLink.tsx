'use client'

import { motion, useMotionValue, animate, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

/**
 * Link estilo isadeburgh.com — el contenido (label + 2 íconos ↗) cruza el
 * container en loop continuo, SIN huecos: cuando una flecha sale por la
 * izquierda, la siguiente copia ya cubrió desde la derecha. El container
 * siempre muestra contenido.
 *
 * Técnica clásica de marquee:
 * - Track contiene 2 copias idénticas en `inline-flex`.
 * - Container width = ancho de UNA copia (medido en runtime).
 * - Loop: `x` va de -copyWidth → 0 linear (contenido se mueve HACIA LA DERECHA).
 *   Al completar, salta a -copyWidth y repite. Como las copias son idénticas,
 *   el salto es invisible.
 *
 * Hover:
 * - El track decelera HACIA LA IZQUIERDA un trecho corto y se detiene —
 *   inversa de la dirección natural del loop, refuerza la intención "estoy
 *   por hacer click acá".
 *
 * Mouse out:
 * - Continúa el loop hacia la derecha desde donde quedó (sin pasar por
 *   ninguna animación reversa intermedia).
 *
 * a11y: aria-label fijo en el <a>; track aria-hidden (decoración).
 * `prefers-reduced-motion` se respeta — cuando está activo, no animamos.
 */
interface Props {
  href:         string
  label:        string
  /** Duración del ciclo completo (ancho de 1 copia) en segundos. */
  durationSec?: number
}

export default function MarqueeLink({
  href,
  label,
  durationSec = 3,
}: Props) {
  const [hovered, setHovered] = useState(false)
  const [copyWidth, setCopyWidth] = useState(0)
  const copyRef = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const reducedMotion = useReducedMotion()

  // Medimos el ancho de UNA copia tras el mount. Mientras copyWidth=0,
  // renderizamos solo 1 copia (para medir limpio); cuando ya tenemos
  // medida, agregamos la 2da copia que hace el loop continuo.
  useEffect(() => {
    const w = copyRef.current?.offsetWidth ?? 0
    if (w > 0) setCopyWidth(w)
  }, [label])

  useEffect(() => {
    if (copyWidth === 0) return

    if (reducedMotion) {
      x.set(0)
      return
    }

    if (hovered) {
      // Decelera hasta x = -copyWidth: el label vuelve a quedar pegado al
      // borde izquierdo del container con las flechas a la derecha (que es
      // como se ve también en x=0, porque las copias son idénticas). Esto
      // evita que el reposo caiga en una x arbitraria mostrando "icono
      // primero, label después". Como el loop natural va hacia la derecha
      // (x crece de -copyWidth a 0), animar hacia -copyWidth = movimiento
      // hacia la IZQUIERDA, que es lo que el hover debe transmitir.
      const controls = animate(x, -copyWidth, {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      })
      return () => controls.stop()
    }

    // Sin hover (primer mount o salida de hover): retomamos el loop hacia
    // la derecha desde la posición actual de x. La duración inicial es
    // proporcional al tramo que falta para llegar a 0; después loopea de
    // -copyWidth → 0 infinito.
    let active = true
    let loopControls: ReturnType<typeof animate> | undefined

    const currentX        = x.get()
    const remainingRange  = 0 - currentX
    const initialDuration = remainingRange > 0
      ? (remainingRange / copyWidth) * durationSec
      : 0

    const initial = animate(x, 0, {
      duration: Math.max(initialDuration, 0),
      ease: 'linear',
      onComplete: () => {
        if (!active) return
        x.set(-copyWidth)
        loopControls = animate(x, 0, {
          duration: durationSec,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        })
      },
    })

    return () => {
      active = false
      initial.stop()
      loopControls?.stop()
    }
  }, [hovered, reducedMotion, durationSec, copyWidth, x])

  return (
    <a
      href={href}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex items-center overflow-hidden h-6 text-sm font-medium align-middle"
      style={{
        color: 'var(--ink-primary)',
        // Mientras medimos (primer render), width: auto deja que el container
        // se ajuste al ancho de la única copia visible. Tras medir, fijamos
        // el width al ancho exacto de 1 copia para que el overflow clipe la 2da.
        width: copyWidth > 0 ? `${copyWidth}px` : 'auto',
      }}
    >
      <motion.div
        aria-hidden="true"
        className="inline-flex items-center whitespace-nowrap"
        style={{ x }}
      >
        {/* 1ra copia — la que medimos para calcular copyWidth */}
        <span ref={copyRef} className="inline-flex items-center gap-1 shrink-0">
          <span>{label}</span>
          <ArrowUpRight size={14} style={{ color: 'var(--color-accent)' }} />
          <ArrowUpRight size={14} style={{ color: 'var(--color-accent)' }} />
        </span>
        {/* 2da copia — solo después de medir, para garantizar loop continuo */}
        {copyWidth > 0 && (
          <span className="inline-flex items-center gap-1 shrink-0">
            <span>{label}</span>
            <ArrowUpRight size={14} style={{ color: 'var(--color-accent)' }} />
            <ArrowUpRight size={14} style={{ color: 'var(--color-accent)' }} />
          </span>
        )}
      </motion.div>
    </a>
  )
}
