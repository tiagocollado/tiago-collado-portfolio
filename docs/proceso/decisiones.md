# Decisiones

Decisiones de diseño, arquitectura y tecnología del proyecto, cada una con su
contexto, lo que se decidió y por qué. Cuando una decisión cambia, se agrega la
nueva y se marca cuál reemplaza, para que se vea la evolución.

---

## Alcance y criterio general

### Migración 1:1 antes que rediseño

**Contexto.** El portfolio ya está publicado en Next.js y tiene que pasar a
Astro sin que la URL pública cambie ni quede caída.

**Decisión.** Primero se replica el sitio tal cual: mismo diseño, mismas
animaciones, mismo comportamiento. Los cambios de identidad visual van después.

**Por qué.** Separar las dos cosas permite comparar contra el sitio publicado:
cualquier diferencia es un bug, no una decisión de diseño a discutir.

### La capa de interacción se migra completa

**Contexto.** El sitio usa scroll suave (Lenis), cursor propio, revelado de
texto por letra, botones magnéticos, textura de grano, Framer Motion, un
marquee y una grilla de puntos interactiva.

**Decisión.** Se migra todo, sin simplificar.

**Por qué.** Es parte de la identidad del sitio y de lo que el portfolio
demuestra como trabajo de frontend.

### JavaScript, sin TypeScript

**Contexto.** El sitio anterior estaba en TypeScript.

**Decisión.** Solo JavaScript (`.astro`, `.js`, `.jsx`). El `tsconfig` usa el
preset `base` de Astro, sin modo estricto.

**Por qué.** Preferencia del autor. El preset `strict` de la plantilla solo
producía errores de tipos en el editor ("any implícito") que no afectan el
build; el `tsconfig` queda para que el editor entienda los imports y el JSX.

---

## Ruteo, idiomas y navegación

### i18n nativo de Astro con prefijo en todos los idiomas

**Contexto.** El sitio publicado sirve `/en` y `/es`, y `/` lleva siempre a
`/en`. Esas URLs ya circulan.

**Decisión.** i18n nativo de Astro con `defaultLocale: "en"` y
`prefixDefaultLocale: true`: hasta el inglés lleva `/en` en la URL.

**Por qué.** Mantiene las mismas URLs. Detectar el idioma del navegador
exigiría renderizar a pedido, y el sitio es estático.

### Redirección de `/` hecha a mano

*Reemplaza el uso de `redirectToDefaultLocale: true` que se había previsto.*

**Contexto.** Con `redirectToDefaultLocale: true`, el build estático genera
`/` como una página con meta refresh de 2 segundos y da un warning de rutas en
conflicto con `src/pages/index.astro`, que es obligatorio.

**Decisión.** `redirectToDefaultLocale: false`, y `src/pages/index.astro`
redirige con `Astro.redirect('/en/', 307)`.

**Por qué.** Sale sin warning y con refresh de 0 segundos, como la redirección
inmediata del sitio anterior. Que sea una redirección HTTP real depende del
adapter de Vercel, que se suma con el endpoint de la API.

### Barra final en todas las URLs

**Contexto.** Lenis intercepta un ancla solo si el pathname del link coincide
exactamente con el de la página. Si la misma página se puede abrir como `/en`
y como `/en/`, el link `/en/#projects` recarga la página en vez de scrollear
cuando se entró por la otra forma.

**Decisión.** `trailingSlash: 'always'` en Astro y `"trailingSlash": true` en
`vercel.json`, que redirige con 308 la URL sin barra a la que la tiene.

**Por qué.** Cada página tiene una sola URL, y las anclas funcionan entren por
donde entren. Las rutas con extensión de archivo (el CV) no reciben barra,
según la documentación de Vercel.

### Navegación de página completa con transiciones CSS

**Contexto.** Astro permite navegar como una SPA (`ClientRouter`) o como un
sitio de páginas completas.

**Decisión.** Páginas completas, con `@view-transition { navigation: auto; }`
en CSS para la transición entre páginas. `ClientRouter` se evalúa aparte.

**Por qué.** Cada página arranca limpia: no hay estado que reiniciar entre
páginas (scroll, cursor, animaciones). En los navegadores sin soporte de
`@view-transition` la regla se ignora y la navegación es normal, sin
animación.

### Selector de idioma con links

**Contexto.** En el sitio anterior eran botones que cambiaban de idioma por
JavaScript.

**Decisión.** Links (`<a>`) armados en el servidor, con `hreflang`, `lang` y
`aria-current="page"` en el idioma activo. Cada idioma se nombra en su propio
idioma ("English", "Español").

**Por qué.** Funcionan sin JavaScript y son lo que son: navegación a otra
página. Nombrar cada idioma en su idioma es la recomendación del W3C para los
selectores: quien busca el suyo lo reconoce aunque no entienda la página.

---

## Textos y metadata

### Diccionarios JSON y una función `t()` propia

**Contexto.** El sitio anterior usaba next-intl con dos diccionarios
(`es.json`, `en.json`).

**Decisión.** Se conservan los diccionarios y se leen con una función `t()`
propia, en el servidor. Las islas de React reciben los textos ya traducidos
como props.

**Por qué.** No mandar el diccionario entero al navegador: cada isla recibe
solo los textos que usa.

### Ningún texto fijo en un idioma

**Contexto.** En el sitio anterior, los `aria-label` estaban fijos en
castellano y el texto del cursor en inglés, en las dos versiones.

**Decisión.** Todo texto visible o accesible sale de los diccionarios.

**Por qué.** Un lector de pantalla en `/en` anunciaba los controles en
castellano.

### Metadata desde los diccionarios

**Contexto.** En el sitio anterior, el título, la descripción y Open Graph
estaban fijos en inglés para los dos idiomas.

**Decisión.** Pasan a un bloque `meta` en los dos diccionarios, con los mismos
textos en inglés.

**Por qué.** El HTML sale igual que antes, y la versión en castellano se puede
traducir sin tocar código.

### Sin canonical por ahora

**Contexto.** El sitio publicado no tiene `<link rel="canonical">` y su
`og:url` apunta siempre a la raíz.

**Decisión.** Se mantiene igual.

**Por qué.** Paridad. Canonical por página, `hreflang` y `og:url` por página
quedan como mejora de SEO posterior.

---

## Estilos, tema y fuentes

### Tema aplicado antes de pintar

**Contexto.** El sitio tiene tema oscuro (por defecto) y claro, y la elección
se guarda en el navegador.

**Decisión.** Un script inline en el `<head>` lee la preferencia guardada y
pone la clase del tema en `<html>` antes de pintar. Usa la misma clave que el
sitio anterior (`theme`).

**Por qué.** Sin parpadeo al cargar, y quien ya eligió un tema lo conserva.

### API de fuentes de Astro

**Contexto.** El sitio anterior cargaba las fuentes con `next/font`, que las
sirve desde el propio sitio y genera fallbacks ajustados para que el cambio de
fuente no mueva el texto.

**Decisión.** API de fuentes de Astro, no Fontsource.

**Por qué.** Hace lo mismo que `next/font` desde la configuración: descarga
las fuentes en el build, genera los fallbacks con métricas ajustadas y agrega
el preload.

---

## Islas y capa creativa

### Cada contexto de React se resuelve sin contexto

**Contexto.** En el sitio anterior, cuatro contextos de React envolvían el
sitio entero: cursor, tema, textos y movimiento reducido. En Astro cada isla
es su propia app de React y el contexto no cruza de una a otra.

**Decisión.**

- **Cursor**: cualquier elemento declara su variante con un atributo
  (`data-cursor="link"`) y el cursor escucha un solo `mouseover` en el
  documento.
- **Tema**: vive en la clase de `<html>`, que el navbar lee y escribe.
- **Textos**: cada isla los recibe como props.
- **Movimiento reducido**: `<MotionConfig reducedMotion="user">` en cada isla
  que anima.

**Por qué.** Un atributo lo puede poner tanto una isla como un `.astro` sin
JavaScript, sin conocer al cursor. Y como la variante sale del elemento que
está bajo el puntero, no puede quedar "pegada" después de un click, un bug que
el sitio anterior resolvía reseteando en cada cambio de ruta.

### Directiva de hidratación según cuándo hace falta el JavaScript

**Decisión.** `client:load` para lo que está a la vista y responde desde el
primer momento (navbar, wordmark del Hero, título del caso); `client:idle`
para la grilla de puntos, que es fondo; `client:visible` para lo que está más
abajo (cards, imágenes del caso, Contact, Footer); `client:only` para el
cursor, que depende del mouse y no tiene nada que dibujar en el servidor.

**Por qué.** Cada isla descarga y ejecuta su JavaScript recién cuando lo
necesita. La grilla de puntos se separó del resto del Hero en su propia isla
justamente para poder esperar.

### Animaciones de entrada sin React

**Contexto.** Varias secciones (el header, la barra de metadata y las
secciones del caso; Projects, About y Stack) solo tienen un fade al entrar en
pantalla.

**Decisión.** Un script chico con `IntersectionObserver` agrega una clase y el
CSS hace la transición, con los mismos tiempos y la misma curva que en Framer
Motion. El HTML marca qué se mueve (`data-reveal`, con sus valores en
variables CSS) y qué dispara la animación (`data-reveal-trigger`).

**Por qué.** No cargar React para un fade. Separar disparador y elemento
permite escribir una cascada con un solo disparador y un delay por hijo.

### Títulos letra por letra como isla chica

**Contexto.** El título del caso y el de Projects entran letra por letra con
`SplitText`, un componente de React con Framer Motion, adentro de componentes
que no son islas.

**Decisión.** Solo `SplitText` es isla; el componente que lo contiene sigue
siendo `.astro`.

**Por qué.** Rehacerlo en CSS duplicaría un componente que ya resuelve la
accesibilidad (texto entero para lectores de pantalla, letras con
`aria-hidden`) y que el Hero y Contact siguen usando. Convertir en isla el
componente entero mandaría al navegador el markup y los textos de bloques que
solo necesitan un fade. La isla se renderiza en el servidor, así que el título
está en el HTML.

### Movimiento reducido: sin desplazamiento, con fade

**Contexto.** Con `reducedMotion="user"`, Framer anula los transforms y
conserva la opacidad (documentación de Motion y su código).

**Decisión.** Las entradas en CSS hacen lo mismo: con movimiento reducido
pierden el desplazamiento y conservan el fade, con la misma duración.

**Por qué.** Paridad con el comportamiento real del sitio anterior. El
movimiento es lo que molesta; un cambio de opacidad no desplaza nada.

### Contenido visible sin JavaScript

**Decisión.** Un `<noscript>` en el `<head>` muestra quietos los bloques con
animación de entrada.

**Por qué.** Arrancan con opacidad 0 y, sin el script que los revela,
quedarían invisibles. En el sitio anterior pasaba eso.

---

## Imágenes

### `astro:assets` con imágenes en `src/assets/`

**Contexto.** Las imágenes del sitio anterior pasaban por `next/image`.

**Decisión.** `<Image>` y `<Picture>` de `astro:assets`, con las imágenes en
`src/assets/`. Un módulo propio (`imageSpec`) sigue decidiendo ancho, recorte y
`sizes` según el tipo de imagen.

**Por qué.** Astro solo optimiza las imágenes de `src/`. Las de `public/` se
sirven tal cual.

### Imágenes optimizadas dentro de las islas con `getImage()`

**Contexto.** La card de proyecto y la imagen del caso (con parallax) son
islas de React, y el `<Image />` de Astro no se puede usar adentro. La
documentación ofrece dos vías: pasarle a la isla el `<Image />` ya renderizado
como hijo, o generar la imagen con `getImage()` y pasarle los datos.

**Decisión.** `getImage()` en el `.astro`. La isla recibe `src`, `srcset` y
`sizes` como props y arma su propio `<img>`.

**Por qué.** El parallax anima el propio `<img>` con Framer Motion. Si la
imagen llegara como HTML ya renderizado, Framer no podría animarla y habría
que cambiar el markup.

### Anchos y calidad de las imágenes iguales a `next/image`

**Decisión.** El `srcset` usa los anchos que generaba `next/image` por
defecto (640 a 2048 px) hasta el ancho del archivo, más el original. Calidad
75.

**Por qué.** Paridad: cada dispositivo baja una variante del mismo tamaño que
antes. Nunca se genera una variante más grande que el archivo.

### Imagen de Open Graph estática

**Contexto.** El sitio anterior generaba la imagen de Open Graph en el build,
con satori. La imagen es solo la marca, sin texto.

**Decisión.** Un PNG estático en `public/og-image.png`.

**Por qué.** Sin texto no hay nada que generar por idioma: el resultado es el
mismo, sin la dependencia.

---

## Datos dinámicos

### Last.fm como fuente dinámica

**Contexto.** El portfolio consume una API externa.

**Decisión.** Last.fm (`user.getRecentTracks`), a través de un endpoint propio
renderizado a pedido, con caché en la CDN de Vercel. El navegador nunca llama a
Last.fm directo.

**Por qué.** La clave es simple y no vence, y queda del lado del servidor. Si
la conexión de Last.fm con Spotify se corta, el widget muestra lo último
escuchado en vez de romperse.

### La interacción principal está en el widget de música

**Decisión.** El widget permite alternar entre "ahora" y "últimos 5", y elegir
un tema para ver su detalle.

**Por qué.** Junta en un componente la API, sus estados (carga, error, vacío)
y una interacción que cambia lo que se muestra.

---

## Repositorio

### El CV no se versiona

**Contexto.** El sitio publicado sirve el CV en `/tiago-collado-cv.pdf`, y esa
URL ya circula. Este repositorio es público.

**Decisión.** El PDF no entra al repositorio. La URL redirige con un 307 a una
copia alojada afuera.

**Por qué.** El CV es un documento aparte del sitio. Con la redirección, la
URL que ya circula sigue funcionando.

### Redirección del CV en `vercel.json`

**Contexto.** La redirección tiene que ser 307. La opción `redirects` de
Astro acepta 307, pero en un build estático sin adapter genera una página con
meta refresh, sin código de estado. `vercel.json` con `"permanent": false` da
un 307 real y acepta un destino externo, según la documentación de Vercel.

**Decisión.** `vercel.json`.

**Por qué.** Da el 307 con el sitio estático. Queda por verificar si sigue
aplicando cuando se sume el adapter de Vercel para el endpoint de la API: la
documentación no lo aclara, así que se prueba con `curl` en staging.

### Componentes de página compartidos entre idiomas

**Contexto.** Con carpetas por idioma, `/en` y `/es` tienen cada una su
archivo de home y de caso de estudio.

**Decisión.** Las páginas de cada idioma son mínimas y usan un componente
compartido (`HomePage.astro`, `CaseStudyPage.astro`). Las de caso de estudio
tienen su propio `getStaticPaths()`, que solo genera los proyectos publicados.

**Por qué.** Una sola fuente para cada página: los dos idiomas no pueden
divergir en markup.

### Instrucciones del asistente de IA en el repositorio

**Decisión.** `CLAUDE.md`, `AGENTS.md` (el de la plantilla de Astro) y
`.claude/rules/` se versionan.

**Por qué.** `AGENTS.md` trae las instrucciones del servidor de desarrollo y
los links a las guías oficiales de Astro. `CLAUDE.md` y las reglas documentan
los criterios de diseño y los errores conocidos del stack con los que trabaja
el asistente (ver [uso-de-ia.md](uso-de-ia.md)).
