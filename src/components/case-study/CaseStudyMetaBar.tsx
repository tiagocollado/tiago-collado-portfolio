'use client'

import { useTranslations } from 'next-intl'
import { motion, type Variants } from 'framer-motion'
import { Project, Locale } from '@/types'
import { useCursor } from '@/hooks/useCursor'

/**
 * Barra de metadata del case study — Cliente / Año / Rol / Duración / Equipo
 * / Stack / NDA / Links, en una franja horizontal debajo del título.
 *
 * ⚠️ Reemplaza a `CaseStudySidebar`, que era una columna sticky de 3/12.
 * Tres razones, ninguna cosmética:
 *
 * 1. **Liberaba el ancho.** El sidebar se quedaba con 272px + 64px de gap de
 *    forma permanente, así que la columna editorial medía 944px y ninguna
 *    imagen podía pasar de ahí. En una pantalla de 1920px eso era menos de
 *    la mitad del viewport, y entre una laptop de 1440 y un monitor de 1920
 *    la diferencia era de 24px: el desktop no ofrecía nada que justificara
 *    la pantalla grande.
 * 2. **El orden de lectura en mobile estaba invertido.** Con `grid-cols-1`
 *    el sidebar caía full-width ARRIBA del hook de intro, así que lo primero
 *    que leías de un proyecto era su duración y su stack, no de qué se trata.
 *    Hoy en mobile la barra va DEBAJO del intro (el cruce de orden vive en la
 *    page, con `md:order-first`), y en desktop arriba.
 * 3. **No había nada que defendiera el sidebar.** Su única justificación
 *    escrita apuntaba a screenshots de referencia que ya se borraron del repo.
 *    Las cinco referencias del proyecto usan barra superior.
 *
 * Miller: hasta 8 bloques es demasiado para una línea, así que la grilla los
 * parte en 2 filas de 4 en `lg+` (y de 2 o 3 más abajo). Dos chunks de 4 se
 * escanean; ocho en fila no.
 *
 * Se renderea solo si `project.metadata` existe. Cada bloque aparece solo si
 * tiene valor, así que un proyecto sin NDA o sin equipo no deja un hueco.
 */

const container: Variants = {
  hidden: { opacity: 1 },
  visible: {
    // `delayChildren` arranca después de que el header termine su cascade,
    // para que la página entre en un solo movimiento y no en dos.
    transition: { staggerChildren: 0.06, delayChildren: 0.5 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function CaseStudyMetaBar({
  project,
  locale,
}: {
  project: Project
  locale: Locale
}) {
  const t = useTranslations('case_study')
  const { setVariant } = useCursor()
  if (!project.metadata) return null

  const m = project.metadata

  // Cada bloque queda como [label, value]. Si value es null/undefined, no se
  // renderea: evita celdas vacías cuando un proyecto no tiene NDA o equipo.
  const blocks: Array<{ label: string; value: string | string[] | null }> = [
    { label: t('meta_client'),   value: m.client?.[locale]   ?? null },
    { label: t('meta_year'),     value: project.year ? String(project.year) : null },
    { label: t('meta_role'),     value: m.role?.[locale]     ?? null },
    { label: t('meta_duration'), value: m.duration?.[locale] ?? null },
    { label: t('meta_team'),     value: m.team?.[locale]     ?? null },
    { label: t('meta_stack'),    value: m.stack ?? null },
    { label: t('meta_nda'),      value: m.nda?.[locale]      ?? null },
  ]

  // Links del proyecto (live demo, repos). Son los únicos elementos
  // interactivos de la barra, así que van al final: el ojo llega a ellos
  // después de haber escaneado el contexto.
  const linkItems: Array<{ href: string; label: string }> = []
  if (project.links.live) {
    linkItems.push({ href: project.links.live, label: t('view_live') })
  }
  if (project.links.github) {
    linkItems.push({ href: project.links.github, label: t('view_github_frontend') })
  }
  if (project.links.githubBack) {
    linkItems.push({ href: project.links.githubBack, label: t('view_github_backend') })
  }

  return (
    <motion.aside
      initial="hidden"
      // `whileInView` y no `animate`: en mobile la barra quedó debajo del
      // intro, fuera de la primera pantalla. Con `animate` hacía su entrada
      // al cargar, donde nadie la veía, y cuando llegabas ya estaba quieta.
      // En desktop está a la vista desde el inicio, así que se dispara igual
      // que antes, con el mismo delay detrás del header.
      //
      // Sin `margin` negativo, a diferencia de las secciones: con él, en una
      // laptop baja la barra podía quedar fuera del área observada al cargar
      // y no entrar hasta el primer scroll.
      whileInView="visible"
      viewport={{ once: true }}
      variants={container}
      // `border-y` arriba y abajo: es lo que la hace leer como una barra y
      // no como una fila más de contenido.
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-8 py-8 md:py-10 border-y"
      style={{ borderColor: 'var(--border-default)' }}
    >
      {blocks
        .filter((b) => b.value !== null)
        .map((b) => (
          <motion.div key={b.label} variants={item}>
            <p
              className="text-[11px] font-mono uppercase tracking-[0.18em] mb-2"
              style={{ color: 'var(--ink-muted)' }}
            >
              {b.label}
            </p>
            {Array.isArray(b.value) ? (
              <ul className="space-y-1">
                {b.value.map((it) => (
                  <li
                    key={it}
                    className="text-sm md:text-base font-display"
                    style={{ color: 'var(--ink-primary)' }}
                  >
                    {it}
                  </li>
                ))}
              </ul>
            ) : (
              <p
                // `whitespace-pre-line` permite que un `\n` en el string del
                // metadata renderee como salto de línea (ej. team con
                // `Govah: ...\nPulso: ...`). Strings sin `\n` se renderean
                // igual — la regla solo respeta los newlines explícitos.
                className="text-sm md:text-base font-display leading-snug whitespace-pre-line"
                style={{ color: 'var(--ink-primary)' }}
              >
                {b.value}
              </p>
            )}
          </motion.div>
        ))}

      {linkItems.length > 0 && (
        <motion.div variants={item}>
          <p
            className="text-[11px] font-mono uppercase tracking-[0.18em] mb-2"
            style={{ color: 'var(--ink-muted)' }}
          >
            {t('meta_links')}
          </p>
          <ul className="space-y-2">
            {linkItems.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setVariant('link')}
                  onMouseLeave={() => setVariant('default')}
                  className="group inline-flex items-center gap-2 text-sm md:text-base font-display leading-snug transition-colors duration-300 text-(--ink-primary) hover:text-accent"
                >
                  <span>{link.label}</span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-1 group-hover:-translate-y-1"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.aside>
  )
}
