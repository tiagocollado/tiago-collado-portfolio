'use client'

import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { projects } from '@/data/projects'
import ProjectCard from './ProjectCard'
import SplitText from '../ui/SplitText'
import { Locale } from '@/types'

export default function Projects() {
  const t = useTranslations('projects')
  const locale = useLocale() as Locale


  /*
   * El home muestra SOLO los 4 marcados con `showOnHome` — los reales para
   * clientes. Los 7 completos viven en /projects.
   *
   * Por qué 4 y no los 7: es el patrón de agencia (el home es un destacado,
   * no el catálogo) y además sostiene Hick — menos opciones, decisión más
   * rápida. Con 6 la página /projects quedaría con un solo proyecto extra y
   * no se justificaría.
   */
  const homeProjects = projects
    .filter((p) => p.showOnHome)
    .sort((a, b) => a.order - b.order)

  /*
   * Masonry en dos columnas, repartiendo los proyectos de forma ALTERNADA:
   * el 1 y el 3 van a la izquierda, el 2 y el 4 a la derecha.
   *
   * Se arma con dos <div> explícitos y NO con `grid-auto-rows` + `row-span`,
   * que fue el primer intento: eso alinea las filas y las dos columnas terminan
   * a la misma altura, que es justo lo que NO queremos. Acá cada columna fluye
   * sola y el borde inferior queda disparejo, como en la referencia.
   *
   * Tampoco se usa `column-count` (el masonry nativo de CSS) por dos razones:
   * reordena los hijos de forma implícita, y además llena la primera columna
   * antes de pasar a la segunda — o sea, no alterna.
   *
   * ⚠️ Alternar rompía el orden de lectura en mobile: al apilarse las dos
   * columnas salía 1·3·2·4, porque ese es el orden del DOM. Se arregla con
   * `display: contents` en las columnas abajo de `md` — los <div> desaparecen
   * del layout, las 4 cards pasan a ser hijas directas del grid, y ahí el
   * `order` de cada card (ver ProjectCard) las ordena 1·2·3·4.
   *
   * En desktop las columnas vuelven a ser `flex` y el `order` no molesta:
   * dentro de cada una los valores ya quedan en secuencia.
   */
  const columnas = [
    homeProjects.filter((_, i) => i % 2 === 0),
    homeProjects.filter((_, i) => i % 2 === 1),
  ]

  return (
    <section id="projects" className="py-16 md:py-20 lg:py-28 px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
      <div className="max-w-7xl mx-auto">

        {/* Header: label + statement. El label entra primero (fade-up corto)
            y después el statement con SplitText char reveal al entrar al
            viewport.

            ⚠️ Acá iba un link "Ver todos los proyectos ↗" a la derecha. Se sacó
            porque la página /projects todavía no existe y el link tiraba 404.
            Vuelve cuando se haga P-1 (CLAUDE.md §8); la key `projects.view_all`
            sigue en los dos JSON, así que no hay que volver a crearla. */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-mono tracking-[0.2em] mb-6 uppercase"
            style={{ color: 'var(--color-accent)' }}
          >
            {t('label')}
          </motion.p>
          <SplitText
            as="h2"
            text={t('statement')}
            stagger={0.015}
            delay={0.15}
            yFrom={20}
            blurFrom={4}
            duration={0.6}
            whileInView
            className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] block text-(--ink-primary)"
          />
        </div>

        {/*
          Grilla masonry: dos columnas que fluyen por separado. El `index`
          global (no el de la columna) es el que da el stagger, así el reveal
          entra en orden de lectura y no de a pares.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mt-12 md:mt-16">
          {columnas.map((columna, ci) => (
            <div key={ci} className="contents md:flex md:flex-col md:gap-6">
              {columna.map((project, i) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  locale={locale}
                  index={i * 2 + ci}
                />
              ))}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}