'use client'

import { useRef, useEffect } from 'react'
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

type Options = {
  factor?: number
  stiffness?: number
  damping?: number
  /**
   * Tope en px del desplazamiento. Sin esto el efecto escala con el TAMANO
   * del elemento: el desplazamiento es la distancia al centro por el factor,
   * asi que un pill chico se mueve poco y un titulo ancho se mueve muchisimo.
   * Con `max` el iman se siente igual de sutil en cualquier elemento.
   */
  max?: number
}

export function useMagneticHover<T extends HTMLElement = HTMLElement>({
  factor = 0.3,
  stiffness = 150,
  damping = 15,
  max,
}: Options = {}) {
  const ref = useRef<T | null>(null)
  const reduced = useReducedMotion()

  const xRaw = useMotionValue(0)
  const yRaw = useMotionValue(0)
  const x = useSpring(xRaw, { stiffness, damping })
  const y = useSpring(yRaw, { stiffness, damping })

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      let dx = (e.clientX - cx) * factor
      let dy = (e.clientY - cy) * factor

      // Clampeamos el vector conservando su direccion: si pasa del tope, lo
      // reescalamos a longitud `max`. Como solo entramos cuando dist > max,
      // dist nunca es 0 y no hay division por cero.
      if (max !== undefined) {
        const dist = Math.hypot(dx, dy)
        if (dist > max) {
          dx = (dx / dist) * max
          dy = (dy / dist) * max
        }
      }

      xRaw.set(dx)
      yRaw.set(dy)
    }
    const onLeave = () => {
      xRaw.set(0)
      yRaw.set(0)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [factor, max, reduced, xRaw, yRaw])

  return { ref, x, y }
}
