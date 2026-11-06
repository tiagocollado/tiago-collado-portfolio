# Bitácora

Registro por fase de la migración del portfolio de Next.js a Astro. Cada
entrada cuenta qué se hizo, qué problemas aparecieron y qué quedó pendiente.

---

## 2026-11-06 · F0 — Cerrar lo que quedaba online del sitio viejo

Antes de empezar el repo nuevo se cerró online un caso de estudio retirado
del portfolio: se dio de baja el link compartido, se borraron los deployments
de preview de su rama de revisión y se borró la rama. El caso no pasa al
proyecto nuevo.

---

## 2026-11-06 · F1 — Configuración y documentación

**Qué se hizo**

- `.gitignore` para Astro: dependencias, build, tipos generados, Vercel,
  variables de entorno (con excepción para `.env.example`), logs y archivos
  del sistema operativo. De `.claude/` se versionan solo `rules/` y `skills/`.
- Se trajeron del repo viejo las reglas (`design-tokens`, `imagenes`,
  `stack-traps`) y las skills (`auditar-copy`, `design-critique`,
  `frontend-design`), adaptadas a Astro donde hacía falta.
  - `stack-traps.md` pierde las secciones propias de Next (middleware,
    `next/image`, OG con satori, Turbopack) y suma tres de Astro: las dos
    trampas de las islas (el contexto de React no cruza entre islas, y
    `MotionConfig` va en cada isla que anima) y la de `sizes` en
    `astro:assets`. La lección de serialización de textos quedó reescrita
    como "a las islas se les pasan solo los textos que usan".
- `CLAUDE.md` nuevo a partir del viejo, para tres proyectos publicados, con la
  estructura de Astro marcada como objetivo.
- `docs/proceso/` con esta bitácora, la tabla de decisiones, el registro de
  uso de IA, el historial de la versión Next y la carpeta de capturas.
- `README.md` como esqueleto con las secciones que pide la consigna. Solo
  está completa la parte de instalación y ejecución.

**Problemas y cómo se resolvieron**

- Las afirmaciones sobre Astro de `stack-traps.md` se verificaron en
  docs.astro.build (guía de imágenes, referencia de `astro:assets`, guía de
  framework components, receta de estado compartido entre islas e i18n).
  La guía de framework components no dice explícitamente que las islas sean
  independientes; eso sale de la receta de estado compartido.
- Los archivos del repo viejo tenían finales de línea CRLF y el repo nuevo
  usa LF (`.gitattributes`): los reemplazos sobre texto exacto fallaban hasta
  normalizar.
- `git grep` solo busca en archivos versionados: antes del primer `git add`
  de esta fase, un control sin `--untracked` da vacío aunque haya
  coincidencias en los archivos nuevos.

**Decidido al cerrar la fase**

- `AGENTS.md`, que vino con la plantilla de Astro, se queda y se importa desde
  `CLAUDE.md`: trae el modo de dev server en segundo plano y los links a las
  guías oficiales.
- Los cambios de `imagenes.md` se revisaron y aprobaron antes de guardarlo.
- El PDF del CV no se versiona. La URL `/tiago-collado-cv.pdf` va a redirigir
  con un 307 a una copia externa; cómo se implementa se decide en F4.
- El skip link pasa a `.astro` con un `<script>` chico que mueve el foco.
- Quedan para F4: cómo usar imágenes optimizadas dentro de las islas y qué
  tecnologías muestra el carrusel del Stack.
