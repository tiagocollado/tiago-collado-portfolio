'use client'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="py-12 md:py-14 px-6 md:px-10 border-t"
      style={{ borderColor: 'var(--border-default)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-6">

        {/* Copyright */}
        <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
          © {currentYear} {t('rights')}
        </p>

        {/* Links secundarios — texto limpio sin íconos decorativos */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          <a
            href="https://www.linkedin.com/in/tiagocollado/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-(--ink-primary)"
            style={{ color: 'var(--ink-secondary)' }}
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/tiagocollado"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-(--ink-primary)"
            style={{ color: 'var(--ink-secondary)' }}
          >
            GitHub
          </a>
          <a
            href="/cv-tiago-collado.pdf"
            download
            className="transition-colors duration-200 hover:text-(--ink-primary)"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {t('download_cv')}
          </a>
        </div>

      </div>
    </footer>
  )
}
