'use client'

import { useTranslations } from 'next-intl'
import { Mail, MessageCircle } from 'lucide-react'
import FadeInSection from '../ui/FadeInSection'

const EMAIL = 'tiago.collado@gmail.com'
const WHATSAPP_URL = 'https://wa.link/9tvuws'

export default function Contact() {
  const t = useTranslations('contact')

  return (
    <section id="contact" className="py-20 md:py-28 lg:py-36 px-6 md:px-10">
      <div className="flex flex-col items-center max-w-4xl mx-auto">

        <FadeInSection>
          {/* Label */}
          <p
            className="text-xs font-mono tracking-[0.2em] uppercase mb-8 text-center"
            style={{ color: 'var(--color-accent)' }}
          >
            {t('label')}
          </p>

          {/* Title */}
          <h2
            className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-tight text-center"
            style={{ color: 'var(--ink-primary)' }}
          >
            {t('title')}
          </h2>

          {/* Body */}
          <p
            className="text-lg md:text-xl leading-relaxed text-center mt-8 max-w-prose mx-auto"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {t('body')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
            {/* Email */}
            <a
              href={`mailto:${EMAIL}`}
              className="group flex items-center gap-4 px-12 py-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-2 hover:border-accent hover:shadow-xl w-full sm:w-auto min-w-[320px]"
              style={{
                borderColor: 'var(--border-default)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <Mail className="w-6 h-6" style={{ color: 'var(--color-accent)' }} />
              </div>
              <span className="font-semibold text-xl pr-2" style={{ color: 'var(--ink-primary)' }}>
                {EMAIL}
              </span>
            </a>

            {/* WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-12 py-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl w-full sm:w-auto min-w-[320px]"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: '#FFFFFF',
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="font-semibold text-xl">
                WhatsApp
              </span>
            </a>
          </div>
        </FadeInSection>

      </div>
    </section>
  )
}