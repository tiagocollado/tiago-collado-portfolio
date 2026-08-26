'use client'

import { motion, type Variants } from 'framer-motion'

/**
 * Wrapper de sección para el layout Awwwards-style.
 *
 * Cada sección entra con scroll-in suave: fade + slide-up 16px, 0.6s expo-out
 * cuando el bloque entra al viewport. Si tiene `label`, el label entra
 * primero con un sutil delay; el contenido entra después.
 *
 * Si `label` es null/undefined, no se renderea la línea de label — útil para
 * el bloque de intro que no lleva título de sección (las refs Awwwards
 * arrancan sin label).
 *
 * Las imágenes hijas (CaseStudyImage) tienen su propio blur-in y parallax
 * por separado — este wrapper anima solo el contenedor + label.
 */

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1,
    },
  },
}

const labelVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function CaseStudySection({
  label,
  children,
}: {
  label?: string | null
  children: React.ReactNode
}) {
  return (
    <motion.section
      className="relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15% 0px' }}
      variants={sectionVariants}
    >
      {/* El label es un <h2>, no un <p>, aunque se vea como un micro-label.
          Era un <p>, y por eso el outline del case study salía h1 -> h3: los
          títulos de decisión (h3) quedaban colgando del título del proyecto
          sin nivel intermedio, y el único h2 del documento terminaba siendo
          la card de "próximo proyecto" del pie. Quien navega por headings
          con un lector de pantalla no tenía forma de saber en qué sección
          estaba. El tamaño chico es una decisión visual, no jerárquica. */}
      {label && (
        <motion.h2
          variants={labelVariants}
          className="text-[11px] font-mono uppercase tracking-[0.18em] mb-6 md:mb-8"
          style={{ color: 'var(--color-accent)' }}
        >
          {label}
        </motion.h2>
      )}
      <div className="space-y-8 md:space-y-10">
        {children}
      </div>
    </motion.section>
  )
}
