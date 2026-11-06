# Decisiones

Decisiones tomadas para la migración del portfolio de Next.js a Astro. Cuando
una decisión cambia, se agrega una fila nueva con la fecha y se marca la
anterior como reemplazada; no se borra.

| Fecha | Tema | Decisión | Por qué |
|---|---|---|---|
| 2026-11-06 | Lenguaje | JavaScript (`.astro`, `.js`, `.jsx`) | Lo pide Tiago |
| 2026-11-06 | Paridad | La migración es 1:1: mismo diseño, mismas animaciones, mismo comportamiento | Cualquier diferencia contra el sitio actual es un bug. Los cambios de identidad van en una fase propia, después |
| 2026-11-06 | Capa creativa | Se migra completa: Lenis, cursor custom, SplitText, magnetic hover, grain, Framer Motion, marquee, grilla de puntos | Nada se simplifica por la defensa |
| 2026-11-06 | Navegación | Página completa (MPA) + `@view-transition { navigation: auto; }` en CSS. `ClientRouter` se evalúa al cerrar F5, en un commit aparte | Menos estado que reiniciar entre páginas |
| 2026-11-06 | i18n | i18n nativo de Astro: `prefixDefaultLocale: true`, `redirectToDefaultLocale: true`, `defaultLocale: "en"`. `/` va siempre a `/en` | Mismas URLs que hoy. La detección de idioma del navegador exigiría render a pedido |
| 2026-11-06 | Textos | Los JSON actuales (`es.json`, `en.json`) + una función `t()` propia. Las islas reciben los textos ya traducidos como props | No mandar el diccionario entero al navegador |
| 2026-11-06 | Tema | Script inline en el `<head>`: lee la preferencia guardada y pone la clase `dark` (default) antes de pintar | Sin parpadeo al cargar |
| 2026-11-06 | Imágenes | `<Image>`/`<Picture>` de `astro:assets`, imágenes en `src/assets/`. `imageSpec` sigue decidiendo ancho, recorte y `sizes` | Optimización. En `public/` no se optimizan |
| 2026-11-06 | OG image | PNG estático de la G (hoy no tiene texto) | Sale satori sin perder nada |
| 2026-11-06 | Animaciones de entrada | Las secciones sin otra interacción usan un script chico con `IntersectionObserver` + transición CSS con el mismo easing. Lo que ya es isla de React sigue con Framer | No cargar React solo para un fade |
| 2026-11-06 | API de música | **Last.fm** (`user.getRecentTracks`), vía un endpoint propio renderizado a pedido, con caché en la CDN de Vercel | Clave simple que no vence. Si el puente con Spotify se corta, el widget muestra lo último en vez de romperse |
| 2026-11-06 | Interacción significativa | Widget de música con selección: "ahora" contra "últimos 5", y elegir un tema para ver su detalle | Junta API, estados e interacción en un componente |
| 2026-11-06 | Idioma de README y `docs/` | Castellano | La consigna y la defensa son en castellano |
| 2026-11-06 | `AGENTS.md` | Se queda el de la plantilla de Astro y se importa desde `CLAUDE.md` | Trae el dev server en segundo plano y los links a las guías oficiales |
| 2026-11-06 | CV | El PDF no entra al repo. `/tiago-collado-cv.pdf` redirige con un 307 a una copia externa (se implementa en F4) | El repo es público, y la URL que ya circula tiene que seguir funcionando |
| 2026-11-06 | Skip link | `.astro` con un `<script>` chico que mueve el foco, no una isla | Lenis intercepta las anclas y puede comerse el foco de un `<a href="#main">` pelado; no hace falta React para eso |
