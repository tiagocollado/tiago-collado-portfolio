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
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-primary) 85%, transparent)' }}>
      <nav className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-end gap-8">

        {/* Logo - con hover animado */}
        <a
          href={`/${locale}`}
          className="font-display text-base font-semibold tracking-tight no-underline absolute left-6 md:left-10 transition-all duration-300 hover:opacity-60 hover:scale-[1.02]"
          style={{ color: 'var(--ink-primary)' }}
        >
          Tiago Collado
        </a>

        {/* Centro: Links + Contacto */}
        <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          <a
            href={`/${locale}#projects`}
            className="text-sm font-medium no-underline underline-offset-4 transition-all duration-300 hover:underline hover:underline-offset-8 hover:text-(--ink-primary) hover:scale-[1.02]"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {t('projects')}
          </a>

          <a
            href={`/${locale}#about`}
            className="text-sm font-medium no-underline underline-offset-4 transition-all duration-300 hover:underline hover:underline-offset-8 hover:text-(--ink-primary) hover:scale-[1.02]"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {t('about')}
          </a>

          {/* Botón Contacto - contraste exacto light/dark */}
          <a
            href={`/${locale}#contact`}
            className="btn-contacto inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: '#FFFFFF',
            }}
          >
            {t('contact')}
          </a>
        </div>

        {/* Derecha: Toggles */}
        <div className="flex items-center gap-3">

          {/* Toggle idioma */}
          <button
            onClick={toggleLanguage}
            aria-label={`Cambiar a ${locale === 'es' ? 'inglés' : 'español'}`}
            className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:bg-(--bg-secondary) hover:-translate-y-0.5"
            style={{ 
              color: 'var(--ink-secondary)',
              backgroundColor: 'transparent',
            }}
          >
            <Languages size={14} className="transition-transform duration-300 group-hover:rotate-12" />
            <span>{locale === 'es' ? 'ES' : 'EN'}</span>
          </button>

          {/* Toggle tema */}
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 hover:bg-(--bg-secondary) hover:scale-105"
              style={{ 
                color: 'var(--ink-secondary)',
                backgroundColor: 'transparent',
              }}
            >
              {theme === 'dark'
                ? <Sun size={18} className="transition-transform duration-300 hover:rotate-12" />
                : <Moon size={18} className="transition-transform duration-300 hover:-rotate-12" />
              }
            </button>
          )}
        </div>

      </nav>
    </header>
  )
}
