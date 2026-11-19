import { useState } from 'react';
import { MotionConfig, motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import MagneticLink from '../ui/MagneticLink.jsx';
import NameLogo from '../ui/NameLogo.jsx';
import SplitText from '../ui/SplitText.jsx';

// Dos bloques hermanos, sin envoltorio: son hijos directos del flex de la
// <section> (el <astro-island> es display: contents).
export default function HeroContent({ texts, homeHref }) {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 400], [0, -80]);

  const [ctaHovered, setCtaHovered] = useState(false);
  const chevronDelayStep = ctaHovered ? 0.08 : 0.15;

  return (
    <MotionConfig reducedMotion="user">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <NameLogo href={homeHref} label={texts.homeLink} />
      </div>

      <motion.div className="max-w-7xl mx-auto w-full relative z-10 flex-1 flex" style={{ y: parallaxY }}>
        <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12">
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
              // El color va como utility: inline le ganaría al group-hover.
              style={{ letterSpacing: ctaHovered ? '0.3em' : '0.25em' }}
            >
              {texts.ctaProjects}
            </span>
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
