import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';

/*
 * Wordmark "GOTYA" chico del navbar.
 *
 * En la home aparece con el scroll (opacidad 0 → 1 entre 200 y 400px) y
 * releva al wordmark gigante del Hero, que se achica y se desvanece entre 405
 * y 500px. Las dos piezas viven en islas distintas y no se comunican: lo que
 * las coordina son esos rangos de scroll. En los casos de estudio no hay
 * wordmark gigante, así que siempre se ve.
 *
 * Mientras está invisible va con `inert`: no recibe foco ni clicks y los
 * lectores de pantalla no lo leen. Sin eso, Tab caía en un link que no se ve.
 */
export default function NavLogo({ href, isHome, label }) {
  const { scrollY } = useScroll();
  const opacityOnHome = useTransform(scrollY, [200, 400], [0, 1]);
  const [isVisible, setIsVisible] = useState(() => !isHome || opacityOnHome.get() > 0);

  useMotionValueEvent(opacityOnHome, 'change', (opacity) => {
    if (isHome) setIsVisible(opacity > 0);
  });

  return (
    <motion.a
      href={href}
      aria-label={label}
      inert={!isVisible}
      className="font-mono text-sm font-medium no-underline whitespace-nowrap transition-colors duration-300 text-(--ink-primary) hover:text-accent"
      style={{ opacity: isHome ? opacityOnHome : 1 }}
    >
      GOTYA
    </motion.a>
  );
}
