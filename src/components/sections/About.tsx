'use client'

/**
 * About — versión 4.0 (rebranding Gotya)
 * --------------------------------------
 *  Estructura tomada de la referencia POSTA (public/images/references):
 *   1. Fila de micro-labels: "SOBRE GOTYA" a la izquierda, ubicación a la
 *      derecha. Marca los bordes de la sección y da el respiro superior.
 *   2. Claim display grande, alineado a la izquierda, con dos fragmentos en
 *      bold. La mezcla de pesos es lo que le da ritmo a la frase.
 *   3. Mucho aire.
 *   4. Bloque de copy chico, alineado a la DERECHA, cerrado por el remate
 *      de marca en bold y una byline mono debajo. La asimetría (claim izq /
 *      copy der) es el gesto editorial de la referencia.
 *
 *  El claim viaja partido en 4 keys de i18n (claim_1..claim_4) en vez de
 *  meter HTML dentro del string: las pares van en bold. Así se traduce sin
 *  romper el markup.
 *
 *  Heurísticas: Miller (2 párrafos, no 4), Estética-Usabilidad (aire y menos
 *  cromo), Proximidad (label + claim arriba, copy + firma abajo).
 */

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

export default function About() {
  const t = useTranslations('about')

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="pt-16 md:pt-20 lg:pt-28 pb-8 md:pb-10 lg:pb-12 px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32"
    >
      <div className="max-w-7xl mx-auto">

        {/* 1 · Fila de micro-labels */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-start justify-between gap-6"
        >
          <h2
            id="about-heading"
            className="text-xs font-mono tracking-[0.2em] uppercase"
            style={{ color: 'var(--color-accent)' }}
          >
            {t('title')}
          </h2>
          <p
            className="text-xs font-mono tracking-[0.2em] uppercase text-right"
            style={{ color: 'var(--ink-muted)' }}
          >
            {t('based')}
          </p>
        </motion.div>

        {/* 2 · Claim — los fragmentos pares van en bold */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight max-w-4xl mt-12 md:mt-16 lg:mt-20 text-pretty"
          style={{ color: 'var(--ink-primary)' }}
        >
          {/* Los separadores son espacio duro (\u00a0), no espacio normal.
              En ES esas uniones son "el diseño" y "al negocio": un quiebre
              de línea ahí dejaría el artículo colgando solo al final del
              renglón. El CSS no sabe de gramática — text-balance corta por
              largo de línea y rompería justo ahí — así que el corte bueno se
              fija a mano y aguanta cualquier ancho de pantalla. */}
          {t('claim_1')}{'\u00a0'}
          <strong className="font-semibold">{t('claim_2')}</strong>{' '}
          {t('claim_3')}{'\u00a0'}
          <strong className="font-semibold">{t('claim_4')}</strong>
        </motion.p>

        {/* 4 · Copy + firma, empujados a la derecha */}
        <div className="flex justify-end mt-16 md:mt-20 lg:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="max-w-xl space-y-6 md:text-right"
          >
            <p
              className="text-base md:text-lg leading-relaxed text-pretty"
              style={{ color: 'var(--ink-secondary)' }}
            >
              {t('body_1')}
            </p>
            <p
              className="text-base md:text-lg leading-relaxed text-pretty"
              style={{ color: 'var(--ink-secondary)' }}
            >
              {t('body_2')}
            </p>
            {/* Remate + byline. El remate cierra la sección y es la última
                palabra visual; "by Tiago Collado" baja a una línea mono
                chica, para no perder la firma de marca (CLAUDE.md 5). */}
            <div className="pt-2">
              <p
                className="font-display text-xl md:text-2xl font-semibold"
                style={{ color: 'var(--ink-primary)' }}
              >
                {t('signature')}
              </p>
              <p
                className="text-xs font-mono tracking-[0.2em] uppercase mt-3"
                style={{ color: 'var(--ink-muted)' }}
              >
                {t('byline')}
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
