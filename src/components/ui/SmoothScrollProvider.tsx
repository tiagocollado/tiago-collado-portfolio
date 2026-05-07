'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Wrapper alrededor de toda la app que monta una instancia global de Lenis
 * para smooth scroll. Respeta prefers-reduced-motion: si está activo, no
 * inicializa Lenis y deja el scroll nativo.
 *
 * El handoff con Framer Motion `useScroll` funciona out-of-the-box porque
 * Lenis no reemplaza el scroll del documento — solo lo "lerpea". El
 * scrollY que Framer lee sigue siendo el scroll real del viewport.
 *
 * Anchor links (`#id`): Lenis los respeta automáticamente cuando se setea
 * `anchors: true`. El click en `<a href="#contact">` hace scroll smooth.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const lenis = new Lenis({
      // ~ default smooth values; ajustables a futuro si se siente lento.
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Soporte nativo de anchor links (interceptados por Lenis).
      anchors: true,
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
