# Decisiones

Decisiones de diseño, arquitectura y tecnología del proyecto. Cada una tiene su
contexto, lo que se decidió y por qué. Cuando una decisión cambia, se agrega la
nueva y la anterior queda marcada como reemplazada, para que se vea la
evolución.

---

## Alcance y criterio general

### Migración 1:1 antes que rediseño · 2026-11-06

**Contexto.** El portfolio ya está publicado en Next.js y tiene que pasar a
Astro sin que la URL pública cambie ni quede caída.

**Decisión.** Primero se replica el sitio tal cual: mismo diseño, mismas
animaciones, mismo comportamiento. Los cambios de identidad visual van en una
etapa posterior.

**Por qué.** Separar las dos cosas permite comparar contra el sitio publicado:
cualquier diferencia es un bug, no una decisión de diseño a discutir.

### La capa de interacción se migra completa · 2026-11-06

**Contexto.** El sitio usa scroll suave (Lenis), cursor propio, revelado de
texto por letra, botones magnéticos, textura de grano, Framer Motion, un
marquee y una grilla de puntos interactiva.

**Decisión.** Se migra todo, sin simplificar.

**Por qué.** Es parte de la identidad del sitio y de lo que el portfolio
demuestra como trabajo de frontend.

### JavaScript, sin TypeScript · 2026-11-06

**Contexto.** El sitio anterior estaba en TypeScript.

**Decisión.** El proyecto nuevo usa solo JavaScript (`.astro`, `.js`, `.jsx`).

**Por qué.** Preferencia del autor.

---

## Ruteo, idiomas y navegación

### i18n nativo de Astro con prefijo en todos los idiomas · 2026-11-06

**Contexto.** El sitio publicado sirve `/en` y `/es`, y `/` lleva siempre a
`/en`. Esas URLs ya circulan.

**Decisión.** i18n nativo de Astro con `defaultLocale: "en"` y
`prefixDefaultLocale: true`: hasta el inglés lleva `/en` en la URL.

**Por qué.** Mantiene las mismas URLs. Detectar el idioma del navegador
exigiría renderizar a pedido, y el sitio es estático.

### Redirección de `/` hecha a mano · 2026-11-07

*Reemplaza el uso de `redirectToDefaultLocale: true` que se había previsto.*

**Contexto.** Con `redirectToDefaultLocale: true`, el build estático genera
`/` como una página con meta refresh de 2 segundos (Astro la trata como
redirección temporal 302) y da un warning de rutas en conflicto con
`src/pages/index.astro`, que es obligatorio.

**Decisión.** `redirectToDefaultLocale: false`, y `src/pages/index.astro`
redirige con `Astro.redirect('/en/', 307)`.

**Por qué.** Sale sin warning y con refresh de 0 segundos, como la redirección
inmediata del sitio anterior. Que sea una redirección HTTP real depende del
adapter de Vercel, que se suma con el endpoint de la API.

### Navegación de página completa con transiciones CSS · 2026-11-06

**Contexto.** Astro permite navegar como una SPA (`ClientRouter`) o como un
sitio de páginas completas.

**Decisión.** Páginas completas, con `@view-transition { navigation: auto; }`
en CSS para la transición entre páginas. `ClientRouter` se evalúa cuando esté
migrada la capa de interacción, en un cambio aparte.

**Por qué.** Cada página arranca limpia: no hay estado que reiniciar entre
páginas (scroll, cursor, animaciones).

---

## Textos y metadata

### Diccionarios JSON y una función `t()` propia · 2026-11-06

**Contexto.** El sitio anterior usaba next-intl con dos diccionarios
(`es.json`, `en.json`).

**Decisión.** Se conservan los diccionarios y se leen con una función `t()`
propia, en el servidor. Las islas de React reciben los textos ya traducidos
como props.

**Por qué.** No mandar el diccionario entero al navegador: cada isla recibe
solo los textos que usa.

### Metadata desde los diccionarios · 2026-11-07

**Contexto.** En el sitio anterior, el título, la descripción y Open Graph
estaban fijos en inglés para los dos idiomas.

**Decisión.** Pasan a un bloque `meta` en los dos diccionarios, con los mismos
textos en inglés.

**Por qué.** El HTML sale igual que antes, y la versión en castellano se puede
traducir sin tocar código.

### Sin canonical por ahora · 2026-11-07

**Contexto.** El sitio publicado no tiene `<link rel="canonical">` y su
`og:url` apunta siempre a la raíz.

**Decisión.** Se mantiene igual.

**Por qué.** Paridad. Canonical por página, `hreflang` y `og:url` por página
quedan como mejora de SEO posterior.

---

## Estilos, tema y fuentes

### Tema aplicado antes de pintar · 2026-11-06

**Contexto.** El sitio tiene tema oscuro (por defecto) y claro, y la elección
se guarda en el navegador.

**Decisión.** Un script inline en el `<head>` lee la preferencia guardada y
pone la clase del tema en `<html>` antes de pintar. Usa la misma clave que el
sitio anterior (`theme`).

**Por qué.** Sin parpadeo al cargar, y quien ya eligió un tema lo conserva.

### API de fuentes de Astro · 2026-11-07

**Contexto.** El sitio anterior cargaba las fuentes con `next/font`, que las
sirve desde el propio sitio y genera fallbacks ajustados para que el cambio de
fuente no mueva el texto.

**Decisión.** API de fuentes de Astro (estable en Astro 7), no Fontsource.

**Por qué.** Hace lo mismo que `next/font` desde la configuración: descarga
las fuentes en el build, genera los fallbacks con métricas ajustadas y agrega
el preload.

---

## Imágenes

### `astro:assets` con imágenes en `src/assets/` · 2026-11-06

**Contexto.** Las imágenes del sitio anterior pasaban por `next/image`.

**Decisión.** `<Image>` y `<Picture>` de `astro:assets`, con las imágenes en
`src/assets/`. Un módulo propio (`imageSpec`) sigue decidiendo ancho, recorte y
`sizes` según el tipo de imagen.

**Por qué.** Astro solo optimiza las imágenes de `src/`. Las de `public/` se
sirven tal cual.

### Imagen de Open Graph estática · 2026-11-06

**Contexto.** El sitio anterior generaba la imagen de Open Graph en el build,
con satori. La imagen es solo la marca, sin texto.

**Decisión.** Un PNG estático en `public/og-image.png`.

**Por qué.** Sin texto no hay nada que generar por idioma: el resultado es el
mismo, sin la dependencia.

### Animaciones de entrada sin React · 2026-11-06

**Decisión.** Las secciones que solo aparecen al hacer scroll usan un script
chico con `IntersectionObserver` y una transición CSS con el mismo easing. Lo
que ya es una isla de React sigue con Framer Motion.

**Por qué.** No cargar React solo para un fade.

---

## Datos dinámicos

### Last.fm como fuente dinámica · 2026-11-06

**Contexto.** El portfolio tiene que consumir una API externa.

**Decisión.** Last.fm (`user.getRecentTracks`), a través de un endpoint propio
renderizado a pedido, con caché en la CDN de Vercel. El navegador nunca llama a
Last.fm directo.

**Por qué.** La clave es simple y no vence, y queda del lado del servidor. Si
la conexión de Last.fm con Spotify se corta, el widget muestra lo último
escuchado en vez de romperse.

### La interacción principal está en el widget de música · 2026-11-06

**Decisión.** El widget permite alternar entre "ahora" y "últimos 5", y elegir
un tema para ver su detalle.

**Por qué.** Junta en un componente la API, sus estados (carga, error, vacío)
y una interacción que cambia lo que se muestra.

---

## Repositorio

### El CV no se versiona · 2026-11-06

**Contexto.** El sitio publicado sirve el CV en `/tiago-collado-cv.pdf`, y esa
URL ya circula. Este repositorio es público.

**Decisión.** El PDF no entra al repositorio. La URL va a redirigir con un 307
a una copia alojada afuera.

**Por qué.** El repositorio es público y el CV es un documento aparte del
sitio. Con la redirección, la URL que ya circula sigue funcionando.

### Instrucciones del asistente de IA en el repositorio · 2026-11-06

**Decisión.** `CLAUDE.md`, `AGENTS.md` (el de la plantilla de Astro) y
`.claude/rules/` se versionan.

**Por qué.** `AGENTS.md` trae las instrucciones del servidor de desarrollo y
los links a las guías oficiales de Astro. `CLAUDE.md` y las reglas documentan
los criterios de diseño y los errores conocidos del stack con los que trabaja
el asistente (ver [uso-de-ia.md](uso-de-ia.md)).
