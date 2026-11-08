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
- **El cursor aparecía en la esquina al cargar cada página.** Su posición
  arranca en (0, 0) hasta el primer movimiento del mouse. En el sitio anterior
  la navegación era del lado del cliente y el cursor persistía entre páginas,
  así que no se notaba; con navegación de página completa pasa en cada carga.
  Ahora no se dibuja hasta el primer movimiento, y ese primer movimiento lo
  ubica sin animar, en vez de hacerlo viajar desde la esquina.

---

## Datos en vivo: Last.fm

**Qué se hizo.** El adapter de Vercel, con el sitio todavía estático salvo una
ruta; las variables de entorno validadas con `astro:env`; el endpoint
`/api/now-playing.json`, que pide a Last.fm lo que estoy escuchando y lo
devuelve normalizado, con un estado para cada error y caché en la CDN; y el
widget en el About, con sus seis estados. Las dos redirecciones del sitio (`/`
y el CV) pasaron a ser HTTP reales desde la configuración de Astro.

Después, la interacción del widget, que terminó en ninguna. Primero fueron
pestañas "Ahora / Últimos 5" con el patrón Tabs de WAI-ARIA y un alto que se
anima al cambiar de vista o de estado: funcionaban, pero no transmitían
música y estaban pensadas alrededor del tema que suena, que es la excepción.
Después, un tocadiscos con selección: un vinilo dibujado en SVG con la G
como etiqueta y, abajo, los últimos cinco temas como un listbox, donde
elegir uno lo ponía en el plato. Transmitía música, pero elegir un tema no
aportaba nada que la lista no mostrara. El widget quedó pasivo: arriba el
tema que suena o el último, abajo la lista, y el título y cada fila como
links a Last.fm. El disco gira siempre, como ambiente, y si estoy escuchando
lo dice un cartel "En vivo", prendido o apagado. La interacción significativa
del sitio pasa al cambio de tema claro / oscuro, que se rediseña junto con
la revisión de la identidad visual. El detalle por tema quedó afuera en todas las versiones (ver
[decisiones.md](decisiones.md): "Sin detalle por tema", "De pestañas a
tocadiscos", "El widget queda pasivo" y "El disco gira siempre").

**Qué costó.**

- **`vercel.json` dejó de ser confiable.** Con el adapter, el build le pasa a
  Vercel la configuración de rutas ya armada, y el código del adapter muestra
  que la arma solo desde `astro.config.mjs`: no copia los `redirects` de
  `vercel.json`. La documentación de Vercel no dice si igual los aplica. En
  vez de depender de eso, la redirección del CV y la barra final pasaron a la
  configuración de Astro, y `vercel.json` se eliminó. Verificado en staging:
  `/en` da 308, el CV da 307.
- **`/` seguía siendo un meta refresh.** `index.astro` es una página
  prerenderizada y el adapter no cambia eso. Una regla de `redirects` para `/`
  da un 307 real, pero contradice la documentación, que dice que la página
  gana. Lo comprobé buildeando: el adapter escribe la regla y Astro deja de
  generar la página. Como no está documentado, la configuración generada se
  revisa después de cada actualización (ver "Cómo se verifica").
- **Una variable secreta obligatoria rompe el endpoint sin explicación.**
  Astro valida las secretas al importarlas: si falta, el módulo falla al
  cargar y la respuesta es un 500 genérico. Las dos variables son opcionales
  y el endpoint chequea que estén, para responder `not-configured`.
- **Lo que la documentación de Last.fm no dice.** Lo averigüé con pedidos
  reales: los errores llegan como JSON con un status HTTP distinto de 200 (así
  que el JSON se lee siempre); no manda headers de caché, así que no hay una
  duración suya que respetar; el error 6, que la documentación describe como
  "faltan parámetros", es el que devuelve para un usuario inexistente; y con
  un solo tema devuelve un objeto en vez de una lista. Que el error 17
  signifique "perfil privado" es comportamiento conocido, no documentado para
  este método.
- **Probar cada estado sin romper nada.** Para forzar los errores de Last.fm,
  el tiempo agotado y las respuestas inesperadas, el servidor de desarrollo
  cargó un reemplazo de `fetch`, fuera del repositorio, que intercepta solo los
  pedidos a Last.fm. Así se probaron los diecisiete casos sin tocar el código
  del endpoint.
- **La clave viaja en la URL del pedido a Last.fm.** Por eso el endpoint
  nunca loguea la URL, ni siquiera en los errores de red.
- **Los términos de Last.fm.** Excluyen las imágenes y el arte de los discos,
  así que el widget no muestra portadas. Piden acreditar con un botón
  *"powered by AudioScrobbler"* que Last.fm ya no publica: el crédito es un
  link de texto, "vía Last.fm". El título del tema destacado enlaza a su
  página en Last.fm.
- **Un widget que cambia de alto.** En la versión con pestañas, la lista era
  bastante más alta que la vista Ahora. En escritorio el widget iba alineado
  arriba con el texto del About, así solo se estiraba hacia abajo y el texto
  de al lado no se movía. Para que tampoco saltara lo que viene después, la
  tarjeta anima su alto. CSS no anima desde ni hacia `auto`, así que un
  `ResizeObserver` mide el contenido y el alto se pasa en píxeles; la tarjeta
  usa `box-content` para que el borde quede fuera de esa medida. La primera
  medida se aplica sin animar, porque parte de `auto`. En el tocadiscos, el
  tema de arriba mide siempre lo que el disco: el título se corta en dos
  líneas, con `text-wrap: balance` para que no quede una palabra sola en la
  segunda.
- **Estados sin datos demasiado grandes.** La altura mínima pensada para un
  tema dejaba los mensajes de vacío y de error en una tarjeta grande y casi
  vacía. Con el alto animado ya no hace falta: el esqueleto de carga tiene
  las medidas del contenido más común, y en el tocadiscos los mensajes van al
  lado del disco.
- **Un widget pensado para la excepción.** Las pestañas giraban alrededor de
  "sonando ahora", y la mayoría de las visitas caen cuando no estoy
  escuchando: la pestaña "Ahora" terminaba mostrando un tema del pasado con
  "hace X". Se vio recién con el widget construido. El tocadiscos parte del
  caso común: siempre hay un tema en el plato.
- **Una interacción que no aportaba.** En el tocadiscos con selección, elegir
  un tema de la lista lo ponía arriba, más grande, con los mismos título y
  artista que ya se veían en la fila. Era un listbox entero (teclado, estado,
  anuncio de control para el lector de pantalla) para no cambiar nada que
  importara. Se sacó: las filas pasaron a ser links a Last.fm, como el
  título de arriba, y la interacción significativa del sitio pasa al cambio
  de tema.
- **Un disco que nunca se pausó.** En la primera versión del tocadiscos el
  disco tenía que girar solo si el tema sonaba. Tenía
  `motion-safe:animate-spin-record` (el shorthand `animation`) y, para
  pausarlo, `[animation-play-state:paused]`. Tailwind v4 escribe la regla de
  la variante dentro de un `@media`, en la misma capa, con la misma
  especificidad y **después** de la otra: su `animation` resetea
  `animation-play-state` y el disco giraba siempre. El build pasó, la clase
  estaba en el HTML, y las pruebas con jsdom miraban las clases, no el efecto:
  se vio en el navegador. Quedó anotado en las trampas del stack.
- **Del giro como señal al giro como ambiente.** Con el disco quieto casi
  todo el tiempo (casi nunca suena nada cuando alguien entra), el widget no
  decía "música". El giro pasó a ser permanente y el estado real a un cartel
  "En vivo", como el "On Air" de un estudio. La media vuelta de feedback al
  poner un tema, que tenía sentido sobre un disco quieto, sobre uno que gira
  se leía como una aceleración: primero la reemplazó una escala corta (el
  disco se asentaba en el plato), y después se sacó también.
- **Un widget que le ganaba al texto.** Visto en staging, el widget empujaba
  el texto del About, estiraba la sección y competía con su eyebrow, y el
  cartel tenía un punto que pulsaba con brillo. Se reordenó la jerarquía: el
  texto vuelve a su posición original, el widget va después de la firma y,
  en escritorio, en posición absoluta, alineado abajo con ella. El cartel
  pasó a un rectángulo que se prende sin efectos, y se sacó la escala al
  elegir un tema. Lo que costó fue el alto: en posición absoluta, el
  widget tenía que entrar en el alto del copy sin pegarse al claim. Medido
  en Chrome headless (por el protocolo de DevTools, sin dependencias en el
  repositorio), la primera versión compacta medía 381 px contra 292 del copy
  y quedaba a 7 px del claim. Con el crédito en la fila del cartel y las filas
  a 28 px con puntero fino (44 px con el dedo) bajó a 328 px y quedó a 60 px.
- **El "·" suelto.** En la lista, cuando el título se cortaba, el separador
  entre título y artista quedaba solo al final. Ahora el separador va adentro
  del bloque del artista, y la línea usa `flex-wrap` con el alto de una sola
  línea y `overflow-hidden`: el artista entra entero al lado del título o baja
  a una segunda línea que no se ve, y se lleva el separador.
- **Probar la isla sin navegador.** Para recorrer cada estado, la isla real se
  montó en jsdom, instalado fuera del repositorio, con respuestas falsas del
  endpoint. Se probaron los datos con y sin un tema sonando, la lista con uno
  o con seis temas, las filas sin artista, los cinco tipos de error, la falla
  de red y el JSON inválido; además, los links de las filas (destino, pestaña
  nueva y aviso para lector de pantalla), los atributos ARIA y el cartel
  prendido y apagado. **Límite**: jsdom no aplica CSS, así que estas pruebas
  confirman qué clases tiene cada elemento, no qué hace la cascada. Lo que
  depende del orden de las reglas se revisa en el CSS del build y en el
  navegador.

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
  repositorio, los dos con `git grep -I`. Además, que el valor de la clave de
  Last.fm no aparezca en ningún archivo de la salida del build
  (`.vercel/output/`, incluida la función del servidor) ni del repositorio.
  El script que lo busca imprime solo nombres de archivo, nunca el valor.
- En staging, con `curl -I`: `/` da 307 a `/en/`, `/en` y las páginas de caso
  sin barra dan 308 a su versión con barra, `/tiago-collado-cv.pdf` da 307 al
  CV, una URL inexistente da 404 y el endpoint responde con
  `X-Vercel-Cache: HIT` en el segundo pedido.
- Después de actualizar Astro o el adapter de Vercel: que
  `.vercel/output/config.json` siga teniendo la regla de `/` con 307 y que no
  exista `.vercel/output/static/index.html`.
- Los estados del widget de música, con la isla montada en jsdom (fuera del
  repositorio) y respuestas falsas del endpoint: cada estado, los links de la
  lista, sus atributos ARIA y el cartel "En vivo". Como jsdom no aplica CSS,
  lo que depende de la cascada se revisa además en el CSS del build, y el
  layout (por ejemplo, que el widget no supere al texto del About) se mide
  en Chrome headless.
- JavaScript por página, con gzip: ~137 KB en la home y ~128 KB en un caso de
  estudio. React y Framer Motion son ~106 KB de eso y los comparten todas las
  islas; el widget de música suma 2,6 KB.

## Abierto

- **Probar en el navegador** todo lo interactivo (cursor, menú, tema,
  wordmark, parallax, grilla de puntos, entradas, copiado del mail,
  back-to-top, widget de música), en los dos idiomas, con movimiento
  reducido y en táctil.
- **El cambio de tema como interacción principal.** El widget de música
  quedó pasivo, y la interacción significativa del sitio pasa al cambio de
  tema claro / oscuro, que se rediseña junto con la revisión de la identidad
  visual. Hasta entonces, la interacción que modifica la experiencia es el
  cambio de tema actual.
- **Links que abren en otra pestaña sin avisarlo.** Los links externos de la
  barra de metadata de los casos abren en una pestaña nueva y no lo anuncian a
  los lectores de pantalla; los del widget de música sí. Hay que igualarlos.
- **Títulos sin JavaScript.** Los títulos que entran letra por letra salen del
  servidor con cada letra en opacidad 0, así que sin JavaScript no se ven
  (los lectores de pantalla sí los leen). Pasaba igual en el sitio anterior.
  Los demás bloques animados ya se muestran sin JavaScript.
