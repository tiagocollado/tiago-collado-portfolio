/*
 * Selector de idioma: dos pills lado a lado ("EN" y "ES"), con el idioma
 * activo en sólido y el otro apagado.
 *
 * Son links comunes, no botones: cada uno lleva a la misma página en su
 * idioma, y esas URLs las arma el layout en el servidor (`links`). No hace
 * falta JavaScript para cambiar de idioma. Vive como componente de React
 * porque se dibuja dos veces adentro de la isla del Navbar: en la barra de
 * escritorio y en el menú desplegable de mobile.
 *
 * `links` es una lista de { code, label, href, current }. Cada `label` es el
 * nombre del idioma en ese idioma, y el link lleva `lang` para que el lector
 * de pantalla lo pronuncie bien ("Español" con voz en castellano aunque la
 * página esté en inglés). `groupLabel` nombra el grupo en el idioma de la
 * página.
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
