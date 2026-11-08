import { useEffect, useRef, useState } from 'react';
import { motion, animate, useMotionValue, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

/*
 * Link cuyo contenido (texto + dos flechas ↗) cruza su caja en loop continuo,
 * sin huecos: cuando una flecha sale por la izquierda, la copia siguiente ya
 * entró por la derecha.
 *
 * La técnica clásica de marquee:
 * - El track tiene dos copias idénticas una al lado de la otra.
 * - La caja mide exactamente lo que mide UNA copia (se mide en el navegador).
 * - `x` va de -anchoDeCopia a 0 y vuelve a empezar. Como las copias son
 *   iguales, el salto de vuelta no se ve.
 *
 * En hover el track frena hacia la IZQUIERDA, contra la dirección del loop:
 * se lee como "este link me está esperando". Al salir, retoma el loop desde
 * donde quedó. Con movimiento reducido queda quieto.
 *
 * Accesibilidad: el texto se anuncia por el aria-label del link; el track es
 * decorativo (aria-hidden).
 */
export default function MarqueeLink({ href, label, durationSec = 3 }) {
  const [hovered, setHovered] = useState(false);
  const [copyWidth, setCopyWidth] = useState(0);
  const copyRef = useRef(null);
  const x = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  // Mientras copyWidth es 0 se dibuja una sola copia, para medirla limpia;
  // con la medida, aparece la segunda. Se mide con ResizeObserver y no una
  // sola vez: en pantallas chicas el link está oculto (mide 0) y la medida
  // tiene que llegar cuando la ventana se agranda o cuando carga la fuente.
  useEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;
    const observer = new ResizeObserver(() => {
      const width = copy.offsetWidth;
      if (width > 0) setCopyWidth(width);
    });
    observer.observe(copy);
    return () => observer.disconnect();
  }, [label]);

  useEffect(() => {
    if (copyWidth === 0) return;

    if (prefersReducedMotion) {
      x.set(0);
      return;
    }

    if (hovered) {
      // Frena en -copyWidth: el texto queda pegado al borde izquierdo con las
      // flechas a la derecha, que es como se ve también en x = 0.
      const controls = animate(x, -copyWidth, { duration: 0.4, ease: [0.16, 1, 0.3, 1] });
      return () => controls.stop();
    }

    // Sin hover: termina el tramo que falta hasta 0 a la misma velocidad del
    // loop, y desde ahí loopea de -copyWidth a 0 para siempre.
    let active = true;
    let loopControls;

    const remainingRange = 0 - x.get();
    const initialDuration = remainingRange > 0 ? (remainingRange / copyWidth) * durationSec : 0;

    const initial = animate(x, 0, {
      duration: Math.max(initialDuration, 0),
      ease: 'linear',
      onComplete: () => {
        if (!active) return;
        x.set(-copyWidth);
        loopControls = animate(x, 0, {
          duration: durationSec,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        });
      },
    });

    return () => {
      active = false;
      initial.stop();
      loopControls?.stop();
    };
  }, [hovered, prefersReducedMotion, durationSec, copyWidth, x]);

  return (
    <a
      href={href}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex items-center overflow-hidden h-6 text-sm font-medium align-middle"
      style={{
        color: 'var(--ink-primary)',
        // Mientras mide, el ancho es el natural de la única copia. Después
        // queda fijo en una copia y el overflow esconde la segunda.
        width: copyWidth > 0 ? `${copyWidth}px` : 'auto',
      }}
    >
      <motion.div aria-hidden="true" className="inline-flex items-center whitespace-nowrap" style={{ x }}>
        <span ref={copyRef} className="inline-flex items-center gap-1 shrink-0">
          <span>{label}</span>
          <ArrowUpRight size={14} style={{ color: 'var(--color-accent)' }} />
          <ArrowUpRight size={14} style={{ color: 'var(--color-accent)' }} />
        </span>
        {copyWidth > 0 && (
          <span className="inline-flex items-center gap-1 shrink-0">
            <span>{label}</span>
            <ArrowUpRight size={14} style={{ color: 'var(--color-accent)' }} />
            <ArrowUpRight size={14} style={{ color: 'var(--color-accent)' }} />
          </span>
        )}
      </motion.div>
    </a>
  );
}
