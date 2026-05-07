'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'

/**
 * Logo del navbar — texto "Tiago Collado" font-mono 14px en la izquierda.
 *
 * - En home: opacity scroll-driven 0 → 1 entre scrollY 200 y 400.
 *   Hace cross-fade con <NameLogo /> que vive en el Hero (gigante shrink-on-scroll).
 *   Cuando NameLogo achica y se desvanece, NavLogo lo reemplaza visualmente.
 * - En case studies: siempre visible (no hay NameLogo en esas rutas).
 *
 * Click vuelve al home en el locale actual.
 */
export default function NavLogo() {
  const locale = useLocale()
  const pathname = usePathname()
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`

  const { scrollY } = useScroll()
  const opacityHome = useTransform(scrollY, [200, 400], [0, 1])

  return (
    <motion.a
      href={`/${locale}`}
      aria-label="Tiago Collado — volver al inicio"
      className="font-mono text-sm font-medium no-underline whitespace-nowrap transition-colors duration-300 hover:text-(--color-accent)"
      style={{
        color: 'var(--ink-primary)',
        opacity: isHome ? opacityHome : 1,
        // En home, sin scroll, el logo está oculto pero su área de click se
        // mantiene; lo desactivamos hasta que esté visible.
        pointerEvents: isHome ? undefined : 'auto',
      }}
    >
      Tiago Collado
    </motion.a>
  )
}
