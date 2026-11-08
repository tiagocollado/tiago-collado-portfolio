# Bitácora

Registro del desarrollo del portfolio en Astro: qué se hizo en cada etapa, qué
problemas aparecieron, cómo se resolvieron y qué queda abierto.

**Punto de partida.** El portfolio ya existía, publicado en
[tiagocollado.vercel.app](https://tiagocollado.vercel.app), hecho con Next.js y
TypeScript. Este repositorio lo reconstruye en Astro y JavaScript. La primera
meta es la paridad: el sitio nuevo tiene que verse y comportarse igual que el
publicado, en las mismas URLs. Los cambios de diseño vienen después, sobre una
base que ya funciona.

---

## Antecedente: la versión en Next

**Abril de 2026.** Primera versión completa del portfolio en Next.js, con
descarga del CV y los textos en inglés y castellano. Ese mismo mes llegaron un
rediseño visual (cards de proyecto, About reescrito, favicon terracota) y una
corrección de fondo: un reset global sin `@layer` anulaba las utilities de
espaciado de Tailwind v4. Es el origen de la primera regla de
[errores conocidos del stack](../../.claude/rules/stack-traps.md).

**Mayo a agosto.** La capa de frontend creativo, en dos tandas: scroll suave,
cursor propio, revelado de texto, botones magnéticos y el marquee de servicios.
En agosto se sumaron el bloque de cierre unificado (contacto y footer), la
imagen de Open Graph con la marca, el skip link y una jerarquía de headings
sin saltos.

**Septiembre: imágenes.** Migración a `next/image`, covers del home con el
barrido terracota en hover y las imágenes de los casos de estudio. Los
mockups con texto generado por IA se reemplazaron por capturas reales del
sitio de cada proyecto.

**Septiembre: casos de estudio.** Rediseño de la página de caso como una
secuencia de bloques con un vocabulario de tipos de imagen. El copy de cada
caso se contrastó contra la evidencia (el sitio publicado o el código), y esa
pasada de hechos quedó como regla de revisión.

**Septiembre: El Ritual del Tono.** El caso del proyecto full-stack (MERN, con
demo en vivo) se armó contra su código: el diagrama del modelo de datos sale
de los esquemas reales del backend. En esa revisión también cerré las rutas de
escritura de `/products`, que estaban abiertas; corregí la respuesta 404 de las
rutas inexistentes y agregué reintento de conexión a la base de datos.

**23 de septiembre: cierre de la primera versión.** El sitio pasó a publicar
solo los proyectos terminados; el resto quedó en el código sin publicar. Con
eso se cerró la V1: nombres por función en vez de por referencia, lint en cero
y la documentación sin historial de tareas cerradas.

---

## 2026-11-06 · Repositorio y documentación

- Repositorio nuevo a partir de la plantilla mínima de Astro, con `.gitignore`
  para Astro, Vercel y variables de entorno (solo se versiona `.env.example`).
- Las reglas de diseño, de imágenes y de errores conocidos del proyecto
  anterior se trajeron a `.claude/rules/`, adaptadas a Astro. Son las
  instrucciones que usa el asistente de IA (ver
  [uso-de-ia.md](uso-de-ia.md)).
- Estructura de documentación: esta bitácora, el
  [registro de decisiones](decisiones.md) y el
  [registro de uso de IA](uso-de-ia.md).

**Problema encontrado.** Los archivos del proyecto anterior tenían finales de
línea CRLF y este repositorio usa LF (`.gitattributes`). Los reemplazos de
texto exacto fallaban hasta normalizarlos.

---

## 2026-11-07 · Entorno de prueba

Proyecto de staging en Vercel conectado a este repositorio. El sitio publicado
sigue saliendo del proyecto anterior hasta que la migración esté completa, así
la URL pública no se cae en el medio.

---

## 2026-11-07 · Base del sitio

**Qué se hizo**

- Tailwind v4 con `@tailwindcss/vite`, siguiendo la guía oficial de Tailwind
  para Astro.
- `src/styles/global.css`: tokens de marca, `@theme`, variante `dark` por
  clase, reset y estilos base dentro de `@layer base`, textura de grano,
  scrollbar y transición entre páginas (`@view-transition`). Dos clases del
  CSS anterior que ningún componente usaba no se migraron.
- Fuentes (Geist, Geist Mono y Space Grotesk) con la API de fuentes de Astro,
  con los mismos pesos y variables CSS que antes.
- `BaseLayout.astro`: idioma de la página, metadata y Open Graph, favicon,
  tema y skip link.
- Rutas por idioma (`/en`, `/es`) con el i18n nativo de Astro, los
  diccionarios en `src/i18n/` y una función `t()` para leerlos.

**Problemas y cómo se resolvieron**

- **La redirección de `/` a `/en`.** La opción `redirectToDefaultLocale` de
  Astro genera, en un build estático, una página con meta refresh de 2
  segundos (la trata como redirección temporal 302), y además produce un
  warning de rutas en conflicto con `src/pages/index.astro`, que es
  obligatorio cuando todas las URLs llevan prefijo de idioma. Probé cambiar
  `trailingSlash` (no influye) y desactivar la opción (el warning
  desaparece). La solución: la opción queda desactivada y `index.astro`
  redirige con `Astro.redirect('/en/', 307)`. Sale sin warning y con refresh
  de 0 segundos. La guía de i18n no documenta qué genera `/` en un build
  estático: lo averigüé buildeando y leyendo el código de Astro.
- **Metadata.** En el sitio anterior el título, la descripción y Open Graph
  estaban fijos en inglés para los dos idiomas. Pasaron a un bloque `meta` en
  los diccionarios con los mismos textos: el HTML sale igual que antes y la
  versión en castellano se puede traducir sin tocar código.
- **El tema sin parpadeo.** Para conservar la preferencia de quien ya visitó
  el sitio, el script replica lo que hacía `next-themes` (leído en su código):
  la clave `theme` en `localStorage`, la clase del tema en `<html>` y
  `color-scheme`. Va inline en el `<head>` porque los scripts que procesa
  Astro son módulos y corren después de pintar.
- **Comentarios publicados.** El contenido de un `<script is:inline>` sale tal
  cual en el HTML, comentarios incluidos. La explicación del script pasó a un
  comentario de Astro, que no se publica.
- **`Astro.site` posiblemente indefinido.** El editor lo marcaba como error de
  tipos. Una guarda explícita corta el build con un mensaje claro si falta
  `site` en la configuración.

**Verificación**

- `npm run build` sin errores ni warnings.
- El `<head>` generado coincide con el del sitio publicado. Solo cambia la URL
  de la imagen de Open Graph, y el PNG es idéntico byte a byte al anterior.
- Las fuentes se sirven desde el propio sitio, con `font-display: swap`, un
  fallback con métricas ajustadas para que el cambio de fuente no mueva el
  texto, y preload.

**Pendiente**

- Probar en el navegador, en los dos temas, que no haya parpadeo de tema ni
  salto de tipografía al recargar.
- El sitio anterior usa URLs sin barra final (`/en`) y Astro genera `/en/`.
  Falta verificar en staging qué hace Vercel con cada una.

---

## 2026-11-07 · Contenido y casos de estudio

**Qué se hizo**

- Datos en `src/data/projects.js` (los tres proyectos publicados y tres más
  sin publicar) y `src/data/stack.js`, con el mismo copy del sitio publicado.
- Las 17 imágenes de los proyectos publicados, en `src/assets/`, idénticas a
  las originales (verificado con md5).
- `imageSpec.js`: el tipo de cada imagen decide su ancho, su recorte, el
  parallax y el `sizes`, con la misma lógica que la versión anterior.
- Integración de React con `npx astro add react`, y las tres librerías que
  usan los componentes (`framer-motion`, `lucide-react`, `simple-icons`) con
  las mismas versiones que el sitio publicado.
- Secciones de la home y del caso de estudio como componentes `.astro` sin
  JavaScript, y dos islas de React con su animación de Framer Motion: la card
  de proyecto y la imagen del caso de estudio.
- Páginas `/en`, `/es` y los tres casos en los dos idiomas, generados con
  `getStaticPaths()` solo para los proyectos publicados.
- Redirección de `/tiago-collado-cv.pdf` en `vercel.json`, con 307.

**Problemas y cómo se resolvieron**

- **Imágenes optimizadas dentro de las islas.** El `<Image />` de Astro no se
  puede usar en un componente de React. La documentación ofrece pasarle el
  `<Image />` ya renderizado como hijo o usar `getImage()`. Elegí
  `getImage()`: el parallax anima el propio `<img>` con Framer Motion, y como
  HTML ya renderizado no se podría animar sin cambiar el markup. La función
  que llama a `getImage()` quedó en un módulo propio
  (`src/utils/responsiveImage.js`), porque `imageSpec.js` también lo importa
  la isla, y `getImage()` rompe si llega al navegador.
- **Íconos sin React en el navegador.** Los íconos de `lucide-react` son
  componentes de React. Usados en un `.astro` sin directiva `client:*`, Astro
  los renderiza a SVG en el build y no manda JavaScript.
- **Versiones.** `npm install` traía versiones menores más nuevas de las tres
  librerías. Se fijaron en el lock las mismas que el sitio publicado, para que
  los íconos y las animaciones salgan idénticos.
- **Errores de tipos en el editor.** El preset `strict` del `tsconfig` marcaba
  "any implícito" en archivos JavaScript. Se pasó al preset `base`, sin modo
  estricto. El build no cambia.
- **Falsos positivos en el control de palabras.** `git grep` también busca
  adentro de los JPG, donde aparecen por azar secuencias de letras que
  coinciden con palabras cortas. El control se corre con `-I`, que saltea los
  binarios.

**Verificación**

- `npm run build` sin errores ni warnings: `/`, `/en/`, `/es/` y los seis
  casos, ninguna página más.
- Cada imagen sale con `srcset` y con el `sizes` de su tipo; la del hero, con
  `fetchpriority="high"`.
- Las islas reciben solo los datos que muestran: ningún texto de otros
  proyectos ni de otros idiomas viaja al navegador.

**Pendiente**

- Las animaciones de entrada de los componentes que quedaron sin JavaScript
  (encabezado y barra de metadata del caso, secciones, About, Stack, el título
  de la grilla) se suman con la capa de interacción, junto con el Hero, el
  Navbar, el Contact y el Footer.
- Verificar en staging que la redirección del CV dé 307 y qué hace Vercel con
  las URLs con y sin barra final.
