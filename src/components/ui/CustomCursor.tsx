'use client'

import { useEffect, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import {
  CursorContext,
  type CursorVariant,
} from '@/hooks/useCursor'

/**
 * Provider + render del cursor custom.
 * - Solo se renderea en desktop (pointer: fine), oculto en touch.
 * - Dot 6px sigue al cursor con lerp via spring.
 * - Ring 32px con stiffness más bajo para lag visible.
 * - Variants:
 *   - default: dot + ring
 *   - link: ring crece a 64px
 *   - view: ring se transforma en pill "VIEW"
 *   - drag: dot sólido grande, ring desaparece
 * - prefers-reduced-motion: cursor nativo (no renderea).
 */
export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>('default')
  const [hasFinePointer, setHasFinePointer] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setHasFinePointer(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setHasFinePointer(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const showCursor = hasFinePointer && !reduced

  return (
    <CursorContext.Provider value={{ variant, setVariant }}>
      {children}
      {showCursor && <CursorRender variant={variant} />}
    </CursorContext.Provider>
  )
}

function CursorRender({ variant }: { variant: CursorVariant }) {
  const dotX = useMotionValue(0)
  const dotY = useMotionValue(0)
  const ringX = useMotionValue(0)
  const ringY = useMotionValue(0)

  const dotSpringX = useSpring(dotX, { stiffness: 800, damping: 35, mass: 0.3 })
  const dotSpringY = useSpring(dotY, { stiffness: 800, damping: 35, mass: 0.3 })
  const ringSpringX = useSpring(ringX, { stiffness: 200, damping: 25, mass: 0.5 })
  const ringSpringY = useSpring(ringY, { stiffness: 200, damping: 25, mass: 0.5 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      ringX.set(e.clientX)
      ringY.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove)
    // hide cursor when leaving viewport
    const onLeave = () => {
      document.body.style.cursor = ''
    }
    window.addEventListener('mouseout', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [dotX, dotY, ringX, ringY])

  const ringSize = variant === 'link' ? 64 : variant === 'view' ? 80 : 32
  const ringOpacity = variant === 'drag' ? 0 : 1
  const dotSize = variant === 'drag' ? 14 : 6

  return (
    <>
      {/* Dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-[var(--color-accent)] mix-blend-difference"
        style={{
          x: dotSpringX,
          y: dotSpringY,
          translateX: '-50%',
          translateY: '-50%',
          width: dotSize,
          height: dotSize,
        }}
        animate={{ width: dotSize, height: dotSize }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-[var(--ink-primary)] mix-blend-difference flex items-center justify-center"
        style={{
          x: ringSpringX,
          y: ringSpringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: ringOpacity,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {variant === 'view' && (
          <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--ink-primary)]">
            View
          </span>
        )}
      </motion.div>
    </>
  )
}
