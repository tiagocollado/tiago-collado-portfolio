import { useEffect, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import LanguageToggle from './LanguageToggle.jsx';
import MarqueeLink from './MarqueeLink.jsx';
import NavLogo from './NavLogo.jsx';

// Los links pasan a --ink-primary a los 100px de scroll, cuando el wordmark
// del hero ya se achica.

// El tema es una clase en <html> que pone el script inline del layout: para
// React es un valor externo, de ahí useSyncExternalStore.

const THEME_STORAGE_KEY = 'theme';

function subscribeToTheme(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}
const readTheme = () => (document.documentElement.classList.contains('light') ? 'light' : 'dark');
// En el servidor no se sabe el tema: el botón espera al navegador para no
// mostrar el ícono equivocado.
const readThemeOnServer = () => null;

// Igual que el script inline: color-scheme hace que los controles nativos
// acompañen.
function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Sin localStorage (modo privado estricto) el cambio no se recuerda.
  }
}


function subscribeToScroll(onChange) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}
const readScrolledPastHero = () => window.scrollY > 100;
const readScrolledOnServer = () => false;

export default function Navbar({ texts, homeHref, isHome, languageLinks }) {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, readThemeOnServer);
  const scrolled = useSyncExternalStore(subscribeToScroll, readScrolledPastHero, readScrolledOnServer);
  const [menuOpen, setMenuOpen] = useState(false);

  // Si el tema cambia en otra pestaña, esta lo sigue.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      if (event.newValue === 'light' || event.newValue === 'dark') applyTheme(event.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  };

  // Nombra la acción, no el estado: en oscuro dice "Modo claro".
  const themeLabel = theme === 'dark' ? texts.themeToLight : texts.themeToDark;
  const linkColor = scrolled ? 'var(--ink-primary)' : 'var(--ink-secondary)';

  const projectsHref = `${homeHref}#projects`;
  const aboutHref = `${homeHref}#about`;
  const contactHref = `${homeHref}#contact`;

  return (
    <MotionConfig reducedMotion="user">
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-md px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32"
        style={{ backgroundColor: 'color-mix(in srgb, var(--bg-primary) 85%, transparent)' }}
      >
        {/* Gutter y max-w en elementos distintos: juntos, el padding cuenta
            dentro del max-w y el logo queda corrido. */}
        <nav className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4 relative">
          <NavLogo href={homeHref} isHome={isHome} label={texts.homeLink} />

          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <NavLink href={projectsHref} color={linkColor}>
              {texts.projects}
            </NavLink>
            <NavLink href={aboutHref} color={linkColor}>
              {texts.about}
            </NavLink>
            <div data-cursor="link">
              <MarqueeLink href={contactHref} label={texts.contactMarquee} />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div data-cursor="link">
              <LanguageToggle links={languageLinks} groupLabel={texts.changeLanguage} />
            </div>
            {theme && (
              <button
                onClick={toggleTheme}
                data-cursor="link"
                aria-label={themeLabel}
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

          <div className="lg:hidden relative">
            <motion.button
              onClick={() => setMenuOpen((open) => !open)}
              data-cursor="link"
              aria-label={menuOpen ? texts.menuClose : texts.menuOpen}
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
                  <DropdownLink href={projectsHref} onClick={() => setMenuOpen(false)}>
                    {texts.projects}
                  </DropdownLink>
                  <DropdownLink href={aboutHref} onClick={() => setMenuOpen(false)}>
                    {texts.about}
                  </DropdownLink>
                  <DropdownLink href={contactHref} onClick={() => setMenuOpen(false)}>
                    {texts.contactMarquee}
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
                    <LanguageToggle links={languageLinks} groupLabel={texts.changeLanguage} />
                    {theme && (
                      <button
                        onClick={() => {
                          toggleTheme();
                          setMenuOpen(false);
                        }}
                        aria-label={themeLabel}
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
    </MotionConfig>
  );
}

// El color llega por prop porque cambia con el scroll.
function NavLink({ href, color, children }) {
  return (
    <a
      href={href}
      data-cursor="link"
      className="relative text-sm font-medium no-underline transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-250 after:ease-expo-out hover:after:scale-x-100"
      style={{ color }}
    >
      {children}
    </a>
  );
}

function DropdownLink({ href, onClick, children }) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      data-cursor="link"
      variants={{ hidden: { opacity: 0, y: -4 }, visible: { opacity: 1, y: 0 } }}
      className="block px-4 py-2 text-sm font-medium no-underline transition-colors duration-200 text-(--ink-secondary) hover:bg-(--bg-secondary) hover:text-(--ink-primary)"
    >
      {children}
    </motion.a>
  );
}
