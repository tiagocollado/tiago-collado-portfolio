# Bitácora

Cómo se construyó el portfolio, por etapas: qué se hizo en cada una y qué
costó. Las decisiones con su porqué están en [decisiones.md](decisiones.md); las
fechas, en el historial de git.

**Punto de partida.** El portfolio ya existía, publicado en
[tiagocollado.vercel.app](https://tiagocollado.vercel.app), hecho con Next.js y
TypeScript. Este repositorio lo reconstruye en Astro y JavaScript. La primera
meta es la paridad: el sitio nuevo tiene que verse y comportarse igual que el
publicado, en las mismas URLs. Los cambios de diseño vienen después, sobre una
base que ya funciona.

---

## Antecedente: la versión en Next

**Qué se hizo.** El portfolio completo en inglés y castellano, con descarga
del CV. Encima, una capa de frontend creativo: scroll suave, cursor propio,
revelado de texto letra por letra, botones magnéticos, el marquee de servicios
y un bloque de cierre que une contacto y footer. Después, las imágenes: covers
del home con un barrido terracota en hover y casos de estudio armados como una
secuencia de bloques con un vocabulario de tipos de imagen.

**Qué costó.**

- **Un reset global sin `@layer` anulaba todas las utilities de espaciado de
  Tailwind v4**, sin ningún error. Es la primera regla de
  [errores conocidos del stack](../../.claude/rules/stack-traps.md).
- **Mockups con texto inventado.** Los generadores de imágenes redibujan el
  texto chico y producen palabras que no existen. Se reemplazaron por capturas
  reales del sitio de cada proyecto, y el control quedó como regla: abrir la
  imagen al 100% y leer el párrafo más chico antes de medir nada.
- **Copy que no se podía defender.** El texto de cada caso se contrastó contra
  la evidencia (el sitio publicado o el código). El caso de El Ritual del Tono
  se armó contra su repositorio: el diagrama del modelo de datos sale de los
  esquemas reales del backend. En esa revisión cerré las rutas de escritura de
  `/products`, que estaban abiertas, corregí la respuesta 404 de las rutas
  inexistentes y agregué reintento de conexión a la base de datos.

---

## Repositorio y entorno

**Qué se hizo.** Repositorio nuevo a partir de la plantilla mínima de Astro,
con `.gitignore` para Astro, Vercel y variables de entorno (solo se versiona
`.env.example`). Las reglas de diseño, de imágenes y de errores conocidos del
proyecto anterior pasaron a `.claude/rules/`, adaptadas a Astro. Un proyecto de
staging en Vercel sale de este repositorio, mientras el sitio publicado sigue
saliendo del anterior hasta el cambio, así la URL pública no se cae en el
medio.

**Qué costó.** Los archivos del proyecto anterior tenían finales de línea CRLF
y este repositorio usa LF (`.gitattributes`): los reemplazos de texto exacto
fallaban hasta normalizarlos.

---

## Base: estilos, fuentes, tema e idiomas

**Qué se hizo.** Tailwind v4 con `@tailwindcss/vite`, los tokens de marca y
los estilos globales; las tres fuentes con la API de fuentes de Astro; el
layout con metadata y Open Graph; el tema claro y oscuro; las rutas `/en` y
`/es` con el i18n nativo de Astro y una función `t()` que lee los
diccionarios.

**Qué costó.**

- **La redirección de `/` a `/en`.** La opción `redirectToDefaultLocale`
  genera, en un build estático, una página con meta refresh de 2 segundos y un
  warning de rutas en conflicto con `src/pages/index.astro`, que es
  obligatorio. La guía de i18n no dice qué genera `/`: lo averigüé buildeando y
  leyendo el código de Astro. Quedó una redirección hecha a mano en
  `index.astro`, sin warning y con refresh de 0 segundos.
- **El tema sin parpadeo.** Para que quien ya visitó el sitio conserve su
  elección, el script replica lo que hacía `next-themes` (leído en su código):
  misma clave en `localStorage`, la clase en `<html>` y `color-scheme`. Va
  inline en el `<head>`, porque los scripts que procesa Astro son módulos y
  corren después de pintar.
- **Comentarios publicados.** Lo que va adentro de un `<script is:inline>`
  sale tal cual en el HTML, comentarios incluidos. La explicación pasó a un
  comentario de Astro, que no se publica.

---

## Contenido y casos de estudio

**Qué se hizo.** Los datos de los proyectos y del stack, con el mismo copy del
sitio publicado; las 17 imágenes, idénticas a las originales (verificado con
md5); las secciones de la home y del caso de estudio como componentes `.astro`;
las páginas de los tres casos en los dos idiomas, generadas solo para los
proyectos publicados; la redirección 307 del CV.

**Qué costó.**

- **Imágenes optimizadas dentro de las islas.** El `<Image />` de Astro no
  funciona en un componente de React. La isla recibe `src`, `srcset` y `sizes`
  generados con `getImage()` en el `.astro`. La función quedó en un módulo
  propio, porque `getImage()` rompe si llega al navegador y el módulo de
  especificaciones de imagen también lo usa la isla.
- **Versiones.** `npm install` traía versiones más nuevas de Framer Motion,
  Lucide y Simple Icons. Se fijaron las del sitio publicado, para que los
  íconos y las animaciones salgan idénticos.
- **Falsos positivos en los controles de texto.** `git grep` también busca
  adentro de los JPG, donde aparecen por azar secuencias que coinciden con
  palabras cortas. Los controles se corren con `-I`, que saltea los binarios.

---

## Capa creativa

**Qué se hizo.** Smooth scroll con Lenis, cursor propio, navbar, Hero con el
wordmark que se achica con el scroll, Contact, Footer en todas las páginas y
las animaciones de entrada de las secciones. Los textos accesibles, que en el
sitio anterior estaban fijos en castellano en las dos versiones, salen de los
diccionarios. El texto del cursor ("View" / "Ver") también.

**Qué costó.**

- **El contexto de React no cruza entre islas.** En el sitio anterior, cuatro
  contextos envolvían todo: cursor, tema, textos y movimiento reducido. Cada
  uno se resolvió distinto ([decisiones](decisiones.md#islas-y-capa-creativa)):
  el cursor lee un atributo `data-cursor` del HTML, el tema vive en la clase de
  `<html>`, cada isla recibe sus textos como props y lleva su propio
  `MotionConfig`.
- **La grilla de puntos quedaba quieta, sin ningún error.** Medía y escuchaba
  el mouse en su elemento padre. Al pasar a ser una isla aparte, su padre pasó
  a ser el envoltorio `<astro-island>`, que tiene `display: contents`: mide
  0 × 0 y no recibe eventos. Ahora toma el ancestro posicionado más cercano
  (`offsetParent`), que es la sección del Hero.
- **Anclas que recargaban la página.** Lenis intercepta un ancla solo si el
  pathname del link coincide exactamente con el de la página: entrando por
  `/en`, el link `/en/#projects` recargaba en vez de scrollear. Se resolvió con
  la barra final obligatoria en todas las URLs.
- **Animaciones de entrada sin React.** Un script de 0,4 KB
  (`src/scripts/reveal.js`) agrega una clase cuando un bloque entra en
  pantalla, y el CSS hace el fade y la subida, con los mismos tiempos y la
  misma curva que tenían en Framer Motion. La documentación de Motion no dice
  cómo traduce sus márgenes al `IntersectionObserver` ni cómo reparte las
  cascadas: lo leí en su código instalado.
- **Entradas al cargar que no animaban.** Una transición CSS solo corre si el
  navegador ya pintó el estado de partida, y el script puede ejecutarse antes
  del primer cuadro. Esas entradas esperan dos `requestAnimationFrame`.
- **Movimiento reducido.** Framer, con `reducedMotion="user"`, anula los
  transforms pero conserva el fade de opacidad; un comentario del sitio
  anterior decía que anulaba todo. Las entradas en CSS replican el
  comportamiento real, y para eso le ganan por especificidad a la regla global
  que deja todas las transiciones en 0,01 ms.
- **Un hover que pisaba una entrada.** El link de volver del caso tiene
  `transition-all` para su hover, que reemplazaría la transición de entrada.
  La entrada va en el elemento que lo envuelve.
- **Un carácter invisible.** El espacio duro del claim del About era un
  carácter literal que al leer el archivo no se distingue de un espacio común,
  y llegó a confundirse con un bug. Pasó a una constante con nombre
  (`NO_BREAK_SPACE`) definida con su secuencia de escape.

---

## Cómo se verifica

En cada etapa, antes de commitear:

- `npm run build` sin errores ni warnings, y ningún `.ts` en `src/`.
- Sobre el HTML generado, no sobre el código: un `<main>`, un `<nav>`, un
  `<header>` y un `<footer role="contentinfo">` por página; `id="top"` en cada
  página con back-to-top; el outline de headings sin saltos; ninguna imagen
  sin `alt`.
- Que las islas reciban solo los textos y datos que muestran: ningún texto de
  otros proyectos ni de otros idiomas viaja al navegador.
- Un control de secretos y otro de palabras que no corresponden al
  repositorio, los dos con `git grep -I`.
- JavaScript por página, con gzip: ~134 KB en la home y ~128 KB en un caso de
  estudio. React y Framer Motion son ~106 KB de eso y los comparten todas las
  islas.

## Abierto

- **Probar en el navegador** todo lo interactivo (cursor, menú, tema,
  wordmark, parallax, grilla de puntos, entradas, copiado del mail,
  back-to-top), en los dos idiomas, con movimiento reducido y en táctil.
- **Repetir las redirecciones con el adapter de Vercel.** Sin el adapter ya
  están verificadas en staging: `/en` y las páginas de caso sin barra final
  redirigen con 308 a su versión con barra, y `/tiago-collado-cv.pdf` da 307
  directo al CV, sin recibir barra. El adapter cambia cómo se arma la salida
  del build, así que las tres se vuelven a probar cuando se sume.
- **Títulos sin JavaScript.** Los títulos que entran letra por letra salen del
  servidor con cada letra en opacidad 0, así que sin JavaScript no se ven
  (los lectores de pantalla sí los leen). Pasaba igual en el sitio anterior.
  Los demás bloques animados ya se muestran sin JavaScript.
