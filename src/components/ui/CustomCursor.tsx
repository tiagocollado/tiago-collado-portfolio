'use client'

import { useEffect, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  MotionConfig,
} from 'framer-motion'
import { usePathname } from 'next/navigation'
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
 *   - view: ring crece a 80px con texto "VIEW" adentro
 *   - drag: dot sólido grande, ring desaparece
 * - Reset on navigate: si el variant queda sticky cuando un componente que
 *   lo seteó se desmonta por route change (ej. ProjectCard al click), el
 *   cursor se quedaba en `view` para siempre. El effect que escucha
 *   pathname lo resetea a `default` en cada navegación.
 * - prefers-reduced-motion: cursor nativo (no renderea).
 */
export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>('default')
  const [hasFinePointer, setHasFinePointer] = useState(false)
  const reduced = useReducedMotion()
  const pathname = usePathname()

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setHasFinePointer(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setHasFinePointer(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Reset variant en cada cambio de ruta — evita el bug de "cursor sticky"
  // cuando hacés click en un link y el componente que seteó el variant
  // se desmonta antes de que dispare onMouseLeave.
  useEffect(() => {
    setVariant('default')
  }, [pathname])

  const showCursor = hasFinePointer && !reduced

  return (
    // MotionConfig reducedMotion="user" hace que TODAS las animaciones de
    // Framer Motion respeten prefers-reduced-motion del usuario. Sin esto,
    // Framer ignora la regla CSS @media (prefers-reduced-motion: reduce)
    // de globals.css porque sus animaciones son JS-driven (rAF), no CSS.
    // Con "user", reduced motion → animaciones instantáneas.
    <MotionConfig reducedMotion="user">
      <CursorContext.Provider value={{ variant, setVariant }}>
        {children}
        {showCursor && <CursorRender variant={variant} />}
      </CursorContext.Provider>
    </MotionConfig>
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
      {/* Dot — terracota sólido en ambos modos. Antes usábamos
          mix-blend-difference para invertir contra cualquier fondo, pero
          sobre el beige cálido del light mode (#EDE2CD) la difference con
          ink-primary daba un beige casi idéntico → invisible. Sólido es
          más predecible y se ve bien en ambos themes. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-9999 rounded-full bg-accent"
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

      {/* Ring — borde + fondo translúcido cálido del tema. El bg
          semi-transparente (color-mix con bg-primary 50%) suma un panel
          sutil detrás del texto "VIEW" para que se lea bien sin tener
          que ser opaco. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-9999 rounded-full border border-(--ink-primary) flex items-center justify-center"
        style={{
          x: ringSpringX,
          y: ringSpringY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor:
            variant === 'view'
              ? 'color-mix(in srgb, var(--bg-primary) 80%, transparent)'
              : 'transparent',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: ringOpacity,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {variant === 'view' && (
          <span className="font-mono text-[10px] tracking-widest uppercase text-(--ink-primary) font-semibold">
            View
          </span>
        )}
      </motion.div>
    </>
  )
}
