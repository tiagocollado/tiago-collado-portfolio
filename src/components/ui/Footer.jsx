import { useState } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/*
 * Footer: una sola barra de tres zonas, copyright · back-to-top · crédito.
 *
 * En la home se lee junto con Contact como un único cierre de página:
 * Contact no cierra su padding inferior y este bloque arranca pegado, sin
 * una línea entre medio.
 *
 * ⚠️ role="contentinfo" es obligatorio, no redundante. Un <footer> es
 * landmark "contentinfo" solo si NO está adentro de article, aside, main,
 * nav o section, y el layout envuelve todo en <main>. Un role explícito le
 * gana siempre al implícito. Si se saca, el landmark desaparece sin que lo
 * avise ningún build ni linter.
 *
 * ⚠️ El back-to-top es un <a href="#top">, no un window.scrollTo: Lenis
 * intercepta el ancla y hace el scroll suave él mismo (un scrollTo por JS
 * pelearía contra su animación). Con movimiento reducido no hay Lenis y
 * el ancla salta sola, sin animación. Toda página que use este footer
 * necesita un id="top"; si falta, el botón no hace nada y no hay error.
 *
 * `texts` trae el crédito y el aria-label del back-to-top, ya traducidos.
 */

const EASE = [0.16, 1, 0.3, 1];

/*
 * staggerChildren solo llega a hijos motion DIRECTOS, y acá hay un div de
 * layout en el medio. Por eso cada hijo calcula su propio delay.
 */
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
        // El pt grande separa de los canales de Contact: la separación la da
        // el espacio, no una línea arriba.
        className="pt-16 md:pt-20 pb-10 md:pb-12 px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {/* Dos layouts.

            Mobile: grilla de 2 columnas. Copyright y crédito apilados a la
            izquierda; back-to-top a la derecha, ocupando las dos filas
            (row-span-2) y centrado contra ellas. La mitad derecha es la que
            el pulgar alcanza con menos esfuerzo (Fitts). Las posiciones van
            explícitas (col-start / row-start) porque el orden del DOM es
            copyright → botón → crédito, y la ubicación automática pondría
            el crédito arriba a la derecha.

            sm+: grilla de 3 columnas, con el back-to-top centrado respecto
            del ancho total. Cada hijo resetea su posición con sm:*-auto. */}
        <div
          className="max-w-7xl mx-auto grid grid-cols-[1fr_auto] gap-x-6 gap-y-3 sm:grid-cols-3 sm:gap-6 items-center pt-8 border-t"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <motion.p
            variants={fadeUp(0)}
            className="col-start-1 row-start-1 sm:col-start-auto sm:row-start-auto text-[11px] font-mono uppercase tracking-[0.18em]"
            style={{ color: 'var(--ink-muted)' }}
          >
            © 2026 Copyright Gotya
          </motion.p>

          {/* Back-to-top: dos flechas apiladas que suben en loop mientras hay
              hover. Es la técnica del MarqueeLink: el track tiene 4 flechas
              iguales y la ventana muestra 2 (h-7 = 2 × 14px). Mover `y` de 0%
              a -25% sube exactamente una flecha, así que al reiniciar el
              ciclo la imagen es idéntica y el salto no se ve. */}
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
