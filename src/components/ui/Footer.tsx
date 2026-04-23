'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { ExternalLink, FileText, Copy, Check } from 'lucide-react'

const EMAIL = 'tiago.collado@gmail.com'

export default function Footer() {
  const t = useTranslations('footer')
  const [copied, setCopied] = useState(false)
  const currentYear = new Date().getFullYear()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <footer className="py-20 px-6 border-t" style={{ borderColor: 'var(--border-default)' }}>
      <div className="max-w-4xl mx-auto">

        {/* CTA section */}
        <div className="mb-16">
          <p
            className="text-xs font-mono tracking-[0.2em] uppercase mb-4"
            style={{ color: 'var(--ink-muted)' }}
          >
            {t('cta')}
          </p>

          {/* Email como elemento tipográfico principal */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${EMAIL}`}
              className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight
                         transition-opacity duration-200 hover:opacity-70"
              style={{ color: 'var(--color-accent)' }}
            >
              {EMAIL}
            </a>

            {/* Botón de copiar */}
            <button
              onClick={handleCopy}
              aria-label={t('copy_email')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium
                         transition-all duration-200 hover:bg-(--bg-secondary)"
              style={{
                borderColor: 'var(--border-default)',
                color: copied ? 'var(--color-accent)' : 'var(--ink-muted)',
              }}
            >
              {copied
                ? <><Check size={14} strokeWidth={2} /> {t('copied')}</>
                : <><Copy size={14} strokeWidth={1.75} /> {t('copy_email')}</>
              }
            </button>
          </div>

          <p className="mt-3 text-sm" style={{ color: 'var(--ink-muted)' }}>
            {t('cta_sub')}
          </p>
        </div>

        {/* Links secundarios */}
        <div className="flex flex-wrap items-center gap-6 mb-10">
          <a
            href="https://www.linkedin.com/in/tiagocollado/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors duration-200
                       hover:text-(--ink-primary)"
            style={{ color: 'var(--ink-secondary)' }}
          >
            <ExternalLink size={13} strokeWidth={1.75} />
            LinkedIn
          </a>

          <a
            href="https://github.com/tiagocollado"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors duration-200
                       hover:text-(--ink-primary)"
            style={{ color: 'var(--ink-secondary)' }}
          >
            <ExternalLink size={13} strokeWidth={1.75} />
            GitHub
          </a>

          <a
            href="/cv-tiago-collado.pdf"
            download
            className="flex items-center gap-2 text-sm transition-colors duration-200
                       hover:text-(--ink-primary)"
            style={{ color: 'var(--ink-secondary)' }}
          >
            <FileText size={15} strokeWidth={1.75} />
            {t('download_cv')}
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
          © {currentYear} {t('rights')}
        </p>

      </div>
    </footer>
  )
}
