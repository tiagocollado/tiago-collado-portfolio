import { useEffect, useRef } from 'react';

/*
 * Grilla de puntos en un <canvas> 2D: los puntos cerca del cursor se apartan
 * y vuelven a su lugar cuando se va. En táctil es una grilla CSS estática;
 * con movimiento reducido, un frame quieto.
 */
export default function InteractiveDotGrid({
  spacing = 32, // px
  dotRadius = 1.2, // px
  influenceRadius = 140, // px
  maxDisplacement = 36, // px
  lerpFactor = 0.12, // 0–1: más chico, retorno más elástico
  colorVar = '--ink-subtle',
  opacity = 0.55,
}) {
  const canvasRef = useRef(null);
  const fallbackRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch) {
      if (fallbackRef.current) fallbackRef.current.style.display = 'block';
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // offsetParent y no el padre: Astro envuelve la isla en un <astro-island>
    // con display: contents, que no tiene caja ni recibe eventos del mouse.
    const container = canvas.offsetParent;
    if (!(container instanceof HTMLElement)) return;

    const pixelRatio = window.devicePixelRatio || 1;

    let dots = [];
    let width = 0;
    let height = 0;

    let dotColor = 'rgba(138, 134, 128, 1)';
    let accentRGB = { r: 201, g: 106, b: 58 };
    let baseRGB = { r: 138, g: 134, b: 128 };

    // Acepta "rgb(r, g, b)", "rgba(...)" o "#rrggbb".
    const parseRGB = (value) => {
      const text = value.trim();
      if (text.startsWith('#')) {
        const hex = text.slice(1);
        return {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
        };
      }
      const numbers = text.match(/[\d.]+/g);
      if (numbers && numbers.length >= 3) {
        return { r: +numbers[0], g: +numbers[1], b: +numbers[2] };
      }
      return { r: 138, g: 134, b: 128 };
    };
    const readColor = () => {
      const styles = getComputedStyle(document.documentElement);
      const base = styles.getPropertyValue(colorVar).trim();
      if (base) {
        dotColor = base;
        baseRGB = parseRGB(base);
      }
      const accent = styles.getPropertyValue('--color-accent').trim();
      if (accent) accentRGB = parseRGB(accent);
    };
    readColor();

    // -9999 = cursor fuera de alcance.
    let mouseX = -9999;
    let mouseY = -9999;

    const buildGrid = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      // Buffer en píxeles del dispositivo para que se vea nítido. Asignar el
      // tamaño resetea el contexto, así que el scale se vuelve a aplicar.
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(pixelRatio, pixelRatio);

      // Una columna y una fila de más, centradas: bordes simétricos. La fila
      // de puntos del pie del hero repite esta cuenta en CSS (Hero.astro).
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;

      dots = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = offsetX + col * spacing;
          const y = offsetY + row * spacing;
          dots.push({ x, y, homeX: x, homeY: y });
        }
      }
    };

    // En el contenedor y no en window: si el cursor sale del hero, los puntos
    // vuelven a su lugar.
    const onMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    // Cada punto dentro del radio se aparta maxDisplacement × (1 - d / radio)²
    // y se acerca a ese destino con un lerp.
    const radiusSq = influenceRadius * influenceRadius;
    let animationId = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const scrollFade = Math.max(0, Math.min(1, 1 - window.scrollY / 600));

      // El radio oscila entre 1× y 1,3× cada 4 s.
      const now = performance.now();
      const pulseScale = prefersReducedMotion ? 1 : 1.15 + 0.15 * Math.sin((now * 2 * Math.PI) / 4000);
      const drawRadius = dotRadius * pulseScale;

      ctx.globalAlpha = opacity * scrollFade;

      for (const dot of dots) {
        let targetX = dot.homeX;
        let targetY = dot.homeY;
        let colorBlend = 0;

        if (mouseX > -9000) {
          const dx = mouseX - dot.homeX;
          const dy = mouseY - dot.homeY;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq) || 0.001; // evita dividir por cero
            const closeness = 1 - dist / influenceRadius;
            const push = closeness * closeness * maxDisplacement;
            targetX = dot.homeX - (dx / dist) * push;
            targetY = dot.homeY - (dy / dist) * push;
            // Solo la mitad interna del radio toma el terracota.
            if (closeness > 0.5) colorBlend = (closeness - 0.5) * 2;
          }
        }

        dot.x += (targetX - dot.x) * lerpFactor;
        dot.y += (targetY - dot.y) * lerpFactor;

        if (colorBlend > 0) {
          const r = baseRGB.r + (accentRGB.r - baseRGB.r) * colorBlend;
          const g = baseRGB.g + (accentRGB.g - baseRGB.g) * colorBlend;
          const b = baseRGB.b + (accentRGB.b - baseRGB.b) * colorBlend;
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        } else {
          ctx.fillStyle = dotColor;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, drawRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(render);
      }
    };

    // Cambiar el tamaño del canvas lo borra. Con movimiento reducido no hay
    // loop que vuelva a dibujar, así que se redibuja acá, también en el primer
    // aviso del observer, que llega después del primer render().
    const rebuildGrid = () => {
      buildGrid();
      if (prefersReducedMotion) render();
    };
    const resizeObserver = new ResizeObserver(rebuildGrid);
    resizeObserver.observe(container);
    buildGrid();

    // El tema es una clase en <html>.
    const onThemeChange = () => {
      readColor();
      if (prefersReducedMotion) render();
    };
    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    if (!prefersReducedMotion) {
      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('mouseleave', onMouseLeave);
    }
    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [spacing, dotRadius, influenceRadius, maxDisplacement, lerpFactor, colorVar, opacity]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />

      {/* Grilla para táctil: oculta hasta que el efecto la muestra. */}
      <div
        ref={fallbackRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          display: 'none',
          opacity,
          backgroundImage: `radial-gradient(circle, var(${colorVar}) ${dotRadius}px, transparent ${dotRadius}px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
        }}
        aria-hidden="true"
      />
    </>
  );
}
