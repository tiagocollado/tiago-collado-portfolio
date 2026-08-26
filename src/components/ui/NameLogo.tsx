'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import SplitText from './SplitText'

/**
 * NameLogo — el wordmark "GOTYA" como protagonista visual del Hero.
 *
 * Vive dentro de <Hero /> (no en el Navbar). Es el primer bloque visual:
 * gigante, en flujo, sticky al top mientras se scrollea.
 *
 * Comportamiento (solo en home):
 *  - Mount: SplitText char reveal con blur-in (0.8s expo-out, stagger 0.04).
 *  - Sticky `top-2`: se queda anclado al top del viewport mientras scroll
 *    avanza dentro del Hero.
 *  - Scale shrink 1 → 0.065 entre scrollY 0–500: visualmente "se transforma"
 *    en el logo del navbar (que está en la misma columna izquierda).
 *  - Cross-fade out a partir de scrollY ~ 405 (cuando scale ~ 0.1): NavLogo
 *    del navbar ya está full opacity, NameLogo se desvanece.
 *
 * En case studies (no-home): no se renderea — el branding queda solo en
 * <NavLogo /> dentro del navbar.
 *
 * a11y: el `<a>` apunta al home con aria-label fijo. SplitText mantiene el
 * texto plano vía sr-only para screen readers.
 */

// 220px (tope del clamp) × 0.065 ≈ 14px, que es el font-size del NavLogo
// en mono. Así el final del shrink cae visualmente sobre el logo del navbar.
const SCALE_LOGO = 0.065

export default function NameLogo() {
  const locale = useLocale()
  const pathname = usePathname()
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`

  // Hooks deben llamarse antes del return condicional (regla de React).
  const { scrollY } = useScroll()
  const scale = useTransform(scrollY, [0, 500], [1, SCALE_LOGO])
  const opacity = useTransform(scrollY, [0, 405, 500], [1, 1, 0])

  if (!isHome) return null

  return (
    <motion.a
      href={`/${locale}`}
      aria-label="Gotya — volver al inicio"
      className="sticky top-2 self-start no-underline whitespace-nowrap"
      style={{
        scale,
        opacity,
        transformOrigin: 'top left',
        color: 'var(--ink-primary)',
      }}
    >
      <span
        className="block font-display font-semibold leading-[0.9]"
        style={{
          // "Gotya" son 5 caracteres contra los 13 de "Tiago Collado", así que
          // el clamp sube bastante: el wordmark puede ser mucho más grande sin
          // desbordar en mobile.
          fontSize: 'clamp(72px, 18vw, 220px)',
          letterSpacing: '-0.04em',
        }}
      >
        <SplitText
          text="GOTYA"
          as="span"
          stagger={0.04}
          yFrom={40}
          blurFrom={8}
          duration={0.8}
          className="block"
        />
      </span>

    </motion.a>
  )
}
