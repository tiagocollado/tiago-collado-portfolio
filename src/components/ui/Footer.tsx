'use client'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer
      className="py-24 md:py-32 border-t"
      style={{
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="flex flex-col items-center px-6" style={{ paddingTop: '32px' }}>

        {/* Links con iconos - bien separados */}
        <div className="flex flex-wrap justify-center gap-14" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/tiagocollado/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-base transition-all duration-300 hover:-translate-y-1"
            style={{ color: 'var(--ink-secondary)' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.047c.475-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.771v20.451C0 23.225.792 24 1.771 24h20.451C23.2 24 24 23.225 24 22.225V1.771C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="font-medium">LinkedIn</span>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/tiagocollado"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-base transition-all duration-300 hover:-translate-y-1"
            style={{ color: 'var(--ink-secondary)' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.236 1.839 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.527.114-3.176 0 0 1.008-.322 3.301 1.23.956-.276 1.981-.413 2.999-.413 1.018 0 2.043.137 2.999.413 2.291-1.552 3.297-1.23 3.297-1.23.653 1.649.241 2.873.117 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.628-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="font-medium">GitHub</span>
          </a>

          {/* CV / Descarga */}
          <a
            href="/cv-tiago-collado.pdf"
            download
            className="group flex items-center gap-3 text-base transition-all duration-300 hover:-translate-y-1"
            style={{ color: 'var(--ink-secondary)' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span className="font-medium">{t('download_cv')}</span>
          </a>
        </div>

        {/* Divider grande */}
        <div
          className="w-32 h-px py-20"
          style={{ backgroundColor: 'var(--border-strong)' }}
        />

        {/* Copyright centrado */}
        <p className="text-base text-center" style={{ color: 'var(--ink-muted)', paddingTop: '16px', paddingBottom: '16px' }}>
          © 2026 Tiago Collado. Todos los derechos reservados.
        </p>

      </div>
    </footer>
  )
}