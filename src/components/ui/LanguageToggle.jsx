/*
 * Links comunes y no botones: cada uno lleva a la misma página en el otro
 * idioma, sin JavaScript. `lang` en cada link hace que el lector de pantalla
 * pronuncie "Español" en castellano aunque la página esté en inglés.
 */
export default function LanguageToggle({ links, groupLabel }) {
  return (
    <div
      role="group"
      aria-label={groupLabel}
      className="inline-flex items-center rounded-full p-0.5 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-default)',
      }}
    >
      {links.map((link) => (
        <a
          key={link.code}
          href={link.href}
          hrefLang={link.code}
          lang={link.code}
          aria-current={link.current ? 'page' : undefined}
          aria-label={link.label}
          className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300"
          style={{
            backgroundColor: link.current ? 'var(--ink-primary)' : 'transparent',
            color: link.current ? 'var(--bg-primary)' : 'var(--ink-muted)',
          }}
        >
          {link.code}
        </a>
      ))}
    </div>
  );
}
