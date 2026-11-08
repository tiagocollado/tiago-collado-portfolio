import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/*
 * Link "magnético": en hover se corre un poco hacia el cursor, como si lo
 * atrajera, y vuelve a su lugar al salir. Con movimiento reducido no se mueve.
 *
 * - `factor`: qué fracción de la distancia al centro se desplaza (0.3 = 30%).
 * - `max`: tope del desplazamiento en px. Sin tope, el efecto crece con el
 *   tamaño del elemento: un pill chico se mueve poco y un bloque ancho
 *   muchísimo. Con `max` se siente igual de sutil en cualquiera.
 * - `cursorVariant`: la variante del cursor custom en hover. Se declara como
 *   atributo data-cursor, que el cursor lee por su cuenta (CustomCursor.jsx).
 *
 * El resto de las props (href, className, aria-label, handlers…) pasan
 * directo al <a>.
 */
export default function MagneticLink({ factor = 0.3, max, cursorVariant = 'link', style, children, ...rest }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  // El resorte suaviza el desplazamiento: el link no salta, se desliza.
  const x = useSpring(rawX, { stiffness: 150, damping: 15 });
  const y = useSpring(rawY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const link = ref.current;
    if (!link || prefersReducedMotion) return;

    const onMove = (event) => {
      const rect = link.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      let dx = (event.clientX - centerX) * factor;
      let dy = (event.clientY - centerY) * factor;

      // Si el desplazamiento pasa el tope, se achica a `max` sin cambiar su
      // dirección. Solo entra cuando la distancia es mayor que max, así que
      // nunca divide por cero.
      if (max !== undefined) {
        const distance = Math.hypot(dx, dy);
        if (distance > max) {
          dx = (dx / distance) * max;
          dy = (dy / distance) * max;
        }
      }

      rawX.set(dx);
      rawY.set(dy);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    link.addEventListener('mousemove', onMove);
    link.addEventListener('mouseleave', onLeave);
    return () => {
      link.removeEventListener('mousemove', onMove);
      link.removeEventListener('mouseleave', onLeave);
    };
  }, [factor, max, prefersReducedMotion, rawX, rawY]);

  return (
    <motion.a ref={ref} data-cursor={cursorVariant} style={{ x, y, ...style }} {...rest}>
      {children}
    </motion.a>
  );
}
