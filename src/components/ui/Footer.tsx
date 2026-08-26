'use client'

/**
 * Footer — versión 3.1 (redesign G1 + D1, referencia isadeburgh)
 * --------------------------------------------------------------
 *  Ya no es "una sección más y después el footer": Contact no cierra su
 *  padding inferior y este bloque arranca pegado, así los dos se leen como
 *  un único cierre de página. Sigue siendo un componente aparte de Contact
 *  para no scopear el `<footer>` dentro de un `<section>`.
 *
 *  ⚠️ El `role="contentinfo"` de abajo es OBLIGATORIO, no redundante.
 *  Un `<footer>` sólo mapea a ese landmark cuando NO es descendiente de
 *  `article`/`aside`/`main`/`nav`/`section`, y `layout.tsx` envuelve todo
 *  en `<main className="pt-16">`. Es decir: el mapeo implícito acá no
 *  ocurre, y un `role` explícito siempre le gana al implícito. Durante un
 *  tiempo el comentario de este archivo afirmaba que el landmark existía
 *  "por ser hijo directo del body" — era falso, y no lo detecta ningún
 *  build ni linter. Si algún día el footer sale de `<main>`, el atributo
 *  pasa a ser redundante pero sigue siendo correcto.
 *
 *  Es una sola barra de tres zonas: copyright · back-to-top · crédito.
 *  El back-to-top muestra dos flechas apiladas que suben en loop mientras
 *  el mouse está encima.
 *  Proximidad — cada cosa en su zona, no todas apiladas al centro como en
 *  el footer viejo.
 *
 *  Se fue el divider de 96px del footer viejo: el `border-t` de la barra ya
 *  marca el corte, así que una línea más era cromo repetido
 *  (Estética-Usabilidad).
 *
 *  ⚠️ Back-to-top: es un `<a href="#top">`, NO un `window.scrollTo`. El
 *  SmoothScrollProvider monta Lenis con `anchors: true`, así que Lenis
 *  intercepta el click y hace el scroll suave él mismo — un scrollTo por JS
 *  pelearía contra su animación. Y cuando Lenis no existe
 *  (prefers-reduced-motion), degrada solo a un salto nativo instantáneo,
 *  que es exactamente lo que corresponde.
 *
 *  ⚠️ El `id="top"` NO es opcional: toda página que renderee este footer
 *  tiene que tenerlo, o el back-to-top queda muerto (el ancla no existe y
 *  el click no hace nada, sin ningún error visible). Hoy vive en el
 *  <section> del Hero (home) y en el div raíz del case study.
 */

import { useTranslations } from 'next-intl'
import { motion, type Variants } from 'framer-motion'
import { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useCursor } from '@/hooks/useCursor'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * `staggerChildren` solo alcanza a hijos motion DIRECTOS — con wrappers de
 * layout en el medio no propaga (CLAUDE.md 9.7). El footer viejo tenía ese
 * bug: el stagger llegaba al div contenedor y sus hijos aparecían todos
 * juntos. Acá cada hijo calcula su delay a mano.
 */
const fadeUp = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay },
  },
})

export default function Footer() {
  const t = useTranslations('footer')
  const { setVariant } = useCursor()
  const [hovered, setHovered] = useState(false)

  const onEnter = () => setVariant('link')
  const onLeave = () => setVariant('default')

  return (
    <motion.footer
      // Explícito y no heredado: ver la nota del docblock. Sin este atributo
      // el elemento no expone landmark alguno, porque `layout.tsx` lo deja
      // dentro de `<main>`.
      role="contentinfo"
      // El `pt` grande es el aire que separa de los canales de Contact: la
      // separación la da el espacio, no una línea de borde arriba.
      className="pt-16 md:pt-20 pb-10 md:pb-12 px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {/* Barra de tres zonas, con DOS layouts.

          Mobile — grilla de 2 columnas: copyright y crédito apilados a la
          izquierda, back-to-top a la derecha abarcando las dos filas
          (`row-span-2`) y centrado contra ellas. Antes los tres hijos se
          apilaban en una sola columna y el botón quedaba huérfano en la
          fila del medio. Las posiciones van explícitas (`col-start` /
          `row-start`) porque el orden del DOM es copyright → botón →
          crédito, y el auto-placement pondría el crédito arriba a la
          derecha en vez de abajo a la izquierda.

          sm+ — vuelve a la grilla de 3 columnas para que el back-to-top
          quede centrado respecto del ancho total, y no "al lado" del
          copyright. Cada hijo resetea su posición con `sm:*-auto`. */}
      <div
        className="max-w-7xl mx-auto grid grid-cols-[1fr_auto] gap-x-6 gap-y-3 sm:grid-cols-3 sm:gap-6 items-center pt-8 border-t"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <motion.p
          variants={fadeUp(0)}
          className="col-start-1 row-start-1 sm:col-start-auto sm:row-start-auto text-[11px] font-mono uppercase tracking-[0.18em]"
          style={{ color: 'var(--ink-muted)' }}
        >
          © 2026 Copyright Gotya
        </motion.p>

        {/* Back-to-top — patrón conocido (Jakob).

            Se ven DOS flechas apiladas y, mientras hay hover, suben en
            loop continuo. La técnica es la misma del MarqueeLink: el track
            tiene 4 flechas idénticas y la ventana muestra 2 (h-7 = 2 × 14px).
            Animar `y` de 0% a -25% desplaza exactamente una flecha (25% de
            56px), así que al reiniciar el ciclo la imagen es idéntica y el
            salto no se ve. Sin hover vuelve a 0% y quedan quietas.

            El `reducedMotion="user"` global del layout desactiva este loop
            solo para quien lo pidió a nivel sistema. */}
        {/* En mobile va en la columna derecha, abarcando las dos filas de
            texto: la mitad derecha es la zona de menor costo motor para el
            pulgar (Fitts / thumb zone). Desde sm+ vuelve a ser una celda
            normal de la grilla de 3 y se centra. */}
        <motion.div
          variants={fadeUp(0.1)}
          className="col-start-2 row-start-1 row-span-2 sm:col-start-auto sm:row-start-auto sm:row-span-1 flex items-center justify-end sm:justify-center"
        >
          <a
            href="#top"
            aria-label={t('back_to_top')}
            onMouseEnter={() => {
              onEnter()
              setHovered(true)
            }}
            onMouseLeave={() => {
              onLeave()
              setHovered(false)
            }}
            className="group inline-flex items-center justify-center w-12 h-12 rounded-full border transition-colors duration-300 border-(--border-strong) text-(--ink-secondary) hover:border-accent hover:text-accent"
          >
            <span aria-hidden className="relative h-7 w-3.5 overflow-hidden">
              <motion.span
                className="absolute inset-x-0 top-0 flex flex-col"
                animate={hovered ? { y: ['0%', '-25%'] } : { y: '0%' }}
                transition={
                  hovered
                    ? { duration: 0.7, ease: 'linear', repeat: Infinity }
                    : { duration: 0.3, ease: EASE }
                }
              >
                <ArrowUp className="w-3.5 h-3.5 shrink-0" />
                <ArrowUp className="w-3.5 h-3.5 shrink-0" />
                <ArrowUp className="w-3.5 h-3.5 shrink-0" />
                <ArrowUp className="w-3.5 h-3.5 shrink-0" />
              </motion.span>
            </span>
          </a>
        </motion.div>

        <motion.p
          variants={fadeUp(0.2)}
          className="col-start-1 row-start-2 sm:col-start-auto sm:row-start-auto text-[11px] font-mono uppercase tracking-[0.18em] sm:text-right"
          style={{ color: 'var(--ink-muted)' }}
        >
          {t('credit')}
        </motion.p>
      </div>
    </motion.footer>
  )
}
