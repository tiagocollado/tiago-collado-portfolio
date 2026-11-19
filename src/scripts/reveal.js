/*
 * Animaciones de entrada sin React: el CSS hace el movimiento y este script
 * agrega `is-revealed`, una sola vez.
 * - data-reveal: el elemento que anima (--reveal-y, --reveal-duration y
 *   --reveal-delay inline).
 * - data-reveal-trigger: dispara la animación de él y de los data-reveal que
 *   tiene adentro. ="load" anima al cargar; vacío, al entrar en pantalla con
 *   el margen de data-reveal-margin ("-80px").
 */

function reveal(trigger) {
  trigger.classList.add('is-revealed');
}

// Un observer por margen distinto: el margen es una opción del observer.
const observersByMargin = new Map();

function observerFor(margin) {
  if (!observersByMargin.has(margin)) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: margin },
    );
    observersByMargin.set(margin, observer);
  }
  return observersByMargin.get(margin);
}

// Dos requestAnimationFrame: la transición solo corre si ya se pintó un
// cuadro con el estado inicial, y este script puede correr antes.
function revealAfterFirstFrame(trigger) {
  requestAnimationFrame(() => requestAnimationFrame(() => reveal(trigger)));
}

for (const trigger of document.querySelectorAll('[data-reveal-trigger]')) {
  if (trigger.dataset.revealTrigger === 'load') {
    revealAfterFirstFrame(trigger);
  } else {
    observerFor(trigger.dataset.revealMargin ?? '0px').observe(trigger);
  }
}
