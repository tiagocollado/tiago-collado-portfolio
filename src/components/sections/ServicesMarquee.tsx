'use client'

import { useTranslations } from 'next-intl'

/**
 * ServicesMarquee — divider editorial entre Hero y Projects.
 *
 * Marquee horizontal full-bleed con los servicios que ofrece Tiago,
 * separados por `+` accent terracota.
 *
 * Comportamiento simple: loop infinito hacia la IZQUIERDA a velocidad
 * constante. CSS keyframes (mismo pattern que el Stack carousel) — más
 * liviano que un Framer rAF y sin estado interno. Hover pausa el loop.
 *
 * Estilo cinemático: fondo invertido respecto al page (en light mode
 * queda negro con texto crema; en dark queda crema con texto negro).
 * Eso lo separa visualmente del resto y crea un "bloque" claro entre
 * Hero y Projects, sin necesitar borders ni gradientes auxiliares.
 *
 * `prefers-reduced-motion` se respeta vía la regla CSS global de
 * globals.css que neutraliza animations a 0.01ms, dejando el marquee
 * estático.
 */
export default function ServicesMarquee() {
  const t = useTranslations('services')
  const items: string[] = t.raw('items')

  return (
    <section
      aria-label={t('label')}
      className="relative overflow-hidden py-8 md:py-10 lg:py-12"
      style={{
        // Bg invertido respecto al page: en light queda dark, en dark
        // queda light. Texto al revés via CSS vars.
        backgroundColor: 'var(--ink-primary)',
        color: 'var(--bg-primary)',
      }}
    >
      <div
        className="services-marquee-track flex whitespace-nowrap font-display font-semibold tracking-tight text-2xl md:text-4xl lg:text-5xl"
        aria-hidden="true"
      >
        {/* 2 copias idénticas — el keyframe translada de 0 a -50% para que
            el reset visual sea invisible (la 2da copia toma el lugar de
            la 1ra). */}
        {[0, 1].map((copy) => (
          <span key={copy} className="flex items-center shrink-0">
            {items.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center shrink-0">
                <span className="px-6 md:px-8 lg:px-10">{item}</span>
                <span
                  aria-hidden
                  style={{ color: 'var(--color-accent)' }}
                >
                  •
                </span>
              </span>
            ))}
          </span>
        ))}
      </div>

      <style jsx>{`
        .services-marquee-track {
          width: max-content;
          animation: services-marquee 40s linear infinite;
        }
        @keyframes services-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .services-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
