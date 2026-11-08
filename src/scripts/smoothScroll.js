import Lenis from 'lenis';

/*
 * Smooth scroll con Lenis, para todo el sitio. Lo importa el <script> del
 * BaseLayout, así que corre una vez por página.
 *
 * Lenis no reemplaza el scroll del navegador: en cada frame llama a
 * window.scrollTo con la posición suavizada. Por eso window.scrollY, los
 * eventos de scroll y el useScroll() de Framer Motion en las islas siguen
 * leyendo la posición real, y position: sticky sigue funcionando.
 *
 * La navegación es de página completa: cada página arranca con el scroll
 * arriba y una instancia nueva, así que no hace falta resetearlo por ruta.
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Con movimiento reducido no se monta: queda el scroll nativo, y las anclas
// saltan sin animación, que es lo que esa preferencia pide.
if (!prefersReducedMotion) {
  const lenis = new Lenis({
    duration: 1.2,
    // Curva exponencial de salida: arranca rápido y frena suave.
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // Lenis intercepta los clicks en anclas de la misma página (#projects,
    // #contact, #top) y hace el scroll suave él mismo. Por eso ningún
    // componente usa window.scrollTo para esto.
    anchors: true,
  });

  /** @param {number} time milisegundos desde que cargó la página */
  function onFrame(time) {
    lenis.raf(time);
    requestAnimationFrame(onFrame);
  }
  requestAnimationFrame(onFrame);
}
