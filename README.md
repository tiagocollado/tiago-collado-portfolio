# Gotya — portfolio de Tiago Collado

Sitio: https://tiagocollado.vercel.app

## Sobre el proyecto

Portfolio de Tiago Collado, diseñador UX/UI y desarrollador frontend. Gotya es la marca con la que trabajo como freelance: diseño sitios y productos digitales desde la definición del negocio hasta la publicación y el mantenimiento.

Cada caso de estudio cuenta el problema, las decisiones y el resultado. La home separa lo que hago (Skills, con los casos donde se ve cada una) de las herramientas que uso (Stack).

## Stack técnico

| | |
|---|---|
| Framework | [Astro](https://astro.build) 7.4, sitio estático con una ruta a pedido |
| Lenguajes | JavaScript (`.astro`, `.js`, `.jsx`, sin TypeScript), CSS |
| Interactividad | React 19 en islas; scripts de Astro sin React para Skills y el skip link |
| Estilos | Tailwind CSS 4, con los tokens de la marca en `@theme` |
| Animación | Framer Motion 12 y Lenis 1.3 (scroll suave) |
| Idiomas | i18n de Astro: `/en/` y `/es/`, textos en `src/i18n/*.json` |
| Imágenes | `astro:assets`, optimizadas a WebP en el build |
| Tipografías | Space Grotesk, Geist y Geist Mono, servidas desde el sitio con la API de fuentes de Astro |
| Íconos | simple-icons (herramientas) y Lucide (interfaz) |
| Datos en vivo | API de Last.fm, detrás de un endpoint propio |
| Indexación | `@astrojs/sitemap`, `robots.txt` y `llms.txt` |
| Deploy | Vercel, con el adapter `@astrojs/vercel` |

Decisiones, con su contexto: [docs/proceso/decisiones.md](docs/proceso/decisiones.md).

## Cómo correrlo

Requisitos: Node.js 22.23.4 o superior y npm.

```sh
npm install      # dependencias
npm run dev      # desarrollo en http://localhost:4321
npm run build    # build de producción en .vercel/output/
```

El widget de música necesita `LASTFM_API_KEY` y `LASTFM_USERNAME`: copiar
`.env.example` como `.env` y completarlas (la clave se pide en
[last.fm/api/account/create](https://www.last.fm/api/account/create)). Sin
ellas el sitio funciona igual y el widget muestra que la música no está
disponible.

## Componentes

- **[`Skills.astro`](src/components/sections/Skills.astro)**: la interacción
  principal. Índice de cuatro skills; cada nombre es un `<button>` de
  disclosure que abre un panel con sus actividades y links a los casos donde
  se ve. Datos en [`skills.js`](src/data/skills.js).
- **[`Stack.astro`](src/components/sections/Stack.astro)** y
  **[`ToolIcon.astro`](src/components/ui/ToolIcon.astro)**: las 26
  herramientas en cuatro grupos, en una grilla de 2, 3 o 4 columnas según el
  ancho. `ToolIcon` dibuja el ícono de simple-icons o, si no existe, un
  cuadrado con iniciales. Datos en [`stack.js`](src/data/stack.js).
- **[`NowPlaying.jsx`](src/components/sections/NowPlaying.jsx)**: el widget
  de música del About (ver [Datos en vivo](#datos-en-vivo)).
- **[`InteractiveDotGrid.jsx`](src/components/ui/InteractiveDotGrid.jsx)**:
  grilla de puntos en `<canvas>` detrás del hero; los puntos se apartan del
  cursor. En táctil es CSS estático. Al pie del hero, una fila de puntos en
  CSS cae en las mismas columnas.
- **[`ProjectCard.jsx`](src/components/sections/ProjectCard.jsx)**: card de
  la grilla de proyectos. En reposo, solo la imagen; en hover, un lavado
  terracota y los datos del caso. En táctil, los datos van debajo.

## Datos en vivo

```
Spotify ──► Last.fm ──► /api/now-playing.json ──► NowPlaying (navegador)
          (scrobbling)   función de Vercel, con la clave
```

- **Origen.** Lo que escucho en Spotify se registra en Last.fm. El endpoint
  [`now-playing.json.js`](src/pages/api/now-playing.json.js) pide a Last.fm
  `user.getRecentTracks` y devuelve solo título, artista, álbum, link y fecha
  de cada tema.
- **La clave.** `LASTFM_API_KEY` es una variable secreta de servidor
  (`astro:env`): solo la lee el endpoint, que es la única ruta que corre a
  pedido. No aparece en el HTML ni en el JavaScript del navegador, que nunca
  habla con Last.fm.
- **Escuchando ahora o lo último.** Last.fm marca el tema en curso con
  `nowplaying`. El endpoint lo pone primero, seguido de los últimos cinco. Si
  hay uno en curso, el widget prende el cartel "En vivo" y le pone un
  ecualizador a su fila; si no, muestra el último escuchado con el cartel
  apagado.
- **Actualización y caché.** El widget pide los datos al entrar en pantalla y
  de nuevo al volver a la pestaña, si pasó más de un minuto. Las respuestas
  correctas se guardan 30 s en la CDN de Vercel
  (`s-maxage=30, stale-while-revalidate=60`): Last.fm recibe como mucho un
  pedido cada 30 s por región. Los errores no se cachean, y el pedido a
  Last.fm se corta a los 5 s.
- **Estados.** El endpoint siempre responde JSON con un campo `state`.
  - Al cargar: un esqueleto con las medidas del contenido, sin saltos de alto.
  - Sin temas: "Todavía no registré ningún tema."
  - Perfil privado: "Mi historial de Last.fm está en privado."
  - Cualquier error (clave, usuario, timeout, Last.fm caído o sin
    configurar): "No pude cargar la música ahora."
  - Sin JavaScript, el widget no se muestra.

## Responsive y accesibilidad

- **Breakpoints** de Tailwind (`md` 768, `lg` 1024 px). Proyectos: 1 columna
  y masonry de 2 desde `md`. Stack: 2, 3 y 4 columnas. Menú desplegable abajo
  de `lg`.
- **Sin scroll horizontal** a 360, 375, 390, 768 y 1440 px, en la home y en
  un caso, medido con emulación de celular.
- **Teclado**: skip link primero; foco visible en todo, salvo en `<main>`.
  Las skills se activan con Enter o Espacio. El logo del navbar no recibe
  foco mientras está oculto.
- **Contraste**: texto chico en `--ink-muted` a 4,5:1 contra el fondo y en
  `--ink-secondary` a 7,1:1 o más; subrayado de la skill activa a 5,04:1
  (oscuro) y 3,76:1 (claro).
- **Movimiento reducido**: entradas solo con fade, grilla de puntos quieta,
  disco sin girar, cambio de skill instantáneo.
- **Sin JavaScript**: el contenido se ve, salvo los títulos animados (ver
  [Limitaciones conocidas](#limitaciones-conocidas)), y Skills abre todos sus
  paneles.
- **Semántica**: un `<main>`, `<nav>`, `<header>` y `<footer>` por página;
  `aria-expanded` y `aria-controls` en Skills; `aria-hidden` en lo
  decorativo; listas `<ul>` y `<ol>`; ninguna imagen sin `alt`.

## Indexación

- **Sitemap** (`/sitemap-index.xml`): las páginas de `/en/` y `/es/`, cada
  una con su alternativa `hreflang`.
- **[`robots.txt`](public/robots.txt)**: permite el rastreo salvo en `/api/`
  y apunta al sitemap.
- **`/llms.txt`**: resumen del sitio para modelos de lenguaje, generado en el
  build desde los casos publicados ([`llms.txt.js`](src/pages/llms.txt.js)).
  Sigue [llmstxt.org](https://llmstxt.org), una convención propuesta.

## Proceso

En [docs/proceso/](docs/proceso/): [bitácora](docs/proceso/bitacora.md),
[decisiones](docs/proceso/decisiones.md) y
[uso de IA](docs/proceso/uso-de-ia.md).

Capturas de página entera del sitio publicado, en
[docs/proceso/capturas/](docs/proceso/capturas/):

| Página | 375 px | 768 px | 1440 px |
|---|---|---|---|
| Home | [oscuro](docs/proceso/capturas/home-375-oscuro.webp) · [claro](docs/proceso/capturas/home-375-claro.webp) | [oscuro](docs/proceso/capturas/home-768-oscuro.webp) · [claro](docs/proceso/capturas/home-768-claro.webp) | [oscuro](docs/proceso/capturas/home-1440-oscuro.webp) · [claro](docs/proceso/capturas/home-1440-claro.webp) |
| Recuérdalo | [oscuro](docs/proceso/capturas/recuerdalo-375-oscuro.webp) · [claro](docs/proceso/capturas/recuerdalo-375-claro.webp) | [oscuro](docs/proceso/capturas/recuerdalo-768-oscuro.webp) · [claro](docs/proceso/capturas/recuerdalo-768-claro.webp) | [oscuro](docs/proceso/capturas/recuerdalo-1440-oscuro.webp) · [claro](docs/proceso/capturas/recuerdalo-1440-claro.webp) |

## Cómo uso IA

Claude Code (Claude Opus 5.5) como asistente de desarrollo: migración de
componentes, verificación contra la documentación y el código de las
librerías, configuración y documentación. Las decisiones de diseño, alcance y
arquitectura y los commits son míos; la IA no abre el archivo `.env`. Reglas
del asistente en [CLAUDE.md](CLAUDE.md) y [.claude/rules/](.claude/rules/);
detalle en [docs/proceso/uso-de-ia.md](docs/proceso/uso-de-ia.md).

## Créditos y licencias

- [Astro](https://astro.build), React, Tailwind CSS, Framer Motion, Lenis y
  las integraciones de Astro: licencia MIT.
- [simple-icons](https://simpleicons.org): CC0 1.0. Las marcas pertenecen a
  sus dueños.
- [Lucide](https://lucide.dev): licencia ISC.
- [Space Grotesk](https://github.com/floriankarsten/space-grotesk),
  [Geist y Geist Mono](https://github.com/vercel/geist-font):
  [SIL Open Font License 1.1](https://openfontlicense.org).
- Datos de música de [Last.fm](https://www.last.fm), bajo los
  [términos de su API](https://www.last.fm/api/tos): uso no comercial,
  crédito con link ("vía Last.fm" en el widget) y sin portadas de discos.

## Limitaciones conocidas

- Título y meta description iguales en todas las páginas, y en inglés en `/es/`; sin canonical ni `hreflang` en el HTML.
- Los títulos que entran letra por letra no se ven sin JavaScript.
- `npm audit` reporta avisos en dependencias de build del adapter de Vercel.
