'use client'

import { useTranslations } from 'next-intl'
import { stack } from '@/data/stack'

export default function Stack() {
  const t = useTranslations('stack')
  
  // Solo las que tienen showInCarousel: true
  const visibleStack = stack.filter(item => item.showInCarousel)
  
  // Duplicamos el array para el efecto infinito
  const stackLoop = [...visibleStack, ...visibleStack]

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-16 text-center" style={{ color: 'var(--ink-primary)' }}>
          {t('title')}
        </h2>

        <div className="relative">
          {/* Gradientes en los bordes para efecto fade */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{
            background: 'linear-gradient(to right, var(--bg-primary), transparent)'
          }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{
            background: 'linear-gradient(to left, var(--bg-primary), transparent)'
          }} />

          {/* Carrusel */}
          <div className="carousel-container">
            <div className="carousel-track">
              {stackLoop.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="carousel-item px-6 py-4 rounded-lg border"
                  style={{
                    borderColor: 'var(--border-default)',
                    backgroundColor: 'var(--bg-secondary)',
                  }}
                >
                  <span className="font-medium text-sm whitespace-nowrap" style={{ color: 'var(--ink-primary)' }}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
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
          gap: 1rem;
          animation: scroll 40s linear infinite;
          width: fit-content;
        }
        
        .carousel-track:hover {
          animation-play-state: paused;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .carousel-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}