'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Sun, Moon, Languages } from 'lucide-react'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  const toggleLanguage = () => {
    const next = locale === 'es' ? 'en' : 'es'
    router.push(pathname.replace(`/${locale}`, `/${next}`))
  }

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
      style={{
        borderColor: 'var(--border-default)',
        backgroundColor: 'color-mix(in srgb, var(--bg-primary) 85%, transparent)',
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <a
          href={`/${locale}`}
          className="font-display text-base font-semibold tracking-tight no-underline transition-opacity duration-200 hover:opacity-70"
          style={{ color: 'var(--ink-primary)' }}
        >
          Tiago Collado
        </a>

        <div className="flex items-center gap-5 sm:gap-7 md:gap-9">

          {/* Links (ocultos en mobile) */}
          <a
            href={`/${locale}#projects`}
            className="hidden sm:block text-sm no-underline transition-colors duration-200 hover:text-(--ink-primary)"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {t('projects')}
          </a>

          <a
            href={`/${locale}#about`}
            className="hidden sm:block text-sm no-underline transition-colors duration-200 hover:text-(--ink-primary)"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {t('about')}
          </a>

          <a
            href={`/${locale}#contact`}
            className="hidden sm:block text-sm no-underline transition-colors duration-200 hover:text-(--ink-primary)"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {t('contact')}
          </a>

          {/* Toggle de idioma con ícono */}
          <button
            onClick={toggleLanguage}
            aria-label={`Cambiar a ${locale === 'es' ? 'inglés' : 'español'}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[11px] font-semibold tracking-wider transition-all duration-200 cursor-pointer hover:bg-(--bg-secondary) hover:text-(--ink-primary)"
            style={{ borderColor: 'var(--border-default)', color: 'var(--ink-muted)' }}
          >
            <Languages size={13} strokeWidth={2} />
            {locale === 'es' ? 'EN' : 'ES'}
          </button>

          {/* Toggle de tema */}
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              className="flex items-center justify-center w-9 h-9 rounded-md border transition-all duration-200 cursor-pointer hover:bg-(--bg-secondary) hover:text-(--ink-primary)"
              style={{ borderColor: 'var(--border-default)', color: 'var(--ink-muted)' }}
            >
              {theme === 'dark'
                ? <Sun size={14} strokeWidth={2} />
                : <Moon size={14} strokeWidth={2} />
              }
            </button>
          )}
        </div>

      </nav>
    </header>
  )
}
