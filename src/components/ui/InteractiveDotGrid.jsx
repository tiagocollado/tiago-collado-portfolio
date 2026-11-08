import { useEffect, useRef } from 'react';

/*
 * Grilla de puntos dibujada en un <canvas> 2D. Los puntos cerca del cursor
 * se alejan de él con una fuerza que decae cuadráticamente y vuelven a su
 * lugar con un lerp suave cuando el cursor se va.
 *
 * Según el dispositivo:
 *  - Mouse (pointer fino)   → canvas animado con requestAnimationFrame.
 *  - Táctil                 → grilla estática en CSS, sin canvas.
 *  - Movimiento reducido    → el canvas se dibuja UNA vez, sin animar.
 *
 * Va con position: absolute e inset-0, así que el elemento que la contiene
 * necesita position: relative. Ese elemento es el que mide y el que escucha
 * el mouse (ver `container` abajo).
 *
 * No usa Framer Motion: el movimiento reducido lo resuelve sola.
 */
export default function InteractiveDotGrid({
  spacing = 32, // separación entre puntos (px)
  dotRadius = 1.2, // radio de cada punto (px)
  influenceRadius = 140, // radio de alcance del cursor (px)
  maxDisplacement = 36, // cuánto se puede correr un punto (px)
  lerpFactor = 0.12, // suavidad del retorno (0–1): más chico, más elástico
  colorVar = '--ink-muted', // variable CSS del color; se relee al cambiar el tema
  opacity = 0.55,
  className,
}) {
  const canvasRef = useRef(null);
  const fallbackRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Táctil: se muestra la grilla CSS y el canvas queda escondido.
    if (isTouch) {
      if (fallbackRef.current) fallbackRef.current.style.display = 'block';
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /*
     * El contenedor es el ancestro posicionado más cercano (offsetParent),
     * no el padre directo. Esta grilla es su propia isla de Astro, y Astro
     * la envuelve en un <astro-island> con display: contents: ese envoltorio
     * no tiene caja (mide 0 × 0) y no recibe los eventos del mouse. El
     * offsetParent lo saltea y llega a la <section> del Hero, que es la que
     * tiene position: relative y contra la que se posiciona el canvas.
     */
    const container = canvas.offsetParent;
    if (!(container instanceof HTMLElement)) return;

    const dpr = window.devicePixelRatio || 1;

    // ─── Estado ────────────────────────────────────────────────────────
    // Cada punto guarda dónde está (x, y) y a dónde vuelve (homeX, homeY).
    let dots = [];
    let width = 0;
    let height = 0;

    // Colores leídos de las variables CSS; se recalculan al cambiar el tema.
    // dotColor es el color base; los puntos más cerca del cursor se tiñen
    // de terracota (accentRGB).
    let dotColor = 'rgba(138, 134, 128, 1)';
    let accentRGB = { r: 201, g: 106, b: 58 };
    let baseRGB = { r: 138, g: 134, b: 128 };

    // Pasa "rgb(r, g, b)", "rgba(...)" o "#rrggbb" a { r, g, b }.
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
    // El tema cambia la clase de <html>: al cambiar, se releen los colores.
    const themeObserver = new MutationObserver(readColor);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Cursor en coordenadas del canvas. -9999 = fuera de alcance.
    let mouseX = -9999;
    let mouseY = -9999;

    // ─── Grilla ────────────────────────────────────────────────────────
    // Se arma al montar y cada vez que el contenedor cambia de tamaño.
    const buildGrid = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      // Nítido en pantallas retina: el buffer en píxeles del dispositivo y
      // el tamaño visual en píxeles CSS. Asignar width/height resetea el
      // contexto, así que el scale(dpr) se vuelve a aplicar cada vez.
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Grilla centrada: una columna y una fila de más, con el margen
      // repartido para que los bordes queden simétricos.
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

    // ─── Mouse ─────────────────────────────────────────────────────────
    // Se escucha en el contenedor y no en window: si el cursor sale del
    // Hero, los puntos vuelven a su lugar.
    const onMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    // ─── Loop de animación ─────────────────────────────────────────────
    // Para cada punto:
    //   1. Vector desde su lugar hasta el cursor.
    //   2. Si está dentro del radio: fuerza = (1 - distancia / radio)², y
    //      el punto se corre maxDisplacement × fuerza, alejándose del cursor.
    //   3. Se acerca a ese destino con lerp: pos += (destino - pos) × lerpFactor.
    const radiusSq = influenceRadius * influenceRadius;
    let animationId = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Se desvanece al scrollear: opacidad de 1 a 0 entre 0 y 600px.
      const scrollFade = Math.max(0, Math.min(1, 1 - window.scrollY / 600));

      // "Respiración": el radio oscila entre 1× y 1,3× cada 4 segundos.
      // Con movimiento reducido queda fijo.
      const now = performance.now();
      const pulseScale = prefersReducedMotion ? 1 : 1.15 + 0.15 * Math.sin((now * 2 * Math.PI) / 4000);
      const drawRadius = dotRadius * pulseScale;

      ctx.globalAlpha = opacity * scrollFade;

      for (const dot of dots) {
        let targetX = dot.homeX;
        let targetY = dot.homeY;
        // 1 = pegado al cursor, 0 = lejos. Mezcla el color base con el
        // terracota en los puntos más cercanos.
        let colorBlend = 0;

        if (mouseX > -9000) {
          const dx = mouseX - dot.homeX;
          const dy = mouseY - dot.homeY;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq) {
            // El 0.001 evita dividir por cero si el cursor cae justo encima.
            const dist = Math.sqrt(distSq) || 0.001;
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

    // ─── Arranque ──────────────────────────────────────────────────────
    const resizeObserver = new ResizeObserver(buildGrid);
    resizeObserver.observe(container);
    buildGrid();

    // Con movimiento reducido: un solo frame, sin escuchar el mouse.
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
      {/* Canvas interactivo (con mouse) */}
      <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none ${className ?? ''}`} aria-hidden="true" />

      {/* Grilla CSS estática (táctil). Escondida hasta que el efecto la muestra. */}
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
