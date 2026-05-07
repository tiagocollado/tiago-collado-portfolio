import { Project, Locale } from '@/types'
import { getTranslations } from 'next-intl/server'

/**
 * Sidebar de metadata para el layout Awwwards-style de case studies.
 * Server component — no necesita estado ni efectos.
 *
 * Se renderea solo si `project.metadata` existe. Cada bloque (cliente, año,
 * rol, duración, equipo, stack, nda) se muestra solo si tiene valor.
 *
 * En desktop (lg+) queda sticky en el top mientras el lector scrollea el
 * main column. Implementación con `position: sticky` puro CSS — sin JS.
 *
 * Patrón visual: label mono uppercase chiquito (eyebrow) + value en font-display.
 * Inspirado en Mediasignal / LinkBoard (ver public/images/references/casestudy*).
 */
export default async function CaseStudySidebar({
  project,
  locale,
}: {
  project: Project
  locale: Locale
}) {
  const t = await getTranslations('case_study')
  if (!project.metadata) return null

  const m = project.metadata

  // Cada bloque queda como [labelKey, value]. Si value es null/undefined, no se renderea.
  // Esto evita columnas vacías cuando un proyecto no tiene NDA o no tiene team.
  const blocks: Array<{ label: string; value: string | string[] | null }> = [
    { label: t('meta_client'),   value: m.client?.[locale]   ?? null },
    { label: t('meta_year'),     value: project.year ? String(project.year) : null },
    { label: t('meta_role'),     value: m.role?.[locale]     ?? null },
    { label: t('meta_duration'), value: m.duration?.[locale] ?? null },
    { label: t('meta_team'),     value: m.team?.[locale]     ?? null },
    { label: t('meta_stack'),    value: m.stack ?? null },
    { label: t('meta_nda'),      value: m.nda?.[locale]      ?? null },
  ]

  // Links del proyecto (live demo, repos). Se renderean como bloque final del
  // sidebar — son CTAs pero con tratamiento sobrio (texto + flecha externa)
  // para no chocar con la jerarquía editorial del main column. La sticky
  // position los mantiene accesibles mientras el lector scrollea la copy.
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
    <aside className="lg:sticky lg:top-28 lg:self-start space-y-8">
      {blocks
        .filter((b) => b.value !== null)
        .map((b) => (
          <div key={b.label}>
            <p
              className="text-[11px] font-mono uppercase tracking-[0.18em] mb-2"
              style={{ color: 'var(--ink-muted)' }}
            >
              {b.label}
            </p>
            {Array.isArray(b.value) ? (
              <ul className="space-y-1">
                {b.value.map((item) => (
                  <li
                    key={item}
                    className="text-sm md:text-base font-display"
                    style={{ color: 'var(--ink-primary)' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className="text-sm md:text-base font-display leading-snug"
                style={{ color: 'var(--ink-primary)' }}
              >
                {b.value}
              </p>
            )}
          </div>
        ))}

      {/* Bloque Links al final del sidebar — solo si el proyecto tiene alguno */}
      {linkItems.length > 0 && (
        <div>
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
                  className="group inline-flex items-center gap-2 text-sm md:text-base font-display leading-snug transition-colors duration-300 hover:text-accent"
                  style={{ color: 'var(--ink-primary)' }}
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
        </div>
      )}
    </aside>
  )
}
