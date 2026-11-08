import { motion, useScroll, useTransform } from 'framer-motion';
import SplitText from './SplitText.jsx';

/*
 * El wordmark "GOTYA" gigante del Hero. Solo existe en la home.
 *
 * - Al cargar, entra letra por letra con desenfoque (SplitText).
 * - Es sticky (top-2): se queda arriba mientras se scrollea el Hero.
 * - Se achica de 1 a 0.065 entre 0 y 500px de scroll, hacia la esquina
 *   superior izquierda, donde está el NavLogo del navbar.
 * - Se desvanece entre 405 y 500px. Para entonces el NavLogo, que aparece
 *   entre 200 y 400px, ya está entero: se lee como si el wordmark se
 *   convirtiera en el logo del navbar.
 *
 * NameLogo y NavLogo están en islas distintas y no se comunican. Cada uno
 * lee el scroll de la ventana por su cuenta; lo que los coordina son esos
 * rangos.
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
