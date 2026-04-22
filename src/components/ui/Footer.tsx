'use client'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-16 px-6 border-t" style={{ borderColor: 'var(--border-default)' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* CTA principal */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-6" style={{ color: 'var(--ink-primary)' }}>
            {t('cta')}
          </h2>
          <a 
            href="mailto:tiago.collado@gmail.com"
            className="inline-block px-8 py-4 rounded-lg font-medium text-base transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: '#FFFFFF',
            }}
          >
            {t('email_button')}
          </a>
        </div>

        {/* Links secundarios */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm">
          <a 
            href="https://www.linkedin.com/in/tiagocollado/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
            style={{ color: 'var(--ink-secondary)' }}
          >
            LinkedIn
          </a>
          <a 
            href="https://github.com/tiagocollado"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
            style={{ color: 'var(--ink-secondary)' }}
          >
            GitHub
          </a>
          <a 
            href="/cv-tiago-collado.pdf"
            download
            className="transition-colors duration-200"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {t('download_cv')}
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs" style={{ color: 'var(--ink-muted)' }}>
          © {currentYear} {t('rights')}
        </div>

      </div>
    </footer>
  )
}