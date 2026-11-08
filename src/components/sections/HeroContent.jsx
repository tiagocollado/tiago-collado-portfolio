import { useState } from 'react';
import { MotionConfig, motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import MagneticLink from '../ui/MagneticLink.jsx';
import NameLogo from '../ui/NameLogo.jsx';
import SplitText from '../ui/SplitText.jsx';

/*
 * Lo que se mueve en el Hero: el wordmark gigante, el lema y el CTA.
 *
 * La <section> y la grilla de puntos viven en Hero.astro; esta isla dibuja
 * los dos bloques que van adentro de la sección. Son dos hermanos (sin un
 * div que los envuelva) porque son hijos directos del flex de la sección:
 * el segundo usa flex-1 para estirarse. El envoltorio <astro-island> es
 * display: contents, así que no se mete en el medio del layout.
 *
 * `texts` trae el lema, el CTA y el aria-label del wordmark, ya traducidos.
 */
export default function HeroContent({ texts, homeHref }) {
  // Parallax: el contenido sube un poco al scrollear (sin desvanecerse). El
  // blur del navbar lo funde cuando pasa por detrás.
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, -80]);

  // Hover del CTA: las chevrons bajan más rápido y el texto se abre.
  const [ctaHovered, setCtaHovered] = useState(false);
  const chevronDelayStep = ctaHovered ? 0.08 : 0.15;

  return (
    <MotionConfig reducedMotion="user">
      {/* Wordmark gigante: primer bloque, sticky, se achica con el scroll.
          El z-10 lo deja encima de la grilla de puntos. */}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <NameLogo href={homeHref} label={texts.homeLink} />
      </div>

      {/* flex-1 estira este bloque en todo el alto que queda en la sección:
          así la grilla de adentro tiene lugar para centrar el lema y el CTA. */}
      <motion.div className="max-w-7xl mx-auto w-full relative z-10 flex-1 flex" style={{ y }}>
        {/* Dos columnas desde md: lema a la izquierda, CTA a la derecha. En
            mobile, una sola. Cada hijo anima por su cuenta. */}
        <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12">
          {/* El lema entra letra por letra después del wordmark (delay 0.6s),
              y la segunda línea encadenada tras la primera (1.0s). */}
          <div className="space-y-2 max-w-2xl self-center">
            <SplitText
              as="h1"
              text={texts.headline}
              stagger={0.02}
              delay={0.6}
              yFrom={16}
              blurFrom={4}
              duration={0.6}
              className="font-display text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight leading-[1.2] block"
            />
            <SplitText
              as="p"
              text={texts.subheadline}
              stagger={0.02}
              delay={1.0}
              yFrom={16}
              blurFrom={4}
              duration={0.6}
              className="font-display text-xl md:text-2xl lg:text-3xl font-medium tracking-tight leading-[1.2] block"
              charClassName="text-(--ink-secondary)"
            />
          </div>

          {/* CTA: texto en mono + cinco chevrons que bajan en cascada. Es un
              link magnético con factor sutil (0.2), y el cursor pasa a "link". */}
          <MagneticLink
            href="#projects"
            factor={0.2}
            cursorVariant="link"
            aria-label={texts.ctaProjects}
            className="group flex flex-col items-center gap-4 self-center no-underline"
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
          >
            <span
              className="text-base md:text-lg font-mono font-semibold uppercase transition-all duration-300 text-(--ink-primary) group-hover:text-accent"
              // El letter-spacing cambia con el estado de hover de React, no
              // con una variante hover: de Tailwind, así que puede ir inline.
              // El color sí va como utility: si fuera inline, le ganaría al
              // group-hover y el cambio de color no se vería nunca.
              style={{ letterSpacing: ctaHovered ? '0.3em' : '0.25em' }}
            >
              {texts.ctaProjects}
            </span>
            {/* En hover, el delay entre chevrons baja de 0.15 a 0.08s: la
                cascada se acelera. */}
            <div className="relative flex flex-col items-center">
              {[0, 1, 2, 3, 4].map((index) => (
                <motion.span
                  key={index}
                  className="block transition-transform duration-300 group-hover:translate-y-1"
                  style={{ color: 'var(--color-accent)', marginTop: index === 0 ? 0 : -10 }}
                  animate={{ opacity: [0, 1, 0], y: [0, 10] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                    delay: index * chevronDelayStep,
                  }}
                >
                  <ChevronDown size={36} strokeWidth={2.5} />
                </motion.span>
              ))}
            </div>
          </MagneticLink>
        </div>
      </motion.div>
    </MotionConfig>
  );
}
