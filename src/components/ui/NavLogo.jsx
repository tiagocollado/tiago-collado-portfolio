import { motion, useScroll, useTransform } from 'framer-motion';

/*
 * Wordmark "GOTYA" chico del navbar.
 *
 * En la home aparece con el scroll (opacidad 0 → 1 entre 200 y 400px) y
 * releva al wordmark gigante del Hero, que se achica y se desvanece entre 405
 * y 500px. Las dos piezas viven en islas distintas y no se comunican: cada
 * una lee el scroll de la ventana por su cuenta, y lo que las coordina son
 * esos rangos. En los casos de estudio no hay wordmark gigante, así que
 * siempre se ve.
 */
export default function NavLogo({ href, isHome, label }) {
  const { scrollY } = useScroll();
  const opacityOnHome = useTransform(scrollY, [200, 400], [0, 1]);

  return (
    <motion.a
      href={href}
      aria-label={label}
      className="font-mono text-sm font-medium no-underline whitespace-nowrap transition-colors duration-300 text-(--ink-primary) hover:text-(--color-accent)"
      style={{ opacity: isHome ? opacityOnHome : 1 }}
    >
      GOTYA
    </motion.a>
  );
}
