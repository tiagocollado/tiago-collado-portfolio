import { useEffect, useRef, useState } from 'react';
import { motion, animate, useMotionValue, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

/*
 * Marquee: dos copias iguales en una caja del ancho de una, y `x` va de
 * -anchoDeCopia a 0 en loop, así el salto de vuelta no se ve. En hover frena
 * contra la dirección del loop.
 */
export default function MarqueeLink({ href, label, durationSec = 3 }) {
  const [hovered, setHovered] = useState(false);
  const [copyWidth, setCopyWidth] = useState(0);
  const copyRef = useRef(null);
  const x = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  // ResizeObserver y no una sola medida: en pantallas chicas el link está
  // oculto (mide 0), y la fuente puede cargar después.
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
      const controls = animate(x, -copyWidth, { duration: 0.4, ease: [0.16, 1, 0.3, 1] });
      return () => controls.stop();
    }

    // Termina el tramo hasta 0 a la velocidad del loop y sigue loopeando.
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
