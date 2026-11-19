import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/*
 * En hover se corre hacia el cursor una fracción (`factor`) de la distancia
 * al centro. `max` topea el desplazamiento: sin tope, un bloque ancho se
 * movería muchísimo más que un pill chico.
 */
export default function MagneticLink({ factor = 0.3, max, cursorVariant = 'link', style, children, ...rest }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
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

      // Se achica a `max` sin cambiar la dirección. Solo entra si la distancia
      // es mayor que max: nunca divide por cero.
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
