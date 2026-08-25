'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'

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
 *
 * Scroll-to-top en navegación: Next.js debería hacerlo nativamente, pero
 * con Lenis activo el scroll persiste entre rutas (Lenis mantiene su
 * propio internal state). Forzamos `scrollTo(0, immediate)` en cada
 * pathname change.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

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
    lenisRef.current = lenis

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // En cada cambio de ruta forzamos scroll al top. `immediate: true` evita
  // la animación lerpeada (no querés ver el case study scroll-anim hasta el
  // top mientras la página recién entra). Fallback `window.scrollTo(0,0)`
  // por si Lenis está en reduced-motion (no instanciado).
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return <>{children}</>
}
