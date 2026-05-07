'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import SplitText from './SplitText'

/**
 * NameLogo — el nombre "Tiago Collado" como protagonista visual del Hero.
 *
 * Vive AHORA dentro de <Hero /> (no en el Navbar). Es el primer bloque visual:
 * gigante, en flujo, sticky al top mientras se scrollea.
 *
 * Comportamiento (solo en home):
 *  - Mount: SplitText char reveal con blur-in (0.8s expo-out, stagger 0.04).
 *  - Sticky `top-2`: se queda anclado al top del viewport mientras scroll
 *    avanza dentro del Hero.
 *  - Scale shrink 1 → 0.13 entre scrollY 0–500: visualmente "se transforma"
 *    en el logo del navbar (que está en la misma columna izquierda).
 *  - Cross-fade out a partir de scrollY ~ 405 (cuando scale ~ 0.2): NavLogo
 *    del navbar ya está full opacity, NameLogo se desvanece.
 *
 * En case studies (no-home): no se renderea — el branding queda solo en
 * <NavLogo /> dentro del navbar.
 *
 * a11y: el `<a>` apunta al home con aria-label fijo. SplitText mantiene el
 * texto plano vía sr-only para screen readers.
 */

const SCALE_LOGO = 0.13

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
      aria-label="Tiago Collado — volver al inicio"
      className="sticky top-2 self-start font-display font-semibold no-underline whitespace-nowrap leading-[0.9]"
      style={{
        scale,
        opacity,
        transformOrigin: 'top left',
        color: 'var(--ink-primary)',
        // 144px ≈ navbar logo a scale 0.13 (~18.7px), suficiente para que
        // se sienta proporcional con el font-mono 14px del NavLogo.
        fontSize: 'clamp(56px, 13vw, 144px)',
        letterSpacing: '-0.04em',
      }}
    >
      <SplitText
        text="Tiago Collado"
        as="span"
        stagger={0.04}
        yFrom={40}
        blurFrom={8}
        duration={0.8}
        className="block"
      />
    </motion.a>
  )
}
