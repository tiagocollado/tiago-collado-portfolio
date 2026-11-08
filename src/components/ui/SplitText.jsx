import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/*
 * Texto que entra letra por letra, con desenfoque y una subida corta.
 *
 * Cómo está armado:
 *  - El texto se parte por palabras. Cada palabra es un span con
 *    whitespace-nowrap: así una palabra nunca se corta al medio cuando la
 *    línea se termina. Entre palabras queda un espacio común, que es el
 *    único lugar donde la línea puede partirse.
 *  - Cada letra es un motion.span con su propio delay (delay + índice ×
 *    stagger). No se usa staggerChildren porque solo llega a hijos motion
 *    DIRECTOS, y acá entre el contenedor y las letras están los spans de
 *    cada palabra.
 *  - Accesibilidad: el texto entero queda en un span sr-only para los
 *    lectores de pantalla, y las letras sueltas van con aria-hidden para que
 *    no se lean de a una. El sr-only lleva select-none: sin eso, al copiar,
 *    el texto sale duplicado (está dos veces en el DOM).
 *  - Con movimiento reducido se muestra sin animar.
 *  - `whileInView`: anima al entrar en pantalla, con UN IntersectionObserver
 *    para todo el texto (no uno por letra).
 */
export default function SplitText({
  text,
  as = 'span',
  stagger = 0.04,
  delay = 0,
  yFrom = 16,
  blurFrom = 4,
  duration = 0.6,
  className,
  charClassName,
  id,
  whileInView = false,
}) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  // Sin whileInView, anima al montar: arranca "en pantalla".
  const [inView, setInView] = useState(!whileInView);

  useEffect(() => {
    if (!whileInView || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-10% 0px' },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [whileInView]);

  const Tag = as;
  const words = text.split(' ');

  // Índice global de la primera letra de cada palabra, para que el stagger
  // corra a lo largo de todo el texto y no se reinicie en cada palabra.
  const wordStartIndex = [];
  let lettersSoFar = 0;
  for (const word of words) {
    wordStartIndex.push(lettersSoFar);
    lettersSoFar += word.length;
  }

  const hiddenState = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 0, y: yFrom, filter: `blur(${blurFrom}px)` };
  const visibleState = { opacity: 1, y: 0, filter: 'blur(0px)' };
  const currentState = inView ? visibleState : hiddenState;

  return (
    <Tag id={id} className={className}>
      <span className="sr-only select-none">{text}</span>
      <span ref={containerRef} aria-hidden="true">
        {words.map((word, wordIndex) => (
          <Fragment key={wordIndex}>
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, charIndex) => {
                const letterIndex = wordStartIndex[wordIndex] + charIndex;
                const transition = prefersReducedMotion
                  ? { duration: 0 }
                  : { duration, ease: [0.16, 1, 0.3, 1], delay: delay + letterIndex * stagger };
                return (
                  <motion.span
                    key={charIndex}
                    initial={hiddenState}
                    animate={currentState}
                    transition={transition}
                    className={`inline-block ${charClassName ?? ''}`}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
            {wordIndex < words.length - 1 && ' '}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
