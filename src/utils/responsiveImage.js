import { getImage } from 'astro:assets';
import { IMAGE_QUALITY, srcsetWidthsFor } from '../components/case-study/imageSpec.js';

/*
 * Para las islas, donde no se puede usar <Image />: el .astro la llama y le
 * pasa src, srcset y sizes a la isla. Solo desde un .astro: getImage() corre
 * en el servidor.
 */
export async function getResponsiveImageProps(image, sizes) {
  const optimized = await getImage({
    src: image,
    widths: srcsetWidthsFor(image),
    quality: IMAGE_QUALITY,
  });

  return {
    src: optimized.src,
    srcset: optimized.srcSet.attribute,
    sizes,
  };
}
