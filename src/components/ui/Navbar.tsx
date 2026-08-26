'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MarqueeLink from './MarqueeLink'
import NavLogo from './NavLogo'
import LanguageToggle from './LanguageToggle'
import { useCursor } from '@/hooks/useCursor'

/**
 * Navbar simplificado — altura constante h-16 siempre.
 *
 * El "logo" es <NavLogo /> que hace cross-fade con el <NameLogo /> gigante
 * del Hero (Hero maneja el shrink-on-scroll del nombre; el navbar no compite).
 * Por eso no necesita modos minimal/full ni altura dinámica.
 *
 * Layout en lg+: NavLogo (izq) — Proyectos / Sobre mí / MarqueeLink / LanguageToggle / theme (der).
 * Layout en <lg: NavLogo (izq) — MarqueeLink (der opcional) + hamburguesa con dropdown.
 *
 * Color de los links: shift de --ink-secondary → --ink-primary cuando se
 * scrollea > 100px (el nombre en Hero ya está achicando, el navbar toma
 * presencia visual). Underline draw on hover via Tailwind `after:` utilities.
 */
export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const { theme, setTheme } = useTheme()
  const { setVariant } = useCursor()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Handlers compartidos para todos los items interactivos del navbar.
  // Cualquier link / botón que sea clickeable cambia el cursor a `link`.
  const onCursorEnter = () => setVariant('link')
  const onCursorLeave = () => setVariant('default')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  const linkColor = scrolled ? 'var(--ink-primary)' : 'var(--ink-secondary)'

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-md"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg-primary) 85%, transparent)',
      }}
    >
      <nav className="max-w-400 mx-auto px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 h-16 flex items-center justify-between gap-4 relative">
        {/* Izquierda: logo monoespaciado, fade-in scroll-driven en home. */}
        <NavLogo />

        {/* Centro absoluto (lg+): Proyectos / Sobre mí / Hablemos.
            `left-1/2 -translate-x-1/2` los centra respecto al navbar entero,
            independiente del ancho del logo y de los toggles. Así el grupo
            queda visualmente separado de los toggles de la derecha. */}
        <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <NavLink
            href={`/${locale}#projects`}
            color={linkColor}
            onMouseEnter={onCursorEnter}
            onMouseLeave={onCursorLeave}
          >
            {t('projects')}
          </NavLink>
          <NavLink
            href={`/${locale}#about`}
            color={linkColor}
            onMouseEnter={onCursorEnter}
            onMouseLeave={onCursorLeave}
          >
            {t('about')}
          </NavLink>
          <div onMouseEnter={onCursorEnter} onMouseLeave={onCursorLeave}>
            <MarqueeLink href={`/${locale}#contact`} label={t('contact_marquee')} />
          </div>
        </div>

        {/* Derecha (lg+): toggles idioma + tema. */}
        <div className="hidden lg:flex items-center gap-3">
          <div onMouseEnter={onCursorEnter} onMouseLeave={onCursorLeave}>
            <LanguageToggle />
          </div>
          {mounted && (
            <button
              onClick={toggleTheme}
              onMouseEnter={onCursorEnter}
              onMouseLeave={onCursorLeave}
              aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 bg-transparent hover:bg-(--bg-secondary) hover:scale-105"
              style={{ color: 'var(--ink-secondary)' }}
            >
              {theme === 'dark' ? (
                <Sun size={18} className="transition-transform duration-300 hover:rotate-12" />
              ) : (
                <Moon size={18} className="transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>
          )}
        </div>

        {/* Mobile: hamburguesa */}
        <div className="lg:hidden relative">
          <motion.button
            onClick={() => setMenuOpen((o) => !o)}
            onMouseEnter={onCursorEnter}
            onMouseLeave={onCursorLeave}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-300 hover:bg-(--bg-secondary)"
            style={{ color: 'var(--ink-secondary)' }}
            animate={{ rotate: menuOpen ? 90 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, y: -8 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.06 },
                  },
                }}
                className="absolute right-0 mt-2 min-w-52 rounded-xl border backdrop-blur-md py-2 shadow-lg overflow-hidden"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--bg-primary) 95%, transparent)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <DropdownLink
                  href={`/${locale}#projects`}
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={onCursorEnter}
                  onMouseLeave={onCursorLeave}
                >
                  {t('projects')}
                </DropdownLink>
                <DropdownLink
                  href={`/${locale}#about`}
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={onCursorEnter}
                  onMouseLeave={onCursorLeave}
                >
                  {t('about')}
                </DropdownLink>
                <DropdownLink
                  href={`/${locale}#contact`}
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={onCursorEnter}
                  onMouseLeave={onCursorLeave}
                >
                  {t('contact_marquee')}
                </DropdownLink>
                <motion.div
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  className="my-2 mx-4 h-px"
                  style={{ backgroundColor: 'var(--border-default)' }}
                />
                <motion.div
                  variants={{ hidden: { opacity: 0, y: -4 }, visible: { opacity: 1, y: 0 } }}
                  className="flex items-center justify-between px-4 py-2"
                >
                  <LanguageToggle />
                  {mounted && (
                    <button
                      onClick={() => {
                        toggleTheme()
                        setMenuOpen(false)
                      }}
                      aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                      className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 hover:bg-(--bg-secondary)"
                      style={{ color: 'var(--ink-secondary)' }}
                    >
                      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  )
}

/**
 * Link inline del navbar. Underline draw on hover (scaleX 0 → 1 from-left).
 * Color shift al scrollear via prop `color`.
 */
function NavLink({
  href,
  color,
  children,
  onMouseEnter,
  onMouseLeave,
}: {
  href: string
  color: string
  children: React.ReactNode
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}) {
  return (
    <a
      href={href}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative text-sm font-medium no-underline transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-250 after:ease-expo-out hover:after:scale-x-100"
      style={{ color }}
    >
      {children}
    </a>
  )
}

/**
 * Item del dropdown mobile — entra con stagger via variants.
 */
function DropdownLink({
  href,
  onClick,
  onMouseEnter,
  onMouseLeave,
  children,
}: {
  href: string
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  children: React.ReactNode
}) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      variants={{ hidden: { opacity: 0, y: -4 }, visible: { opacity: 1, y: 0 } }}
      className="block px-4 py-2 text-sm font-medium no-underline transition-colors duration-200 text-(--ink-secondary) hover:bg-(--bg-secondary) hover:text-(--ink-primary)"
    >
      {children}
    </motion.a>
  )
}
