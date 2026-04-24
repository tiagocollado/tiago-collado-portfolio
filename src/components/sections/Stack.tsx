'use client'

import { useTranslations } from 'next-intl'
import { stack } from '@/data/stack'
import FadeInSection from '../ui/FadeInSection'

export default function Stack() {
  const t = useTranslations('stack')

  const visibleStack = stack.filter(item => item.showInCarousel)
  const stackLoop = [...visibleStack, ...visibleStack]

  return (
    <section className="py-20 md:py-28 lg:py-36 px-0 md:px-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <FadeInSection>
          <div className="max-w-3xl">
            <p
              className="text-xs font-mono tracking-[0.2em] uppercase mb-5"
              style={{ color: 'var(--color-accent)' }}
            >
              STACK
            </p>
            <h2
              className="font-display text-4xl md:text-5xl font-semibold tracking-tight leading-tight"
              style={{ color: 'var(--ink-primary)' }}
            >
              {t('title')}
            </h2>
          </div>
        </FadeInSection>
      </div>

      {/* Carrusel full-bleed */}
      <div className="relative mt-16">
        <div
          className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--bg-primary), transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--bg-primary), transparent)' }}
        />

        <div className="carousel-container">
          <div className="carousel-track">
            {stackLoop.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="carousel-item flex items-center gap-3 px-5 py-3 md:px-6 md:py-4 rounded-full border transition-all duration-300 hover:-translate-y-1 hover:border-accent"
                style={{
                  borderColor: 'var(--border-default)',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                  aria-hidden
                />
                <span
                  className="font-medium text-sm md:text-base whitespace-nowrap"
                  style={{ color: 'var(--ink-primary)' }}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .carousel-container {
          width: 100%;
          overflow: hidden;
        }
        .carousel-track {
          display: flex;
          gap: 0.875rem;
          animation: scroll 45s linear infinite;
          width: max-content;
        }
        .carousel-track:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .carousel-track { animation: none; }
        }
      `}</style>
    </section>
  )
}
