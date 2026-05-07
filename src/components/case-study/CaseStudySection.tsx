/**
 * Wrapper de sección para el layout Awwwards-style.
 * Server component — solo render, sin estado.
 *
 * Estructura: micro-label uppercase mono arriba (ej. "El desafío") + slot
 * para children abajo. La idea es que cada sección tenga el mismo tratamiento
 * tipográfico para mantener coherencia entre los 5 case studies cuando se
 * migren uno por uno.
 *
 * Si `label` es null/undefined, no se renderea la línea de label — útil para
 * el bloque de intro que no lleva título de sección (las refs Awwwards
 * arrancan sin label).
 *
 * El reveal en scroll lo manejan los hijos (CaseStudyImage, etc.) de forma
 * granular — la sección como wrapper queda estática para mantener el tree
 * server-component-friendly.
 */
export default function CaseStudySection({
  label,
  children,
}: {
  label?: string | null
  children: React.ReactNode
}) {
  return (
    <section className="relative">
      {label && (
        <p
          className="text-[11px] font-mono uppercase tracking-[0.18em] mb-6 md:mb-8"
          style={{ color: 'var(--color-accent)' }}
        >
          {label}
        </p>
      )}
      <div className="space-y-8 md:space-y-10">
        {children}
      </div>
    </section>
  )
}
