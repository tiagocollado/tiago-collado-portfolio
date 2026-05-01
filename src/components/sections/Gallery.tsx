'use client'

/**
 * Gallery
 * -------
 * Carrusel horizontal para las imágenes del caso de estudio.
 * Usa Embla (headless, ~10kb) + Framer Motion para transiciones.
 *
 * Recibe un arreglo de paths (ver `Project.gallery` en types).
 * Si está vacío, no renderiza nada.
 */

import { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface GalleryProps {
  slug: string
  images: string[]
}

export default function Gallery({ slug, images }: GalleryProps) {
  const t = useTranslations('case_study')

  // Embla config: un slide por vista, arrastrable, con loop si hay ≥2 imágenes.
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: images.length > 1,
    align: 'center',
    containScroll: 'trimSnaps',
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  // Sincronizar estado local con el API de Embla.
  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setCanPrev(emblaApi.canScrollPrev())
      setCanNext(emblaApi.canScrollNext())
    }

    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi])

  if (!images || images.length === 0) return null

  const hasMultiple = images.length > 1

  return (
    <section className="px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 mt-20 md:mt-28 lg:mt-36">
      <div className="max-w-6xl mx-auto">

        {/* Header: label + título + contador */}
        <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <p
              className="text-xs font-mono tracking-[0.2em] uppercase mb-5"
              style={{ color: 'var(--color-accent)' }}
            >
              05 · GALERÍA
            </p>
            <h2
              className="font-display text-3xl md:text-4xl font-semibold tracking-tight"
              style={{ color: 'var(--ink-primary)' }}
            >
              {t('gallery_title')}
            </h2>
          </div>

          {/* Contador 01 / 05 */}
          {hasMultiple && (
            <div
              className="font-mono text-sm tracking-wider hidden md:block"
              style={{ color: 'var(--ink-muted)' }}
            >
              <span style={{ color: 'var(--ink-primary)' }}>
                {String(selectedIndex + 1).padStart(2, '0')}
              </span>
              <span className="mx-2">/</span>
              <span>{String(images.length).padStart(2, '0')}</span>
            </div>
          )}
        </div>

        {/* Viewport de Embla */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            {/* Track: grid horizontal de slides */}
            <div className="flex">
              {images.map((src, index) => (
                <div
                  key={src}
                  className="relative flex-[0_0_100%] min-w-0"
                  style={{ aspectRatio: '16/10', backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <AnimatePresence mode="wait">
                    {selectedIndex === index && (
                      <motion.img
                        key={src}
                        src={src}
                        alt={`${slug.replace(/-/g, ' ')} — ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                  </AnimatePresence>
                  {/* Imagen "base" debajo del motion para slides no-activos (evita flash durante el drag) */}
                  {selectedIndex !== index && (
                    <img
                      src={src}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Controles prev/next — solo si hay más de una imagen */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canPrev}
                aria-label="Imagen anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md border transition-all duration-300 hover:-translate-y-[calc(50%+2px)] disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--bg-primary) 80%, transparent)',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--ink-primary)',
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={!canNext}
                aria-label="Imagen siguiente"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md border transition-all duration-300 hover:-translate-y-[calc(50%+2px)] disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--bg-primary) 80%, transparent)',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--ink-primary)',
                }}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {hasMultiple && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Ir a imagen ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === selectedIndex ? '32px' : '8px',
                  backgroundColor: i === selectedIndex
                    ? 'var(--color-accent)'
                    : 'var(--border-strong)',
                }}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
