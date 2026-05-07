'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Toggle de idioma como segmented pill estilo iOS.
 * Dos pills lado a lado ("EN" y "ES"), con el locale activo en sólido oscuro
 * (bg ink-primary, color bg-primary) y el inactivo transparente con texto
 * apagado (color ink-muted). Click en el inactivo cambia el idioma.
 *
 * Se usa en dos lugares del Navbar:
 *  - Inline (modo full, lg+): visible junto al toggle de tema.
 *  - Dropdown de hamburguesa (modo minimal): mismo componente, mismo styling.
 *
 * Ref visual: public/images/references/toggle_language_reference.png
 */
const LOCALES = ['en', 'es'] as const
type LocaleCode = typeof LOCALES[number]

export default function LanguageToggle() {
  const locale = useLocale() as LocaleCode
  const router = useRouter()
  const pathname = usePathname()

  const switchTo = (next: LocaleCode) => {
    if (next === locale) return
    router.push(pathname.replace(`/${locale}`, `/${next}`))
  }

  return (
    <div
      role="group"
      aria-label="Cambiar idioma"
      className="inline-flex items-center rounded-full p-0.5 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-default)',
      }}
    >
      {LOCALES.map((loc) => {
        const active = loc === locale
        return (
          <button
            key={loc}
            onClick={() => switchTo(loc)}
            aria-pressed={active}
            aria-label={loc === 'en' ? 'English' : 'Español'}
            className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300"
            style={{
              backgroundColor: active ? 'var(--ink-primary)' : 'transparent',
              color: active ? 'var(--bg-primary)' : 'var(--ink-muted)',
            }}
          >
            {loc}
          </button>
        )
      })}
    </div>
  )
}
