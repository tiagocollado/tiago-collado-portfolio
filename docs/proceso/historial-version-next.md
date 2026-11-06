# Historial de la versión Next

Historial de la rama `main` del repositorio anterior del portfolio (Next.js),
que se reemplaza por este. Se conserva acá porque el repo viejo se va a
borrar, y muestra cómo evolucionó el sitio antes de la migración a Astro.

Solo fecha y asunto de cada commit, del más viejo al más nuevo. **Se omitieron
los commits de un proyecto retirado del portfolio por confidencialidad.**

Se sacó con:

```
git log main --reverse --date=short --pretty="%ad %s"
```

```
2026-04-15 Initial commit from Create Next App
2026-04-21 Initial commit - Portfolio completo
2026-04-22 Add CV download
2026-04-23 Fix production bug: project pages crashing on Vercel
2026-04-23 bug de produccion
2026-04-23 Add .claude to .gitignore
2026-04-23 Visual redesign: icons, project titles, about chips, footer CTA
2026-04-24 Redesign: spacing audit, Contact section, hero identity, card hover reveal
2026-04-24 Polish: fix tokens, add canvas dot-grid, Embla gallery, EN i18n parity
2026-04-25 refactor(ui): layout, spacing and theme normalization- fix: remove global reset (* { padding: 0; margin: 0 }) causing Tailwind v4 utility conflicts- fix: resolve double <main> element issue in layout/project pages- refactor: replace inline style workarounds with standard Tailwind utilities- feat: implement consistent spacing scale across all sections (py-20/28/36)- feat: update typography using Tailwind v4 theme-based color utilities- fix: layout alignment and spacing inconsistencies (Hero, Footer, ProjectCard)- cleanup: remove redundant CSS variables and unlayered resets
2026-04-25 Stack: swap Accessibility icon for Contrast + session docs
2026-04-29 Tanda B: rediseño ProjectCard + About reescrito con nueva estructura
2026-04-29 docs(claude): sync state, mark Tanda B + About 2.0 as done
2026-04-29 Tanda C: favicon T terracota + About 3.0 + UX heuristics rule
2026-05-01 Tanda B2 + B2.5: case studies reescritos + quick fixes
2026-05-07 feat: rework frontend creativo (Fases 1-3) + tandas pendientes
2026-08-25 feat: rework frontend creativo (Fases 4-6) + ServicesMarquee + card Sitios WordPress
2026-08-26 feat: cierre de pagina, saneamiento de hovers y OG image de marca
2026-08-26 refactor(layout): escalera de max-w + cierre unificado + landmark del footer
2026-08-26 feat(brand): OG image solo con la marca + README propio
2026-08-26 fix: baja de las imagenes provisorias + skip link + jerarquia de headings
2026-09-01 perf(images): migrar a next/image (D3)
2026-09-10 feat(projects): los 4 covers del home + barrido en hover + orden en mobile
2026-09-11 feat(case-study): imagenes de Paseo Guemes + alts que describen lo que muestran
2026-09-17 fix(covers): pulso con la captura real en pantalla
2026-09-17 feat(case-study): rework de la pagina + imagenes nuevas de Pulso y Paseo
2026-09-17 docs: cerrar el estado del rework publicado en 7f69757
2026-09-21 feat(ritual): case study con el vocabulario de tipos + copy contrastado contra el codigo
2026-09-22 feat(scope): el sitio publica solo los 4 proyectos terminados
2026-09-23 docs(skill): pasada de hechos en auditar-copy
2026-09-23 docs: T4 con los cambios listos en el backend y T5 para rotar credenciales
2026-09-23 docs: CLAUDE.md e imagenes.md sin historial de tareas cerradas
2026-09-23 refactor: nombres por funcion, no por referencia
2026-09-23 docs: el cover de Ritual se queda, decision tomada
2026-09-23 chore: tags fuera, lint en cero y la seccion 11 alineada
2026-09-23 docs: version 1 cerrada y el orden de la version siguiente
2026-09-26 fix: CV nuevo y link de Contacto al nombre nuevo
2026-10-05 fix: CV actualizado
2026-10-05 docs: decision sobre el CV
```
