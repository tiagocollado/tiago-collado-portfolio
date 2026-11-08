import { getImage } from 'astro:assets';
import { IMAGE_QUALITY, srcsetWidthsFor } from '../components/case-study/imageSpec.js';

/*
 * Optimiza una imagen en el servidor y devuelve lo que necesita un <img>
 * responsive: la URL, el `srcset` y el `sizes`.
 *
 * Es para las islas de React: ahí no se puede usar el <Image /> de Astro, así
 * que el .astro llama a esta función y le pasa el resultado como props (solo
 * texto), y la isla arma su propio <img>. Solo se puede llamar desde un
 * .astro: getImage() corre en el servidor.
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
