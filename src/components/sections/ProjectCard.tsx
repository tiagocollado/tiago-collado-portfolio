'use client'

/**
 * ProjectCard
 * -----------
 * Card de un proyecto. Se usa igual en la grilla del home y en /projects.
 *
 * Comportamiento (referencia: Studio Dizzy / Voltfang, mikekus):
 *  - REPOSO: solo la imagen del cover, a sangre. CERO texto encima.
 *  - HOVER:  el lavado terracota BARRE de izquierda a derecha y después
 *            aparecen nombre (arriba izq) + "VER PROYECTO" (abajo izq) +
 *            categoría (abajo der) + escuadras en las 4 esquinas.
 *  - TÁCTIL: no hay hover, así que no hay lavado. El nombre y la categoría
 *            van DEBAJO de la card, como texto normal.
 */

import { Project, Locale } from '@/types'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCursor } from '@/hooks/useCursor'

interface ProjectCardProps {
  project: Project
  locale: Locale
  /**
   * Posición global en la grilla (0-based). Hace dos cosas:
   *  - delay incremental del reveal scroll-driven (stagger).
   *  - `order` CSS, que es lo que arregla el orden de lectura en mobile.
   */
  index?: number
}

/**
 * Blanco de marca para el texto que va ENCIMA del lavado.
 *
 * Va fijo y no `--ink-primary` a propósito: el lavado es oscuro en los dos
 * temas, así que el texto encima también tiene que ser claro en los dos. Usar
 * el token lo dejaría negro sobre fondo oscuro en tema claro — invisible.
 */
const OVERLAY_INK = '#F0EDE8'

/**
 * Clases de `order`, escritas como literales para que Tailwind las encuentre
 * al escanear el archivo. Construirlas dinámicamente NO funciona: el scanner
 * lee texto, no evalúa JS, y esas clases nunca se generarían.
 */
const ORDER_CLASSES = ['order-1', 'order-2', 'order-3', 'order-4', 'order-5', 'order-6', 'order-7']

export default function ProjectCard({ project, locale, index = 0 }: ProjectCardProps) {
  const t = useTranslations('projects')
  const { setVariant } = useCursor()

  /*
   * Forma de la card: su propio aspect-ratio y nada más. No hay `row-span` ni
   * alturas de fila — la grilla es masonry (dos columnas que fluyen por
   * separado), así que cada card decide su alto y las columnas terminan a
   * distinta altura. Eso es lo que la hace masonry y no una grilla alineada.
   */
  const shapeClasses = project.cardShape === 'square' ? 'aspect-square' : 'aspect-[4/3]'

  /*
   * `sizes` le dice al browser cuánto espacio va a ocupar la imagen ANTES de
   * conocer el ancho real, y con eso elige cuál bajar del srcset que genera
   * next/image. Sin este valor el browser asume 100vw y baja siempre el
   * archivo más grande — justo el problema que la migración venía a resolver.
   *
   * Un solo valor para las dos formas: `wide` y `square` cambian el ALTO, no
   * el ancho — las dos ocupan una columna del shell `max-w-7xl`.
   */
  const coverSizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px'

  /*
   * Categorías del servicio prestado. El nombre da la marca y esto da la
   * categoría ("Pulso Creativo" → "Diseño Web"). Van CATEGORÍAS y nunca
   * roles: la regla completa está en CLAUDE.md §7.
   */
  const servicesLabel = project.services[locale].join(' & ')

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      /*
       * El `order` arregla el orden de lectura en mobile. Las dos columnas
       * pasan a `display: contents` abajo de `md` (ver Projects.tsx), así que
       * las 4 cards se vuelven hijas directas del grid y este `order` las
       * ordena 1·2·3·4. Sin esto salían 1·3·2·4, que es el orden del DOM.
       *
       * En desktop no molesta: dentro de cada columna flex los valores ya
       * quedan en secuencia (1 antes que 3, 2 antes que 4).
       */
      className={ORDER_CLASSES[index] ?? ''}
    >
      {/* La card visual. El `group` va acá y no en el <article> para que el
          hover no se dispare desde el texto de abajo. */}
      <div
        onMouseEnter={() => setVariant('view')}
        onMouseLeave={() => setVariant('default')}
        className={`group relative isolate overflow-hidden rounded-2xl border
                    border-(--border-default) transition-all duration-500 ease-out
                    hover:-translate-y-2 hover:border-accent hover:shadow-2xl hover:shadow-accent/25
                    ${shapeClasses}`}
        style={{
          // Sin cover el fondo ES el color del lavado, para que la card se lea
          // como pieza terminada y no como un hueco.
          backgroundColor: project.coverImage
            ? 'var(--color-surface)'
            : 'color-mix(in srgb, var(--color-accent) 22%, #111110)',
        }}
      >
        {/* Link invisible que cubre toda la card. */}
        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="absolute inset-0 z-30"
          aria-label={`${project.title} — ${servicesLabel}. ${t('view_project')}`}
        />

        {/*
          Cover a sangre. En reposo va a color, al 100% y sin filtros.

          `isolate` no es decorativo: `mix-blend-mode` mezcla con todo lo que
          haya debajo en su stacking context, y sin aislar el lavado sangraría
          sobre el fondo de la página y sobre el borde de la card.
        */}
        {project.coverImage && (
          <div className="absolute inset-0 isolate overflow-hidden">
            <Image
              src={project.coverImage}
              alt=""
              fill
              sizes={coverSizes}
              className="scale-105 object-cover transition-transform duration-700 ease-out
                         group-hover:scale-100"
            />

            {/*
              El lavado, en dos capas, que BARREN de izquierda a derecha.

              El barrido es `scale-x` con `origin-left`, no un fade: entra como
              una cortina. Va por transform y no por `width` ni `clip-path`
              porque el transform lo resuelve el compositor y no dispara
              re-layout en cada frame.

              1. El tinte. `mix-blend-mode: color` toma hue y saturación de ESTA
                 capa y la luminosidad de la imagen: eso es un duotono. Por eso
                 el cover nunca se entrega ya duotonado desde Figma — se le
                 aplicaría dos veces.
              2. El oscurecedor al 70%, que garantiza que el texto blanco se
                 lea. El número está medido: sobre un área blanca pura —el peor
                 caso posible— da 6,06:1 contra #F0EDE8. Al 62% daba 4,54:1,
                 que pasa AA pero sin margen.
            */}
            <div
              className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform
                         duration-500 ease-out group-hover:scale-x-100"
              style={{ mixBlendMode: 'color' }}
            />
            <div
              className="absolute inset-0 origin-left scale-x-0 transition-transform
                         duration-500 ease-out group-hover:scale-x-100"
              style={{ backgroundColor: 'rgba(17, 17, 16, 0.70)' }}
            />
          </div>
        )}

        {/*
          Escuadras (marcas de corte) en las 4 esquinas. Entran desde afuera y
          se asientan: 4px de desplazamiento, lo justo para que se lea como que
          el marco encuadra la card y no como que aparece un adorno.

          Van a 12px del borde y el contenido a 32px, así el marco encierra al
          texto en vez de chocarlo. El `delay` las hace entrar DESPUÉS del
          barrido; al salir no hay delay, para que se vayan rápido.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity
                     duration-300 ease-out group-hover:opacity-100 group-hover:delay-300"
        >
          {[
            ['top-3 left-3', 'border-l-2 border-t-2', '-translate-x-1 -translate-y-1'],
            ['top-3 right-3', 'border-r-2 border-t-2', 'translate-x-1 -translate-y-1'],
            ['bottom-3 left-3', 'border-l-2 border-b-2', '-translate-x-1 translate-y-1'],
            ['bottom-3 right-3', 'border-r-2 border-b-2', 'translate-x-1 translate-y-1'],
          ].map(([pos, edges, offset]) => (
            <span
              key={pos}
              className={`absolute h-4 w-4 rounded-[2px] transition-transform duration-300 ease-out
                          group-hover:translate-x-0 group-hover:translate-y-0 group-hover:delay-300
                          ${pos} ${edges} ${offset}`}
              style={{ borderColor: 'rgba(240, 237, 232, 0.70)' }}
            />
          ))}
        </div>

        {/*
          Overlay de texto: nombre arriba-izquierda, "VER PROYECTO" abajo-
          izquierda, categoría abajo-derecha. Nada más.

          `(hover: none)` lo oculta por completo en táctil. Antes quedaba fijo
          ahí y se veía como si la card estuviera siempre en hover: el lavado
          tapaba el cover, que es justo lo que la card quiere mostrar. En esos
          dispositivos el nombre va debajo, fuera de la imagen.
        */}
        <div
          className="pointer-events-none absolute inset-0 z-10 p-8 opacity-0 transition-opacity
                     duration-300 ease-out group-hover:opacity-100 group-hover:delay-300
                     [@media(hover:none)]:hidden"
          style={{ color: OVERLAY_INK }}
        >
          <h3 className="font-display text-xl font-semibold uppercase leading-tight tracking-tight md:text-2xl">
            {project.title}
          </h3>

          <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em]">
              {t('view_project')}
              <span
                aria-hidden
                className="transition-transform duration-300 ease-expo-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                ↗
              </span>
            </span>

            <span className="text-right font-mono text-[11px] uppercase tracking-[0.12em] opacity-80">
              {servicesLabel}
            </span>
          </div>
        </div>
      </div>

      {/*
        Pie para dispositivos táctiles. Se muestra SOLO donde no hay hover, así
        que el nombre y la categoría nunca desaparecen en un celular — pero en
        desktop no ocupa lugar y la card queda muda, como en la referencia.

        Va por capacidad (`hover: none`) y no por ancho de pantalla: una tablet
        en horizontal es ancha y tampoco tiene hover.
      */}
      <div className="mt-4 hidden [@media(hover:none)]:block">
        <h3 className="font-display text-lg font-semibold uppercase leading-tight tracking-tight text-(--ink-primary)">
          {project.title}
        </h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-(--ink-secondary)">
          {servicesLabel}
        </p>
      </div>
    </motion.article>
  )
}
