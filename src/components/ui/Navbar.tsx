'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const toggleLanguage = () => {
    const next = locale === 'es' ? 'en' : 'es'
    router.push(pathname.replace(`/${locale}`, `/${next}`))
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-default)] bg-[var(--bg-primary)]">
      <nav className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between">
        
        {/* Logo - Cambiado a font-display */}
        <a 
          href={`/${locale}`} 
          className="font-display text-base font-semibold text-[var(--ink-primary)] no-underline tracking-tight"
        >
          Tiago Collado
        </a>

        <div className="flex items-center gap-8">
          <a 
            href={`/${locale}#projects`} 
            className="text-sm text-[var(--ink-secondary)] no-underline transition-colors duration-200 hover:text-[var(--ink-primary)]"
          >
            {t('projects')}
          </a>

          <a 
            href={`/${locale}#about`} 
            className="text-sm text-[var(--ink-secondary)] no-underline transition-colors duration-200 hover:text-[var(--ink-primary)]"
          >
            {t('about')}
          </a>

          {/* Botón de idioma - Actualizado para usar tu bg-secondary en el hover */}
          <button 
            onClick={toggleLanguage} 
            className="text-xs font-medium text-[var(--ink-muted)] bg-transparent border border-[var(--border-default)] rounded px-2 py-1 cursor-pointer transition-all duration-200 tracking-wider hover:bg-[var(--bg-secondary)]"
          >
            {locale === 'es' ? 'EN' : 'ES'}
          </button>

          {mounted && (
            <button 
              onClick={toggleTheme} 
              aria-label="Cambiar tema" 
              className="text-xs font-medium text-[var(--ink-muted)] bg-transparent border border-[var(--border-default)] rounded px-2 py-1 cursor-pointer transition-all duration-200 hover:bg-[var(--bg-secondary)]"
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          )}
        </div>

      </nav>
    </header>
  )
}