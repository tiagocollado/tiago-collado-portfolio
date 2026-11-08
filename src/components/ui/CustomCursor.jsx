import { useEffect, useState, useSyncExternalStore } from 'react';
import { MotionConfig, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/*
 * Cursor custom: un punto que sigue al mouse y un anillo que lo sigue con
 * retraso. No oculta el cursor nativo, así que no interfiere con el foco.
 *
 * Variantes:
 *   default  punto + anillo de 32px
 *   link     el anillo crece a 64px
 *   view     el anillo crece a 80px con "View" adentro
 *   drag     punto grande, sin anillo
 *
 * Cómo sabe qué variante mostrar. Cada isla de Astro es su propia app de
 * React y el contexto no cruza de una a otra, así que los componentes no
 * pueden "avisarle" al cursor. En vez de eso, cualquier elemento del HTML
 * (isla o .astro sin JavaScript) declara la variante con un atributo:
 *
 *   <a data-cursor="link">…</a>
 *
 * y el cursor escucha UN solo evento `mouseover` en todo el documento
 * (delegación de eventos). La variante sale del elemento que está bajo el
 * puntero en cada momento, así que nunca queda "pegada": no hay un
 * mouseleave que alguien se olvide de disparar.
 */
const VARIANTS = ['default', 'link', 'view', 'drag'];

/*
 * ¿Hay mouse? Se lee del media query `(pointer: fine)`. useSyncExternalStore
 * es el hook de React para leer algo del navegador que puede cambiar solo:
 * recibe cómo suscribirse y cómo leer el valor actual.
 */
const FINE_POINTER = '(pointer: fine)';
function subscribeFinePointer(onChange) {
  const mediaQuery = window.matchMedia(FINE_POINTER);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}
const readFinePointer = () => window.matchMedia(FINE_POINTER).matches;
// La isla es client:only, así que nunca se dibuja en el servidor. React
// igual pide este valor: sin mouse confirmado, no hay cursor.
const readFinePointerOnServer = () => false;

function variantUnderPointer(target) {
  const element = target instanceof Element ? target.closest('[data-cursor]') : null;
  const variant = element?.dataset.cursor;
  return VARIANTS.includes(variant) ? variant : 'default';
}

export default function CustomCursor() {
  const hasFinePointer = useSyncExternalStore(subscribeFinePointer, readFinePointer, readFinePointerOnServer);
  const prefersReducedMotion = useReducedMotion();

  // En táctil o con movimiento reducido queda solo el cursor nativo.
  if (!hasFinePointer || prefersReducedMotion) return null;

  return (
    <MotionConfig reducedMotion="user">
      <CursorShapes />
    </MotionConfig>
  );
}

function CursorShapes() {
  const [variant, setVariant] = useState('default');

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  // Dos resortes sobre la misma posición: el del punto es rígido (lo sigue
  // casi pegado) y el del anillo es blando (se queda atrás). Ese retraso es
  // lo que se lee como "anillo que persigue al punto".
  const dotX = useSpring(pointerX, { stiffness: 800, damping: 35, mass: 0.3 });
  const dotY = useSpring(pointerY, { stiffness: 800, damping: 35, mass: 0.3 });
  const ringX = useSpring(pointerX, { stiffness: 200, damping: 25, mass: 0.5 });
  const ringY = useSpring(pointerY, { stiffness: 200, damping: 25, mass: 0.5 });

  useEffect(() => {
    const onMove = (event) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    };
    const onOver = (event) => setVariant(variantUnderPointer(event.target));
    // Al salir de la ventana no hay elemento debajo: vuelve a default.
    const onOut = (event) => {
      if (!event.relatedTarget) setVariant('default');
    };
    // Al volver con el botón Atrás, el navegador puede restaurar la página
    // tal como quedó (bfcache), con la variante del link que se clickeó.
    const onPageShow = (event) => {
      if (event.persisted) setVariant('default');
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [pointerX, pointerY]);

  const ringSize = variant === 'link' ? 64 : variant === 'view' ? 80 : 32;
  const ringOpacity = variant === 'drag' ? 0 : 1;
  const dotSize = variant === 'drag' ? 14 : 6;

  return (
    <>
      {/* Punto terracota sólido en los dos temas: mix-blend-difference sobre
          el beige del tema claro daba un cursor invisible. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-9999 rounded-full bg-accent"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: dotSize,
          height: dotSize,
        }}
        animate={{ width: dotSize, height: dotSize }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Anillo. En "view" lleva un fondo translúcido del tema para que el
          texto se lea sin taparlo del todo. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-9999 rounded-full border border-(--ink-primary) flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor:
            variant === 'view' ? 'color-mix(in srgb, var(--bg-primary) 80%, transparent)' : 'transparent',
        }}
        animate={{ width: ringSize, height: ringSize, opacity: ringOpacity }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {variant === 'view' && (
          <span className="font-mono text-[10px] tracking-widest uppercase text-(--ink-primary) font-semibold">
            View
          </span>
        )}
      </motion.div>
    </>
  );
}
