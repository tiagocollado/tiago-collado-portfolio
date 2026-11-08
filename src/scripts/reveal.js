/*
 * Animaciones de entrada sin React: fade + subida corta cuando un bloque
 * entra en pantalla (o al cargar la página). El movimiento lo hace el CSS
 * (ver "Animaciones de entrada" en global.css); este script solo decide
 * CUÁNDO, agregando la clase `is-revealed`.
 *
 * Dos atributos en el HTML:
 *
 *   data-reveal          el elemento que se mueve. Sus valores van en
 *                        variables CSS inline:
 *                        style="--reveal-y: 16px; --reveal-duration: 0.6s;
 *                               --reveal-delay: 0.1s"
 *
 *   data-reveal-trigger  el elemento cuya entrada dispara la animación.
 *                        Al recibir `is-revealed`, se muestran él (si
 *                        también es data-reveal) y todos los data-reveal que
 *                        tiene adentro. Así una cascada se escribe con un
 *                        solo disparador y un delay distinto en cada hijo.
 *
 *                        ="load"   anima apenas corre el script.
 *                        (vacío)   anima al entrar en pantalla. El margen de
 *                                  detección va en data-reveal-margin, con
 *                                  la sintaxis de margin de CSS ("-80px",
 *                                  "-15% 0px"). Un margen negativo achica el
 *                                  área: el bloque tiene que entrar un poco
 *                                  más antes de animar.
 *
 * Cada disparador anima una sola vez. Con movimiento reducido el CSS saca el
 * desplazamiento y deja solo el fade.
 *
 * Astro incluye este archivo una sola vez por página, aunque lo importen
 * varios componentes.
 */

function reveal(trigger) {
  trigger.classList.add('is-revealed');
}

/*
 * Un IntersectionObserver por cada margen distinto, no uno por elemento. El
 * margen es una opción del observer, así que los disparadores que comparten
 * margen comparten observer. threshold 0 (el default): alcanza con que entre
 * un píxel del área ya ajustada por el margen.
 */
const observersByMargin = new Map();

function observerFor(margin) {
  if (!observersByMargin.has(margin)) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          // Una sola vez: después de animar deja de observarlo.
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: margin },
    );
    observersByMargin.set(margin, observer);
  }
  return observersByMargin.get(margin);
}

/*
 * Una transición CSS solo corre si el navegador ya calculó el estado de
 * partida. Este script puede ejecutarse antes del primer cuadro, y si la
 * clase llegara ahí el bloque aparecería ya en su lugar, sin animar. Dos
 * requestAnimationFrame seguidos esperan a que se pinte un cuadro con el
 * estado inicial (el primero corre antes de pintar, el segundo después).
 */
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
