'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-default)] bg-[var(--bg-primary)]">
      <nav className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between">

        <a
          href={`/${locale}`}
          className="font-display text-base font-semibold text-[var(--ink-primary)] no-underline tracking-tight"
        >
          Tiago Collado
        </a>

        <div className="flex items-center gap-6 md:gap-8">
          <a
            href={`/${locale}#projects`}
            className="hidden sm:block text-sm text-[var(--ink-secondary)] no-underline transition-colors duration-200 hover:text-[var(--ink-primary)]"
          >
            {t('projects')}
          </a>

          <a
            href={`/${locale}#about`}
            className="hidden sm:block text-sm text-[var(--ink-secondary)] no-underline transition-colors duration-200 hover:text-[var(--ink-primary)]"
          >
            {t('about')}
          </a>

          <button
            onClick={toggleLanguage}
            className="text-xs font-medium text-[var(--ink-muted)] bg-transparent border border-[var(--border-default)] rounded px-2 py-1 cursor-pointer transition-all duration-200 tracking-wider hover:bg-[var(--bg-secondary)] hover:text-[var(--ink-primary)]"
          >
            {locale === 'es' ? 'EN' : 'ES'}
          </button>

          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              className="flex items-center justify-center w-8 h-8 text-[var(--ink-muted)] bg-transparent border border-[var(--border-default)] rounded cursor-pointer transition-all duration-200 hover:bg-[var(--bg-secondary)] hover:text-[var(--ink-primary)]"
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
