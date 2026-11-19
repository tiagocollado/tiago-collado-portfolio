import { useEffect, useState, useSyncExternalStore } from 'react';
import { MotionConfig, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/*
 * Punto y anillo que siguen al mouse, sin ocultar el cursor nativo. El
 * contexto de React no cruza entre islas, así que la variante (default, link,
 * view, drag) se declara con data-cursor en cualquier elemento y se lee con un
 * solo mouseover delegado en el documento: nunca queda pegada.
 */
const VARIANTS = ['default', 'link', 'view', 'drag'];

// (pointer: fine), leído con useSyncExternalStore porque puede cambiar solo.
const FINE_POINTER = '(pointer: fine)';
function subscribeFinePointer(onChange) {
  const mediaQuery = window.matchMedia(FINE_POINTER);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}
const readFinePointer = () => window.matchMedia(FINE_POINTER).matches;
// client:only: nunca se dibuja en el servidor, pero React pide el valor.
const readFinePointerOnServer = () => false;

function variantUnderPointer(target) {
  const element = target instanceof Element ? target.closest('[data-cursor]') : null;
  const variant = element?.dataset.cursor;
  return VARIANTS.includes(variant) ? variant : 'default';
}

export default function CustomCursor({ viewLabel }) {
  const hasFinePointer = useSyncExternalStore(subscribeFinePointer, readFinePointer, readFinePointerOnServer);
  const prefersReducedMotion = useReducedMotion();

  if (!hasFinePointer || prefersReducedMotion) return null;

  return (
    <MotionConfig reducedMotion="user">
      <CursorShapes viewLabel={viewLabel} />
    </MotionConfig>
  );
}

function CursorShapes({ viewLabel }) {
  const [variant, setVariant] = useState('default');
  // Hasta el primer mousemove la posición es (0, 0): no se dibuja antes.
  const [hasPointerPosition, setHasPointerPosition] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  // Resorte rígido para el punto y blando para el anillo. skipInitialAnimation
  // evita que el primer movimiento viaje desde (0, 0).
  const dotSpring = { stiffness: 800, damping: 35, mass: 0.3, skipInitialAnimation: true };
  const ringSpring = { stiffness: 200, damping: 25, mass: 0.5, skipInitialAnimation: true };
  const dotX = useSpring(pointerX, dotSpring);
  const dotY = useSpring(pointerY, dotSpring);
  const ringX = useSpring(pointerX, ringSpring);
  const ringY = useSpring(pointerY, ringSpring);

  useEffect(() => {
    const onMove = (event) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      setHasPointerPosition(true);
    };
    const onOver = (event) => setVariant(variantUnderPointer(event.target));
    const onOut = (event) => {
      if (!event.relatedTarget) setVariant('default');
    };
    // bfcache: al volver con Atrás, la página puede restaurarse con la
    // variante del link que se clickeó.
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

  if (!hasPointerPosition) return null;

  return (
    <>
      {/* Color sólido: mix-blend-difference daba un cursor invisible sobre el
          beige. */}
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
            {viewLabel}
          </span>
        )}
      </motion.div>
    </>
  );
}
