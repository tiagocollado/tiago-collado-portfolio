'use client'

/**
 * StackIcon
 * ---------
 * Renderiza el ícono asociado a una herramienta del stack.
 *
 * Estrategia (todo monocromo, hereda `currentColor` del wrapper):
 *  - Marcas en simple-icons (Figma, React, etc.) → SVG con currentColor.
 *  - Productos Adobe (no están en simple-icons por temas de licencia) →
 *    cuadrado con borde + iniciales (Ps/Ai/Pr) en currentColor. Mantiene la
 *    convención visual de Adobe (cuadrado con letras) sin colores de marca,
 *    para respetar la consistencia monocroma del resto.
 *  - Skills UX y conceptos genéricos → íconos de lucide-react.
 *
 * Para agregar un ícono nuevo: agregar entrada en el map correspondiente.
 */

import {
  Sparkles,
  Search,
  Wand2,
  Blocks,
  Accessibility,
  PenLine,
} from 'lucide-react'
import {
  siFigma,
  siReact,
  siNextdotjs,
  siTailwindcss,
  siHtml5,
  siCss,
  siGithub,
} from 'simple-icons'

type SimpleIconShape = { path: string }

// Marcas con SVG en simple-icons.
const SIMPLE_ICONS: Record<string, SimpleIconShape> = {
  'Figma':        siFigma,
  'React':        siReact,
  'Next.js':      siNextdotjs,
  'Tailwind CSS': siTailwindcss,
  'HTML5':        siHtml5,
  'CSS3':         siCss,
  'Git / GitHub': siGithub,
}

// Productos Adobe — cuadrado con iniciales (convención de marca, en monocromo).
const ADOBE_INITIALS: Record<string, string> = {
  'Adobe Photoshop':   'Ps',
  'Adobe Illustrator': 'Ai',
  'Adobe Premiere':    'Pr',
}

// Conceptos / skills sin marca → ícono lucide.
type LucideIcon = React.ComponentType<{ size?: number; className?: string }>
const LUCIDE_ICONS: Record<string, LucideIcon> = {
  'FigJam':        PenLine,
  'IA Generativa': Sparkles,
  'UX Research':   Search,
  'Prototyping':   Wand2,
  'Design Systems': Blocks,
  'Accessibility': Accessibility,
}

interface StackIconProps {
  name: string
  /** Tamaño en px. Default 18 — se ve bien en pills del carrusel. */
  size?: number
  className?: string
}

export default function StackIcon({ name, size = 18, className }: StackIconProps) {
  // 1. Adobe — cuadrado bordeado con iniciales en currentColor.
  const adobe = ADOBE_INITIALS[name]
  if (adobe) {
    return (
      <span
        aria-hidden
        className={`inline-flex items-center justify-center rounded-[3px] border font-bold leading-none ${className ?? ''}`}
        style={{
          width: size,
          height: size,
          borderColor: 'currentColor',
          color: 'currentColor',
          fontSize: size * 0.5,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {adobe}
      </span>
    )
  }

  // 2. Conceptos sin marca → ícono lucide.
  const LucideComponent = LUCIDE_ICONS[name]
  if (LucideComponent) {
    return <LucideComponent size={size} className={className} />
  }

  // 3. Marcas con SVG en simple-icons.
  const icon = SIMPLE_ICONS[name]
  if (!icon) return null

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d={icon.path} />
    </svg>
  )
}
