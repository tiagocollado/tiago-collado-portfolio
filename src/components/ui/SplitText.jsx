import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/*
 * Texto que entra letra por letra.
 * - Cada palabra va en un span whitespace-nowrap: si no, las letras
 *   inline-block dejan cortar la línea en medio de una palabra.
 * - Cada letra calcula su delay: staggerChildren no llega a través de los
 *   spans de las palabras.
 * - El texto entero va en un sr-only con select-none (si no, se copia
 *   duplicado) y las letras, con aria-hidden.
 */

/**
 * Sin esto, el editor toma como obligatoria cualquier prop sin valor por
 * defecto.
 *
 * @param {object} props
 * @param {string} props.text
 * @param {string} [props.as]
 * @param {number} [props.stagger]
 * @param {number} [props.delay]
 * @param {number} [props.yFrom]
 * @param {number} [props.blurFrom]
 * @param {number} [props.duration]
 * @param {string} [props.className]
 * @param {string} [props.charClassName]
 * @param {string} [props.id]
 * @param {boolean} [props.whileInView]
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

  // Índice de la primera letra de cada palabra, para que el stagger no se
  // reinicie en cada palabra.
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
