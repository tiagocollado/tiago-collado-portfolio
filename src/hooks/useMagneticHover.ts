'use client'

import { useRef, useEffect } from 'react'
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

type Options = {
  factor?: number
  stiffness?: number
  damping?: number
}

export function useMagneticHover<T extends HTMLElement = HTMLElement>({
  factor = 0.3,
  stiffness = 150,
  damping = 15,
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
      xRaw.set((e.clientX - cx) * factor)
      yRaw.set((e.clientY - cy) * factor)
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
  }, [factor, reduced, xRaw, yRaw])

  return { ref, x, y }
}
