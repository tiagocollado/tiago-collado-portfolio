import { motion, useScroll, useTransform } from 'framer-motion';
import SplitText from './SplitText.jsx';

/*
 * Wordmark gigante del hero: se achica hacia el logo del navbar y se
 * desvanece entre 405 y 500px, cuando el NavLogo (200–400px) ya está entero.
 * Están en islas distintas: los coordinan esos rangos de scroll.
 */

// 220px (el tope del clamp del font-size) × 0.065 ≈ 14px, el tamaño del
// NavLogo: el final del achique cae sobre el logo del navbar.
const SCALE_AT_NAVBAR = 0.065;

export default function NameLogo({ href, label }) {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 500], [1, SCALE_AT_NAVBAR]);
  const opacity = useTransform(scrollY, [0, 405, 500], [1, 1, 0]);

  return (
    <motion.a
      href={href}
      aria-label={label}
      className="sticky top-2 self-start no-underline whitespace-nowrap"
      style={{
        scale,
        opacity,
        transformOrigin: 'top left',
        color: 'var(--ink-primary)',
      }}
    >
      <span
        className="block font-display font-semibold leading-[0.9]"
        style={{
          // "Gotya" tiene 5 letras: el clamp puede subir mucho sin que el
          // wordmark se salga de la pantalla en mobile.
          fontSize: 'clamp(72px, 18vw, 220px)',
          letterSpacing: '-0.04em',
        }}
      >
        <SplitText text="GOTYA" as="span" stagger={0.04} yFrom={40} blurFrom={8} duration={0.8} className="block" />
      </span>
    </motion.a>
  );
}
