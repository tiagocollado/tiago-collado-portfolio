'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import InteractiveDotGrid from '@/components/ui/InteractiveDotGrid'
import NameLogo from '@/components/ui/NameLogo'
import SplitText from '@/components/ui/SplitText'
import MagneticLink from '@/components/ui/MagneticLink'

export default function Hero() {
  const t = useTranslations('hero')

  // Parallax — el contenido del Hero se mueve un poco hacia arriba al
  // scrollear (sin fade-out): el blur del navbar funde el headline cuando
  // pasa detrás del nombre achicándose.
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 400], [0, -80])

  // Hover del CTA: dispara aceleración del stagger de las chevrons + apertura
  // del letter-spacing del texto.
  const [ctaHovered, setCtaHovered] = useState(false)
  const chevronDelayStep = ctaHovered ? 0.08 : 0.15

  return (
    <section
      // `flex flex-col` para que el wrapper interno pueda usar `flex-1` y
      // estirarse verticalmente — necesario para que el grid 2-col tenga
      // suficiente alto y `self-center` funcione en la columna del CTA.
      // `-mt-16 pt-40` extiende el section hacia arriba para que el dotgrid
      // cubra desde el top del viewport (debajo del navbar transparente).
      className="min-h-screen flex flex-col px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pb-8 md:pb-10 lg:pb-12 relative overflow-hidden -mt-16 pt-40 md:pt-48 lg:pt-56"
    >

      {/* Fondo interactivo: canvas con repulsión del cursor, CSS estático en touch.
          colorVar `--ink-secondary` (en lugar del default `--ink-muted`) para
          tener más contraste en light mode — sobre fondo beige cálido los
          tonos muted se mimetizaban demasiado. */}
      <InteractiveDotGrid opacity={0.7} colorVar="--ink-secondary" />

      {/* NameLogo gigante — primer bloque en flujo, sticky al top, shrink-on-scroll.
          Su z-10 lo mantiene encima del dotgrid. Hace cross-fade con el NavLogo
          del navbar cuando el usuario scrollea (ver NameLogo.tsx). */}
      <div className="relative z-10">
        <NameLogo />
      </div>

      {/* Wrapper de parallax — `flex-1` para que estire todo el espacio
          vertical disponible del section (después del padding). Eso permite
          que el grid interno tenga altura suficiente para que `self-center`
          y `self-end` se separen visualmente. */}
      <motion.div
        className="max-w-6xl w-full relative z-10 flex-1 flex"
        style={{ y }}
      >
        <div
          // Grid 2 columnas: headlines izq (bottom) + CTA der (centro vertical).
          // En mobile colapsa a una sola columna.
          // Sin animación de mount en el wrapper — los hijos animan
          // individualmente (NameLogo + SplitText + CTA).
          className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12"
        >
          {/* Headlines (claim del portfolio) — char reveal con SplitText.
              Delay 0.6s para arrancar después del NameLogo. Subheadline con
              delay extra para que entre encadenado tras el headline. */}
          <div className="space-y-2 max-w-2xl self-center">
            <SplitText
              as="h1"
              text={t('headline')}
              stagger={0.02}
              delay={0.6}
              yFrom={16}
              blurFrom={4}
              duration={0.6}
              className="font-display text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] text-balance block"
            />
            <SplitText
              as="p"
              text={t('subheadline')}
              stagger={0.02}
              delay={1.0}
              yFrom={16}
              blurFrom={4}
              duration={0.6}
              className="font-display text-xl md:text-2xl lg:text-3xl font-medium tracking-tight leading-[1.15] block"
              charClassName="text-(--ink-secondary)"
            />
          </div>

          {/* CTA "Ver proyectos" — Awwwards minimal: texto en mono uppercase
              + 5 chevrons animados en cascada hacia abajo. Wrappeado en
              <MagneticLink> con factor sutil (0.2): el bloque entero "tira"
              del cursor en hover, sumando hint kinestésico. El cursor custom
              cambia a variant `link` (ring grande). */}
          <MagneticLink
            href="#projects"
            factor={0.2}
            cursorVariant="link"
            aria-label={t('cta_projects')}
            className="group flex flex-col items-center gap-4 self-center no-underline"
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
          >
            <span
              // Letter-spacing crece de 0.25em → 0.3em en hover (300ms).
              // transition-all es más fácil que un transition-[letter-spacing]
              // arbitrario; las únicas otras props animadas son color (que ya
              // tiene 300ms igual).
              className="text-base md:text-lg font-mono font-semibold uppercase transition-all duration-300 group-hover:text-accent"
              style={{
                color: 'var(--ink-primary)',
                letterSpacing: ctaHovered ? '0.3em' : '0.25em',
              }}
            >
              {t('cta_projects')}
            </span>
            {/* Chevrons en cascada — al hacer hover, el delay incremental
                baja de 0.15 → 0.08, "acelerando" el flujo hacia abajo. */}
            <div className="relative flex flex-col items-center">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  className="block transition-transform duration-300 group-hover:translate-y-1"
                  style={{ color: 'var(--color-accent)', marginTop: i === 0 ? 0 : -10 }}
                  animate={{ opacity: [0, 1, 0], y: [0, 10] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                    delay: i * chevronDelayStep,
                  }}
                >
                  <ChevronDown size={36} strokeWidth={2.5} />
                </motion.span>
              ))}
            </div>
          </MagneticLink>

        </div>
      </motion.div>
    </section>
  )
}
