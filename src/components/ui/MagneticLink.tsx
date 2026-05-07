'use client'

import { motion } from 'framer-motion'
import type { ComponentProps } from 'react'
import { useMagneticHover } from '@/hooks/useMagneticHover'
import { useCursor, type CursorVariant } from '@/hooks/useCursor'

type Props = ComponentProps<typeof motion.a> & {
  factor?: number
  cursorVariant?: CursorVariant
}

/**
 * Link con efecto magnetic + sincroniza el cursor variant.
 * - Aplica desplazamiento sutil hacia el cursor (factor 0.3 default).
 * - Cuando se hace hover, setea el cursor a `link` (o el variant que se pase).
 * - Vuelve a `default` al salir.
 * - prefers-reduced-motion: el magnetic se desactiva (lo maneja el hook).
 */
export default function MagneticLink({
  factor = 0.3,
  cursorVariant = 'link',
  onMouseEnter,
  onMouseLeave,
  style,
  children,
  ...rest
}: Props) {
  const { ref, x, y } = useMagneticHover<HTMLAnchorElement>({ factor })
  const { setVariant } = useCursor()

  return (
    <motion.a
      ref={ref}
      style={{ x, y, ...style }}
      onMouseEnter={(e) => {
        setVariant(cursorVariant)
        onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        setVariant('default')
        onMouseLeave?.(e)
      }}
      {...rest}
    >
      {children}
    </motion.a>
  )
}
