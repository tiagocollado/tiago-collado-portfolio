'use client'

/**
 * InteractiveDotGrid
 * ------------------
 * Grilla de puntos dibujada en <canvas> 2D. Los puntos cercanos al cursor
 * se alejan de él con una fuerza que decae cuadráticamente, y regresan
 * a su posición original con un lerp suave cuando el cursor se aleja.
 *
 * Comportamiento por contexto:
 *  - Desktop (pointer fino) → render con requestAnimationFrame y repulsión.
 *  - Touch / mobile         → fallback a un dot-grid estático en CSS
 *                             (idéntico visualmente al usado antes del canvas).
 *  - prefers-reduced-motion → canvas se dibuja UNA sola vez, sin animar.
 *
 * El componente se monta absolute inset-0 dentro del contenedor padre,
 * así que el padre necesita position: relative.
 */

import { useEffect, useRef } from 'react'

interface InteractiveDotGridProps {
  /** Separación entre puntos (px). Más chico = grilla más densa. */
  spacing?: number
  /** Radio del punto dibujado (px). */
  dotRadius?: number
  /** Radio de influencia del cursor (px). Fuera de este círculo, el punto no se mueve. */
  influenceRadius?: number
  /** Desplazamiento máximo de un punto cuando el cursor pasa por encima (px). */
  maxDisplacement?: number
  /** Suavidad del retorno a la posición original (0–1). Más chico = más elástico. */
  lerpFactor?: number
  /** Nombre de la CSS var a usar como color del punto. Se re-lee en cambios de tema. */
  colorVar?: string
  /** Opacidad global del canvas (0–1). */
  opacity?: number
  className?: string
}

export default function InteractiveDotGrid({
  spacing = 32,
  dotRadius = 1.2,
  influenceRadius = 140,
  maxDisplacement = 36,
  lerpFactor = 0.12,
  colorVar = '--ink-muted',
  opacity = 0.55,
  className,
}: InteractiveDotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fallbackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Detectar capacidades del dispositivo.
    // pointer: coarse → touch (celular/tablet).
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Touch: mostrar el fallback CSS y salir. El canvas se queda escondido.
    if (isTouch) {
      if (fallbackRef.current) fallbackRef.current.style.display = 'block'
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement
    if (!parent) return

    const dpr = window.devicePixelRatio || 1

    // ─── Estado interno ────────────────────────────────────────────────
    // Cada dot guarda su posición actual (x, y) y su posición "home"
    // (homeX, homeY) que es a donde vuelve cuando el cursor se aleja.
    type Dot = { x: number; y: number; homeX: number; homeY: number }
    let dots: Dot[] = []
    let width = 0
    let height = 0

    // Color leído de la CSS var. Se recalcula si cambia el tema (next-themes
    // agrega/quita la clase `.dark` en <html>).
    let dotColor = 'rgba(138, 134, 128, 1)'
    const readColor = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(colorVar).trim()
      if (raw) dotColor = raw
    }
    readColor()
    const themeObserver = new MutationObserver(readColor)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    // Cursor en coordenadas locales del canvas. -9999 = "fuera de alcance".
    let mouseX = -9999
    let mouseY = -9999

    // ─── Construcción de la grilla ─────────────────────────────────────
    // Se llama en el mount y en cada resize del contenedor padre.
    const buildGrid = () => {
      const rect = parent.getBoundingClientRect()
      width = rect.width
      height = rect.height

      // Para crispness en pantallas retina: buffer en device px, visual en CSS px.
      // Asignar width/height resetea el context state (incluyendo transforms),
      // por eso re-aplicamos scale(dpr) en cada rebuild.
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)

      // Grilla centrada: sumamos 1 columna/fila extra y calculamos offset
      // para que el primer y último punto queden simétricos respecto al borde.
      const cols = Math.ceil(width / spacing) + 1
      const rows = Math.ceil(height / spacing) + 1
      const offsetX = (width - (cols - 1) * spacing) / 2
      const offsetY = (height - (rows - 1) * spacing) / 2

      dots = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * spacing
          const y = offsetY + r * spacing
          dots.push({ x, y, homeX: x, homeY: y })
        }
      }
    }

    // ─── Eventos de mouse ──────────────────────────────────────────────
    // Los adjuntamos al parent y no a window: si el cursor sale de la
    // sección del Hero, los puntos vuelven a su lugar.
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    const onMouseLeave = () => {
      mouseX = -9999
      mouseY = -9999
    }

    // ─── Loop de animación ─────────────────────────────────────────────
    // Para cada punto:
    //   1. Calculamos el vector desde su "home" al cursor.
    //   2. Si está dentro del radio de influencia, calculamos el empuje:
    //      fuerza = (1 - dist / radio)²  → decae cuadráticamente.
    //      El punto se desplaza maxDisplacement * fuerza en dirección
    //      OPUESTA al cursor (repulsión).
    //   3. Suavizamos la interpolación hacia el target con lerp:
    //      pos += (target - pos) * lerpFactor.
    //      Valores chicos (0.08–0.15) dan movimiento elástico y premium.
    const radiusSq = influenceRadius * influenceRadius
    let animationId = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.globalAlpha = opacity
      ctx.fillStyle = dotColor

      for (const dot of dots) {
        let targetX = dot.homeX
        let targetY = dot.homeY

        // Solo calculamos repulsión si el cursor está activo.
        if (mouseX > -9000) {
          const dx = mouseX - dot.homeX
          const dy = mouseY - dot.homeY
          const distSq = dx * dx + dy * dy

          if (distSq < radiusSq) {
            // 0.001 evita división por cero si el cursor cae exactamente sobre el dot.
            const dist = Math.sqrt(distSq) || 0.001
            const t = 1 - dist / influenceRadius
            const push = t * t * maxDisplacement
            targetX = dot.homeX - (dx / dist) * push
            targetY = dot.homeY - (dy / dist) * push
          }
        }

        dot.x += (targetX - dot.x) * lerpFactor
        dot.y += (targetY - dot.y) * lerpFactor

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(render)
      }
    }

    // ─── Setup ─────────────────────────────────────────────────────────
    const resizeObserver = new ResizeObserver(buildGrid)
    resizeObserver.observe(parent)
    buildGrid()

    if (prefersReducedMotion) {
      // Un solo frame estático, sin animación ni listeners de mouse.
      render()
    } else {
      parent.addEventListener('mousemove', onMouseMove)
      parent.addEventListener('mouseleave', onMouseLeave)
      render()
    }

    return () => {
      cancelAnimationFrame(animationId)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      parent.removeEventListener('mousemove', onMouseMove)
      parent.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [spacing, dotRadius, influenceRadius, maxDisplacement, lerpFactor, colorVar, opacity])

  return (
    <>
      {/* Canvas interactivo (desktop) */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 pointer-events-none ${className ?? ''}`}
        aria-hidden
      />

      {/* Fallback CSS estático (touch). Escondido por default; el useEffect lo muestra. */}
      <div
        ref={fallbackRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          display: 'none',
          opacity,
          backgroundImage: `radial-gradient(circle, var(${colorVar}) ${dotRadius}px, transparent ${dotRadius}px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
        }}
        aria-hidden
      />
    </>
  )
}
