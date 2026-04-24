'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import FadeInSection from '../ui/FadeInSection'

const EMAIL = 'tiago.collado@gmail.com'
// TODO: reemplazar con tu link real de wa.link o wa.me
// Formato wa.me: https://wa.me/549XXXXXXXXXX (sin signos, con código de país)
const WHATSAPP_URL = 'https://wa.link/tiagocollado'

export default function Contact() {
  const t = useTranslations('contact')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // Fallback silencioso
    }
  }

  return (
    <section id="contact" className="py-28 md:py-40 px-6 md:px-10">
      <div className="max-w-3xl mx-auto">

        <FadeInSection>
          {/* Label eyebrow */}
          <p
            className="text-xs font-mono tracking-[0.2em] uppercase mb-6"
            style={{ color: 'var(--color-accent)' }}
          >
            {t('label')}
          </p>

          {/* Heading display */}
          <h2
            className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-8 leading-tight"
            style={{ color: 'var(--ink-primary)' }}
          >
            {t('title')}
          </h2>

          {/* Body — copy cálido */}
          <p
            className="text-lg md:text-xl leading-relaxed mb-14 md:mb-16 max-w-2xl"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {t('body')}
          </p>

          {/* Bloque de contacto: email + whatsapp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 mb-12">

            {/* Email card */}
            <div
              className="p-6 rounded-card border flex flex-col gap-4"
              style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-secondary)' }}
            >
              <p
                className="text-xs font-mono tracking-widest uppercase"
                style={{ color: 'var(--ink-muted)' }}
              >
                {t('email_label')}
              </p>

              <a
                href={`mailto:${EMAIL}`}
                className="font-display text-base md:text-lg font-semibold tracking-tight break-all transition-opacity duration-200 hover:opacity-75"
                style={{ color: 'var(--color-accent)' }}
              >
                {EMAIL}
              </a>

              <button
                onClick={handleCopy}
                aria-label={t('copy_email')}
                className="self-start inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-medium transition-all duration-200 hover:-translate-y-px"
                style={{
                  borderColor: 'var(--border-strong)',
                  color: copied ? 'var(--color-accent)' : 'var(--ink-secondary)',
                  backgroundColor: 'transparent',
                }}
              >
                {copied
                  ? <><Check size={13} strokeWidth={2} /> {t('copied')}</>
                  : <><Copy size={13} strokeWidth={1.75} /> {t('copy_email')}</>
                }
              </button>
            </div>

            {/* WhatsApp card */}
            <div
              className="p-6 rounded-card border flex flex-col gap-4"
              style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-secondary)' }}
            >
              <p
                className="text-xs font-mono tracking-widest uppercase"
                style={{ color: 'var(--ink-muted)' }}
              >
                {t('whatsapp_label')}
              </p>

              <p
                className="font-display text-base md:text-lg font-semibold tracking-tight"
                style={{ color: 'var(--ink-primary)' }}
              >
                {t('whatsapp_cta')}
              </p>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:-translate-y-px"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: '#FFFFFF',
                }}
              >
                WhatsApp <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          {/* Ubicación — detalle pequeño al final */}
          <div
            className="flex items-center gap-3 text-xs font-mono tracking-wide pt-8 border-t"
            style={{ color: 'var(--ink-muted)', borderColor: 'var(--border-default)' }}
          >
            <span className="uppercase tracking-[0.18em]">{t('location_label')}</span>
            <span style={{ color: 'var(--ink-secondary)' }}>·</span>
            <span>{t('location')}</span>
          </div>
        </FadeInSection>

      </div>
    </section>
  )
}
