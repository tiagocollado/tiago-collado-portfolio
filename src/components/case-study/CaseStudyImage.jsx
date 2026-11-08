import { MotionConfig, motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { IMAGE_TYPE_SPEC } from './imageSpec.js';

const DESKTOP_CROP_CLASSES = {
  video:    'md:aspect-video',
  square:   'md:aspect-square',
  wide:     'md:aspect-[3/2]',
  portrait: 'md:aspect-[3/4]',
};

const REVEAL_ON_SCROLL = {
  initial:     { opacity: 0, filter: 'blur(12px)', scale: 0.98 },
  whileInView: { opacity: 1, filter: 'blur(0px)',  scale: 1 },
  viewport:    { once: true, margin: '-15% 0px' },
  transition:  { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(desktopQuery.matches);
    update();
    desktopQuery.addEventListener('change', update);
    return () => desktopQuery.removeEventListener('change', update);
  }, []);

  return isDesktop;
}

export default function CaseStudyImage({
  type,
  image,
  alt,
  width,
  height,
  isPageHero = false,
}) {
  const figureRef = useRef(null);
  const isDesktop = useIsDesktop();

  const spec = IMAGE_TYPE_SPEC[type];
  const radius = spec.bleed ? '' : 'rounded-xl';

  const { scrollYProgress } = useScroll({
    target: figureRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [24, -24]);

  const loadingAttributes = isPageHero
    ? { fetchPriority: 'high' }
    : { loading: 'lazy' };

  const imageAttributes = {
    src: image.src,
    srcSet: image.srcset,
    sizes: image.sizes,
    alt,
    width,
    height,
    decoding: 'async',
    ...loadingAttributes,
  };

  if (spec.aspect === null) {
    return (
      <MotionConfig reducedMotion="user">
        <motion.figure ref={figureRef} className="relative w-full" {...REVEAL_ON_SCROLL}>
          <div
            className={`${radius} relative w-full overflow-hidden`}
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <img
              {...imageAttributes}
              style={{ color: 'transparent' }}
              className="block w-full h-auto"
            />
          </div>
        </motion.figure>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <motion.figure ref={figureRef} className="relative w-full" {...REVEAL_ON_SCROLL}>
        <div
          className={`${DESKTOP_CROP_CLASSES[spec.aspect]} ${radius} relative w-full overflow-hidden`}
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <motion.img
            {...imageAttributes}
            style={
              isDesktop && spec.parallax
                ? { color: 'transparent', y: parallaxY }
                : { color: 'transparent' }
            }
            className="block w-full h-auto md:absolute md:left-0 md:-top-6 md:h-[calc(100%+48px)] md:object-cover"
          />
        </div>
      </motion.figure>
    </MotionConfig>
  );
}
