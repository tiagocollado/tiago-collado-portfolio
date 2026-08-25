'use client'

import { useTranslations } from 'next-intl'
import { Mail, MessageCircle } from 'lucide-react'
import FadeInSection from '../ui/FadeInSection'
import SplitText from '../ui/SplitText'
import { useCursor } from '@/hooks/useCursor'

const EMAIL = 'tiago.collado@gmail.com'
const WHATSAPP_URL = 'https://wa.link/9tvuws'

export default function Contact() {
  const t = useTranslations('contact')
  const { setVariant } = useCursor()

  return (
    <section id="contact" className="py-20 md:py-28 lg:py-36 px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
      <div className="flex flex-col items-center max-w-3xl mx-auto">

        <FadeInSection>
          {/* Label */}
          <p
            className="text-xs font-mono tracking-[0.2em] uppercase mb-6 text-center"
            style={{ color: 'var(--color-accent)' }}
          >
            {t('label')}
          </p>

          {/* Title con SplitText char reveal cuando entra al viewport. */}
          <SplitText
            as="h2"
            text={t('title')}
            stagger={0.02}
            delay={0.1}
            yFrom={20}
            blurFrom={4}
            duration={0.6}
            whileInView
            className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight text-center block text-(--ink-primary)"
          />

          {/* Body */}
          <p
            className="text-base md:text-lg leading-relaxed text-center mt-6 max-w-prose mx-auto"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {t('body')}
          </p>

          {/* CTAs — pills más compactas con glow pulse en hover.
              `cta-glow-pulse` se define en globals.css y aplica un
              box-shadow animado sobre el `--color-accent` (radio respira). */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            {/* Email */}
            <a
              href={`mailto:${EMAIL}`}
              onMouseEnter={() => setVariant('link')}
              onMouseLeave={() => setVariant('default')}
              className="cta-glow-pulse group flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 hover:-translate-y-1 hover:border-accent"
              style={{
                borderColor: 'var(--border-strong)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <Mail className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
              <span className="font-medium text-sm md:text-base" style={{ color: 'var(--ink-primary)' }}>
                {EMAIL}
              </span>
            </a>

            {/* WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setVariant('link')}
              onMouseLeave={() => setVariant('default')}
              className="cta-glow-pulse group flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: '#FFFFFF',
              }}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium text-sm md:text-base">
                WhatsApp
              </span>
            </a>
          </div>
        </FadeInSection>

      </div>
    </section>
  )
}