'use client'

/**
 * Contact — versión 3.0 (redesign G1, referencia isadeburgh)
 * ----------------------------------------------------------
 *  Contact y Footer dejan de ser dos secciones separadas y pasan a leerse
 *  como UN bloque de cierre: acá no hay `border-t` ni padding inferior y el
 *  Footer arranca pegado, con la barra de copyright. Siguen siendo dos
 *  componentes porque `<footer>` tiene que ser hijo directo del body para
 *  contar como landmark `contentinfo` — si lo anidara acá adentro perdería
 *  ese rol de accesibilidad. La costura visual, que es lo que importaba,
 *  no existe.
 *
 *  Estructura:
 *   1. Micro-label de sección.
 *   2. Pregunta corta. SIN párrafo de body: quien llega acá ya hizo click
 *      en "Hablemos", o sea que viene con intención. No hay que volver a
 *      venderle.
 *   3. Micro-label EMAIL + el mail en MONO grande + botón copiar.
 *   4. Los cuatro canales en una fila.
 *
 *  Por qué el mail va en mono: la referencia lo pone en serif para
 *  contrastar contra el sans de todo el resto. No tenemos serif en el stack
 *  (y F3 sigue pendiente), pero sí Geist Mono — y una dirección de mail en
 *  monoespaciada se lee natural, porque es literalmente un string técnico.
 *  Mismo gesto de contraste, con la tipografía que ya tenemos.
 *
 *  Por qué el botón copiar: `mailto:` no le sirve a nadie que use webmail —
 *  el click no abre nada y el contacto se pierde. Copiar al portapapeles es
 *  el patrón que la gente ya espera (Jakob) y cubre ese caso.
 */

import { useTranslations } from 'next-intl'
import { motion, type Variants } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import SplitText from '../ui/SplitText'
import MagneticLink from '../ui/MagneticLink'
import { useCursor } from '@/hooks/useCursor'

const EASE = [0.16, 1, 0.3, 1] as const

const EMAIL = 'tiago.collado@gmail.com'

/**
 * Canales de contacto. `download` cambia el glifo a ↓ porque bajar un
 * archivo y navegar a otro sitio no son la misma acción.
 * "LinkedIn"/"GitHub"/"WhatsApp" son nombres propios: no van por i18n.
 */
const CHANNELS = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/tiagocollado/', download: false },
  { id: 'github',   label: 'GitHub',   href: 'https://github.com/tiagocollado',           download: false },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.link/9tvuws',                    download: false },
  { id: 'cv',       label: null,       href: '/cv-tiago-collado.pdf',                     download: true  },
] as const

/**
 * `staggerChildren` solo alcanza a hijos motion DIRECTOS: con wrappers de
 * layout en el medio no propaga (CLAUDE.md 9.7). Cada bloque lleva su delay
 * calculado a mano en vez de confiar en el stagger del padre.
 */
const fadeUp = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay },
  },
})

export default function Contact() {
  const t = useTranslations('contact')
  const { setVariant } = useCursor()
  const [copied, setCopied] = useState(false)

  // Guardamos el timeout para poder cancelarlo si el componente se
  // desmonta antes de los 2s — si no, React avisa que seteamos estado
  // sobre un componente que ya no existe.
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
  }, [])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      if (resetTimer.current) clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // El portapapeles puede estar bloqueado (contexto no seguro, permisos
      // denegados). No mostramos error: el mail queda visible en pantalla y
      // el link `mailto:` de al lado sigue funcionando igual.
    }
  }

  return (
    <motion.section
      id="contact"
      aria-labelledby="contact-heading"
      // Sin padding inferior: el Footer arranca pegado y los dos forman un
      // solo bloque de cierre.
      className="pt-20 md:pt-24 lg:pt-28 px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <div className="max-w-7xl mx-auto">

        {/* 1 · Micro-label de sección */}
        <motion.p
          variants={fadeUp(0)}
          className="text-xs font-mono tracking-[0.2em] uppercase"
          style={{ color: 'var(--color-accent)' }}
        >
          {t('label')}
        </motion.p>

        {/* 2 · Statement — el h2 semántico de la sección */}
        <SplitText
          as="h2"
          id="contact-heading"
          text={t('title')}
          stagger={0.02}
          delay={0.15}
          yFrom={20}
          blurFrom={4}
          duration={0.6}
          whileInView
          className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight block mt-10 md:mt-12 lg:mt-16 text-(--ink-primary)"
        />

        {/* 3 · Email — micro-label, dirección en mono grande, botón copiar */}
        <motion.div variants={fadeUp(0.25)} className="mt-12 md:mt-16">
          <p
            className="text-xs font-mono tracking-[0.2em] uppercase"
            style={{ color: 'var(--ink-muted)' }}
          >
            {t('email_label')}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-4">
            {/* Iman apenas perceptible. El factor solo no alcanza: el
                desplazamiento del hook es la distancia al centro por el
                factor, asi que en un elemento ancho como este el texto
                terminaba deslizandose decenas de px. `max` le pone un
                tope duro de 6px y el efecto queda como un guino. */}
            <MagneticLink
              href={`mailto:${EMAIL}`}
              factor={0.08}
              max={6}
              className="group relative inline-block font-mono text-xl md:text-3xl lg:text-4xl tracking-tight break-all md:break-normal transition-colors duration-300 text-(--ink-primary) hover:text-accent"
            >
              {EMAIL}
              {/* Underline que se dibuja de izquierda a derecha en hover. Va
                  como elemento aparte (y no `text-decoration`) para animar el
                  trazo con transform, que es lo que el navegador compone
                  barato. */}
              <span
                aria-hidden
                className="absolute left-0 -bottom-1 md:-bottom-2 h-px md:h-0.5 w-full origin-left scale-x-0 transition-transform duration-500 ease-expo-out group-hover:scale-x-100"
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
            </MagneticLink>

            {/* Botón copiar.
                - `cursor-pointer` explicito: un <button> NO trae la manito
                  por defecto (solo los <a href> la traen), y el sitio no
                  oculta el cursor nativo, asi que sin esto sale la flecha.
                - El relleno SUBE desde abajo en hover, como un vaso que se
                  llena. Va como <span> absoluto y NO como background-color
                  animado porque transform lo compone la GPU; animar el
                  color no. El ease-expo-out desacelera fuerte al final,
                  que es lo que le da la sensacion de liquido asentandose.
                - El texto lleva `relative`: al estar posicionado y venir
                  despues en el DOM, se pinta encima del relleno sin
                  necesidad de z-index ni stacking context.
                - `aria-live` anuncia el cambio a "copiado" sin mover foco. */}
            <button
              type="button"
              onClick={copyEmail}
              onMouseEnter={() => setVariant('link')}
              onMouseLeave={() => setVariant('default')}
              className={`group relative overflow-hidden cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-mono uppercase tracking-[0.18em] transition-colors duration-500 ${
                copied
                  ? 'border-accent text-white'
                  : 'border-(--border-strong) text-(--ink-secondary) hover:border-accent hover:text-white'
              }`}
            >
              <span
                aria-hidden
                className={`absolute inset-0 origin-bottom transition-transform duration-700 ease-expo-out ${
                  copied ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
                }`}
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
              <span className="relative" aria-live="polite">
                {copied ? t('copied') : t('copy')}
              </span>
              {copied ? (
                <Check className="relative w-3.5 h-3.5" aria-hidden />
              ) : (
                <Copy
                  className="relative w-3.5 h-3.5 transition-transform duration-300 ease-expo-out group-hover:-translate-y-0.5"
                  aria-hidden
                />
              )}
            </button>
          </div>
        </motion.div>

        {/* 4 · Canales — mismo tratamiento que los links del sidebar de los
            case studies, para no inventar un patrón nuevo. */}
        <motion.div
          variants={fadeUp(0.35)}
          className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-10 md:mt-12"
        >
          {CHANNELS.map((channel) => (
            <a
              key={channel.id}
              href={channel.href}
              {...(channel.download
                ? { download: true }
                : { target: '_blank', rel: 'noopener noreferrer' })}
              onMouseEnter={() => setVariant('link')}
              onMouseLeave={() => setVariant('default')}
              className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] transition-colors duration-300 text-(--ink-secondary) hover:text-accent"
            >
              <span>{channel.label ?? t('download_cv')}</span>
              <span
                aria-hidden
                className={`inline-block transition-transform duration-300 ease-expo-out ${
                  channel.download
                    ? 'group-hover:translate-y-1'
                    : 'group-hover:translate-x-1 group-hover:-translate-y-1'
                }`}
                style={{ color: 'var(--color-accent)' }}
              >
                {channel.download ? '↓' : '↗'}
              </span>
            </a>
          ))}
        </motion.div>

      </div>
    </motion.section>
  )
}
