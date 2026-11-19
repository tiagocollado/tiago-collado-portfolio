import Lenis from 'lenis';

/*
 * Lenis mueve el scroll real del navegador, así que window.scrollY, sticky y
 * el useScroll() de las islas siguen funcionando. Con navegación de página
 * completa no hace falta resetearlo por ruta.
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Con movimiento reducido no se monta: las anclas saltan sin animación.
if (!prefersReducedMotion) {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // Intercepta las anclas de la misma página: nadie usa window.scrollTo.
    anchors: true,
  });

  /** @param {number} time milisegundos desde que cargó la página */
  function onFrame(time) {
    lenis.raf(time);
    requestAnimationFrame(onFrame);
  }
  requestAnimationFrame(onFrame);
}
