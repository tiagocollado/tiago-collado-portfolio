import { useState } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/*
 * role="contentinfo" no es redundante: dentro de <main>, un <footer> pierde
 * el landmark. El back-to-top es un ancla y no window.scrollTo, para que
 * Lenis haga el scroll; la página necesita id="top" o el botón no hace nada.
 */

const EASE = [0.16, 1, 0.3, 1];

// staggerChildren solo llega a hijos motion directos: cada hijo calcula su delay.
const fadeUp = (delay) => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay },
  },
});

export default function Footer({ texts }) {
  const [backToTopHovered, setBackToTopHovered] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <motion.footer
        role="contentinfo"
        className="pt-16 md:pt-20 pb-10 md:pb-12 px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {/* En mobile, posiciones explícitas: el orden del DOM es copyright →
            botón → crédito y la ubicación automática pondría el crédito
            arriba a la derecha. */}
        <div
          className="max-w-7xl mx-auto grid grid-cols-[1fr_auto] gap-x-6 gap-y-3 sm:grid-cols-3 sm:gap-6 items-center pt-8 border-t"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <motion.p
            variants={fadeUp(0)}
            className="col-start-1 row-start-1 sm:col-start-auto sm:row-start-auto text-[11px] font-mono uppercase tracking-[0.18em]"
            style={{ color: 'var(--ink-muted)' }}
          >
            {texts.copyright}
          </motion.p>

          {/* Cuatro flechas en una ventana de dos: subir 25% es subir una
              flecha exacta, así el loop reinicia sin salto. */}
          <motion.div
            variants={fadeUp(0.1)}
            className="col-start-2 row-start-1 row-span-2 sm:col-start-auto sm:row-start-auto sm:row-span-1 flex items-center justify-end sm:justify-center"
          >
            <a
              href="#top"
              data-cursor="link"
              aria-label={texts.backToTop}
              onMouseEnter={() => setBackToTopHovered(true)}
              onMouseLeave={() => setBackToTopHovered(false)}
              className="group inline-flex items-center justify-center w-12 h-12 rounded-full border transition-colors duration-300 border-(--border-strong) text-(--ink-secondary) hover:border-accent hover:text-accent"
            >
              <span aria-hidden="true" className="relative h-7 w-3.5 overflow-hidden">
                <motion.span
                  className="absolute inset-x-0 top-0 flex flex-col"
                  animate={backToTopHovered ? { y: ['0%', '-25%'] } : { y: '0%' }}
                  transition={
                    backToTopHovered
                      ? { duration: 0.7, ease: 'linear', repeat: Infinity }
                      : { duration: 0.3, ease: EASE }
                  }
                >
                  <ArrowUp className="w-3.5 h-3.5 shrink-0" />
                  <ArrowUp className="w-3.5 h-3.5 shrink-0" />
                  <ArrowUp className="w-3.5 h-3.5 shrink-0" />
                  <ArrowUp className="w-3.5 h-3.5 shrink-0" />
                </motion.span>
              </span>
            </a>
          </motion.div>

          <motion.p
            variants={fadeUp(0.2)}
            className="col-start-1 row-start-2 sm:col-start-auto sm:row-start-auto text-[11px] font-mono uppercase tracking-[0.18em] sm:text-right"
            style={{ color: 'var(--ink-muted)' }}
          >
            {texts.credit}
          </motion.p>
        </div>
      </motion.footer>
    </MotionConfig>
  );
}
