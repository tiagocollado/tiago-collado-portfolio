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

### Redirección de `/` en la configuración de Astro

*Reemplaza a "Redirección de `/` hecha a mano".*

**Contexto.** Con el adapter de Vercel, `index.astro` sigue siendo una página
prerenderizada: `/` responde 200 con un meta refresh, no una redirección HTTP.
Es la URL que más circula del sitio.

**Decisión.** `/` redirige con un 307 desde los `redirects` de
`astro.config.mjs`, como el CV. `src/pages/index.astro` se queda: el i18n lo
exige con `prefixDefaultLocale: true`, y sigue redirigiendo por su cuenta si
la regla deja de aplicarse.

**Por qué.** Es una redirección HTTP real que resuelve el CDN de Vercel, sin
servir una página intermedia ni ejecutar la función. El costo: la
documentación de routing dice que una página le gana a un redirect en la
misma ruta, y en el build pasa al revés (el adapter escribe la regla y Astro
deja de generar `index.html`). Como es un comportamiento observado y no
documentado, se revisa la configuración generada después de cada
actualización de Astro o del adapter.

### Barra final en todas las URLs

**Contexto.** Lenis intercepta un ancla solo si el pathname del link coincide
exactamente con el de la página. Si la misma página se puede abrir como `/en`
y como `/en/`, el link `/en/#projects` recarga la página en vez de scrollear
cuando se entró por la otra forma.

**Decisión.** `trailingSlash: 'always'` en Astro. El adapter de Vercel lo
traduce a la configuración de rutas del deploy, que redirige con 308 la URL
sin barra a la que la tiene.

**Por qué.** Cada página tiene una sola URL, y las anclas funcionan entren por
donde entren. Las rutas con extensión de archivo (el CV) no reciben barra,
según la documentación de Vercel.

### Navegación de página completa con transiciones CSS

**Contexto.** Astro permite navegar como una SPA (`ClientRouter`) o como un
sitio de páginas completas.

**Decisión.** Páginas completas, con `@view-transition { navigation: auto; }`
en CSS para la transición entre páginas. `ClientRouter` no se adopta mientras
el sitio no esté en producción.

**Por qué.** Cada página arranca limpia: no hay estado que reiniciar entre
páginas (scroll, cursor, animaciones). En los navegadores sin soporte de
`@view-transition` (hoy, Firefox estable) la regla se ignora y la navegación
es normal, sin animación.

`ClientRouter` haría persistir el cursor y el scroll suave entre páginas, pero
obliga a adaptar todo lo que hoy asume una página nueva: los scripts
empaquetados corren una sola vez (las animaciones de entrada y el skip link no
verían la página siguiente), el tema se tiene que reaplicar después de cada
cambio de página, el scroll se tiene que resetear a mano y la variante del
cursor puede quedar pegada al link que se clickeó. Son fallas que no dan
error. El costo no compensa lo que gana antes de tener el sitio estable en
producción.

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

### La imagen principal del caso, sin preload en el `<head>`

**Contexto.** En el sitio anterior, `next/image` con `priority` agregaba un
`<link rel="preload">` en el `<head>` para la imagen principal de cada caso.
Acá la imagen sale con `fetchpriority="high"`. React 19 también genera un
preload para esa imagen, pero dentro del `<body>`, justo antes del `<img>`,
porque Astro renderiza cada isla por separado.

**Decisión.** Solo `fetchpriority="high"`, sin agregar un preload en el
`<head>`.

**Por qué.** El preload sirve para que el navegador descubra antes un recurso
que encontraría tarde (un fondo de CSS, una imagen que inserta un script). Esta
imagen está en el HTML inicial, así que el navegador la encuentra igual, y
`fetchpriority` ya le da prioridad alta. Agregar el preload obligaría a armar
en el layout el `srcset` y el `sizes` de una imagen que vive en una isla, para
casi ninguna ganancia.

### Imagen de Open Graph estática

**Contexto.** El sitio anterior generaba la imagen de Open Graph en el build,
con satori. La imagen es solo la marca, sin texto.

**Decisión.** Un PNG estático en `public/og-image.png`.

**Por qué.** Sin texto no hay nada que generar por idioma: el resultado es el
mismo, sin la dependencia.

---

## Casos y grilla del home

### Recuérdalo se presenta por lo que resuelve

**Contexto.** La barra de metadata de cada caso tiene un campo de cliente, y
Recuérdalo no tuvo cliente.

**Decisión.** Recuérdalo se presenta por lo que resuelve, accesibilidad para
personas mayores, y la metadata no sugiere un cliente que no hubo: el campo
dice `Caso de estudio · Diseño accesible`.

**Por qué.** Lo que el caso demuestra es cómo diseñar para personas mayores,
con decisiones que salen de la investigación. Eso es lo que le sirve a quien
lo lee, más que el contexto en el que se hizo.

### Un mosaico de pantallas en el cover y el hero de Recuérdalo

**Contexto.** Los covers del home siguen una receta: un dispositivo
protagonista en un entorno real, con luz dura y direccional. El cover y el
hero de cada caso son la misma escena, en dos encuadres.

**Decisión.** Recuérdalo usa en el cover y en el hero un mosaico de pantallas
reales sin marco, inclinado y cortado por los bordes. Los dos siguen saliendo
de la misma escena.

**Por qué.** Recuérdalo es una app con cinco recorridos. Un mosaico muestra
varias pantallas reales a la vez, y así se ve el sistema completo y no una
sola pantalla.

### El home muestra todos los casos publicados

**Contexto.** La grilla del home es masonry de dos columnas y reparte las
cards alternando. Con cinco cards, la izquierda lleva tres y la derecha dos, y
la derecha terminaba una card antes.

**Decisión.** El home muestra las cinco cards publicadas.

**Por qué.** Que se vean todos los casos publicados pesa más que una grilla
pareja. El hueco se achicó después con la card vertical de Pulso Creativo.

### Card vertical para Pulso Creativo

**Contexto.** Con cinco cards, a 1440 px la columna derecha terminaba 636 px
antes que la izquierda. El cover de Pulso es cuadrado, y la laptop ocupa la
mitad de su ancho.

**Decisión.** Una forma de card nueva, `portrait`: 3:4 desde `md` y 4:3 en
mobile. Pulso la usa con el mismo cover, recortado a los costados, y el hueco
baja a 279 px. Se llama igual que la proporción 3:4 de las imágenes del caso,
para que el código tenga un solo nombre para ella.

**Por qué.** 3:4 achica el hueco a menos de la mitad y deja hormigón a los
costados de la laptop. 2:3 lo habría bajado unos 100 px más, con la laptop
justa contra los bordes de la card. En mobile la grilla es de una columna y no
hay hueco que achicar: una card vertical a todo el ancho sería la más alta de
la lista sin ningún motivo.

### Card cuadrada en 4:3 en celular

**Contexto.** La card del caso protagonista, Recuérdalo, es cuadrada. En
celular la grilla es de una columna, y esa card quedaba más alta que las
demás: 327 × 327 px contra 327 × 245 a 375 px de ancho.

**Decisión.** La forma cuadrada rige desde `md`, igual que la vertical. En
celular la card es 4:3, como todas.

**Por qué.** La forma distinta existe para darle peso al caso protagonista en
la grilla de dos columnas. En una sola columna no equilibra nada, y una card
más alta se lee como un error. En escritorio no cambia nada.

---

## Home: Skills, Stack e indexación

### Skills separadas de las herramientas, con evidencia

**Contexto.** El Stack mezclaba herramientas (Figma, React) con conceptos
(UX Research, Prototyping, Accessibility), y el home no decía en qué casos se
ve cada habilidad.

**Decisión.** Dos secciones. Skills: cuatro habilidades (UX Design, UI
Design, Product Thinking, Frontend Development), cada una con sus actividades
y links a los casos donde se ve. Stack: solo herramientas, en cuatro grupos.
Antes de escribirlas se armó una tabla de evidencia con el contenido de los
casos: para cada skill candidata, en qué casos aparece, con qué métodos y con
qué cita. Branding salió porque ningún caso lo respalda; Strategy pasó a ser
Product Thinking, que es lo que muestran los casos (recortar el alcance,
priorizar según el objetivo del negocio, definir el problema con un
benchmark).

**Por qué.** Qué hace una persona y dónde se ve importa antes que con qué
herramientas lo hace. Una skill sin un caso que la respalde no se sostiene.
El Stack lleva solo lo que se puede defender: TypeScript, Node.js y MongoDB
quedan afuera.

### Skills como interacción principal

Reemplaza a "El widget queda pasivo; la interacción significativa pasa al
cambio de tema".

**Contexto.** El widget de música quedó pasivo, y la interacción que cambia
lo que se lee pasaba a ser el cambio de tema.

**Decisión.** La interacción principal del sitio es el índice de Skills:
elegir una skill cambia el panel que se muestra, con sus actividades y sus
casos.

**Por qué.** Cambia el contenido, no solo el aspecto, y lleva a los casos que
respaldan cada skill.

### Las skills se activan con Enter o Espacio, no con el foco

**Contexto.** La primera definición activaba una skill también al recibir
foco de teclado. El panel va debajo de los cuatro nombres.

**Decisión.** Cada nombre es un `<button>` de disclosure (`aria-expanded`,
`aria-controls`) que se activa con click, tap, Enter o Espacio, y, con
puntero fino, con hover después de 150 ms. El foco solo no activa.

**Por qué.** Si el foco activara, al tabular hacia el panel se pasaría por los
otros nombres, cada uno cambiaría la skill activa y con Tab nunca se llegaría
a los links de las tres primeras. Se evaluó también el patrón de pestañas con
flechas, pero cambiaba la semántica pedida; el de disclosure con Enter o
Espacio es el que un usuario de teclado ya conoce. La pausa del hover evita
que bajar el mouse hacia el panel active cualquier nombre que cruce.

### El subrayado de la skill activa cambia de token según el tema

**Contexto.** La skill activa se marcaba solo con el color de la tinta, con
alrededor de 2:1 de diferencia contra las demás: el estado se transmitía
solo por color, y débil.

**Decisión.** Un subrayado terracota como segunda señal, de 0,06em de grosor
y a 0,28em de la línea base, para no tocar los descendentes. En el tema
oscuro usa `--color-accent` (5,04:1 contra el fondo); en el claro,
`--color-accent-hover` (3,76:1).

**Por qué.** Un indicador de estado necesita 3:1 contra el fondo, y
`--color-accent` en el tema claro da 2,92:1. Las dos variantes son tokens de
la marca: no hizo falta un color nuevo.

### Una fila de puntos en lugar del marquee de servicios

**Contexto.** Entre el hero y Proyectos había un marquee de servicios con
fondo invertido.

**Decisión.** Sale el marquee. En su lugar, una fila de puntos al pie del
hero: la grilla de puntos condensada en una línea, en CSS y decorativa. La
grilla se apaga al scrollear; la fila queda y marca el final del hero. Usa la
misma separación, el mismo radio, el mismo color y la misma opacidad que la
grilla, y sus columnas caen en las del canvas.

**Por qué.** Lo que decía el marquee ahora lo dicen Skills y Stack, con
evidencia. La fila cierra el hero con un elemento que ya es de la página, y
al ser CSS se ve igual con mouse, en táctil y sin JavaScript.

### Stack como carrusel con pausa

**Contexto.** El Stack era un carrusel infinito sin forma de detenerlo.

**Decisión.** Carrusel con botón de pausa (`aria-pressed`), pausa con hover
sobre la tira y lista estática con movimiento reducido o sin JavaScript.

**Por qué.** Un contenido que se mueve más de 5 segundos tiene que poder
pausarse.

### Stack en grilla quieta

Reemplaza a "Stack como carrusel con pausa".

**Contexto.** En celular, la pista del carrusel, de más de 6000 px y sin
recorte, agrandaba el layout viewport, y el botón del menú quedaba fuera de
la pantalla. El carrusel además requería un botón de pausa y lógica de estado
para mostrar una lista que no cambia.

**Decisión.** Una grilla quieta por grupo: 2 columnas en celular, 3 en tablet
y 4 en escritorio, con tarjetas sin hover porque no son clickeables.

**Por qué.** Se ven todas las herramientas a la vez, sin esperar ni pausar, y
no hay nada más ancho que la pantalla. Sin movimiento no hace falta botón de
pausa ni script.

### Íconos de las herramientas con simple-icons e iniciales

**Contexto.** La grilla del Stack lleva un ícono por herramienta. De las 26,
siete no están en simple-icons: las de Adobe (por licencia), FigJam,
Higgsfield, Runway y Midjourney.

**Decisión.** Un componente, `ToolIcon.astro`, con el ícono de simple-icons
donde existe y un cuadrado con iniciales del mismo tamaño donde no. Todos
monocromos en `currentColor` y ocultos para los lectores de pantalla. Una
herramienta sin ninguna de las dos opciones corta el build.

**Por qué.** Monocromo, cada ícono toma el color del texto y funciona en los
dos temas, y la grilla se lee como un sistema y no como una colección de
logos de colores. El nombre ya está escrito al lado, así que el ícono no
aporta nada para un lector de pantalla.

### `--ink-muted` a 4,5:1 y `--ink-subtle` para lo decorativo

**Contexto.** `--ink-muted` daba 3,31:1 contra el fondo oscuro y 2,82:1
contra el claro, y lo usaban labels de texto chico (la barra de metadata del
caso, el About, el footer, el selector de idioma, el crédito del widget).
También lo usaban tres elementos decorativos: las barras del índice de
Skills, el borde del disco del widget y el scrollbar.

**Decisión.** `--ink-muted` sube a 4,5:1 con el mismo tono, cambiando solo la
luminosidad: `#686561` en claro (antes `#8A8680`) y `#807B74` en oscuro
(antes `#6A6660`). Lo decorativo pasa a un token nuevo, `--ink-subtle`, con
los valores de antes.

**Por qué.** El texto chico necesita 4,5:1. Lo decorativo no transmite
información, y con el valor nuevo se habría visto más fuerte sin motivo:
con dos tokens, el texto se lee y la página se ve igual.

### El logo del navbar no recibe foco mientras no se ve

**Contexto.** En la home, el logo del navbar arranca con opacidad 0 y aparece
con el scroll. Invisible, igual recibía el foco de teclado y lo leían los
lectores de pantalla.

**Decisión.** Mientras su opacidad es 0 lleva `inert`.

**Por qué.** `inert` lo saca del orden de Tab, del árbol de accesibilidad y
de los clicks en un solo atributo. Con Tab desde arriba de la home, el foco
pasa del skip link a Proyectos; después de scrollear, el logo vuelve a ser
enfocable.

### Sitemap, robots.txt y llms.txt

**Contexto.** El sitio no tenía sitemap ni `robots.txt`, y los dos idiomas no
se declaraban como versiones de la misma página.

**Decisión.** `@astrojs/sitemap`, con alternativas `hreflang` entre `/en/` y
`/es/` y un filtro que deja solo las páginas de los dos idiomas. Un
`robots.txt` que permite el rastreo a todos los agentes, también a los de IA,
salvo la API. Un `/llms.txt` generado en el build desde los casos
publicados, con los canales de contacto que ya muestra el sitio: LinkedIn,
GitHub, el CV con la ruta del sitio y el mail. WhatsApp queda afuera porque es
un número de teléfono.

**Por qué.** El filtro por idioma evita que entren al sitemap rutas que
redirigen o no son páginas. Generar `llms.txt` desde los datos lo mantiene
sincronizado sin tocarlo a mano. Es una convención propuesta
([llmstxt.org](https://llmstxt.org)), no un estándar, y no cuesta nada
sumarla.

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

### Sitio estático con una sola ruta a pedido

**Contexto.** El endpoint de Last.fm tiene que ejecutarse en cada pedido; las
páginas no cambian entre deploys.

**Decisión.** El adapter de Vercel con `output: 'static'`, el default. Solo
`/api/now-playing.json` lleva `export const prerender = false` y corre como
función.

**Por qué.** Las páginas se siguen sirviendo como archivos desde la CDN, sin
ejecutar código. El adapter hace falta únicamente para la ruta que lo
necesita.

### Un estado explícito para cada respuesta del endpoint

**Contexto.** Last.fm falla de varias maneras (perfil privado, usuario
inexistente, clave suspendida, límite superado, caída, demora), y el widget
tiene que mostrar algo distinto según el caso.

**Decisión.** El endpoint responde siempre JSON con un campo `state`, también
en los errores, y el código HTTP de un intermediario: 502 si Last.fm rechazó
el pedido, 503 si está caído o limitando, 504 si no respondió a tiempo, 403
para el perfil privado y 500 solo si faltan las variables de entorno. El
pedido a Last.fm se corta a los 5 segundos.

**Por qué.** El widget lee el estado y no tiene que interpretar códigos HTTP.
Los códigos igual dicen la verdad para quien consulte el endpoint con `curl`
o lea los logs, y ningún error termina en un 500 sin explicación.

### Caché de 30 segundos solo para las respuestas correctas

**Contexto.** Los términos de Last.fm piden cachear según los headers HTTP de
su API, y su API no manda ninguno.

**Decisión.** `Cache-Control: public, s-maxage=30, stale-while-revalidate=60`
en la respuesta correcta; `no-store` en los errores.

**Por qué.** Con cualquier cantidad de visitas, Last.fm recibe como mucho un
pedido cada 30 segundos por región de la CDN, y lo que suena se sigue viendo
casi en vivo. Un error no se guarda, para que el pedido siguiente vuelva a
intentar.

### Variables de entorno opcionales y chequeadas en el endpoint

**Contexto.** Astro valida las variables secretas cuando se importan: si una
obligatoria falta, el módulo del endpoint falla al cargar y la respuesta es un
500 genérico.

**Decisión.** `LASTFM_API_KEY` (secreta) y `LASTFM_USERNAME` (pública de
servidor) se declaran opcionales en `env.schema`, y el endpoint chequea que
estén.

**Por qué.** Si faltan, el endpoint responde `not-configured` y el widget
muestra su mensaje de error, en vez de una falla sin explicación.

### Sin portadas y con crédito de texto

**Contexto.** Los términos de Last.fm excluyen las imágenes y el arte de los
discos de lo que se puede usar (cláusula 5.1.8), y piden acreditar con un
botón *"powered by AudioScrobbler"* (cláusula 2.7) que Last.fm ya no publica
entre sus recursos.

**Decisión.** El endpoint no devuelve portadas. El disco del widget es un
dibujo propio, con la G de la marca como etiqueta, no el arte de ningún
disco. El crédito es un link de texto, "vía Last.fm" (antes "Datos de
Last.fm"), que avisa a los lectores de pantalla que abre en otra pestaña, y
el título del tema de arriba y cada fila enlazan a su página en Last.fm.

El crédito va **al final del widget**, debajo de la lista, alineado a la
derecha, a 11 px y en `--ink-muted`. Antes estuvo arriba, en la fila del
cartel "En vivo", que ahora queda solo.

**Por qué.** Cumple lo que los términos permiten con lo que Last.fm ofrece
hoy. Además, una portada sería el único color fuerte del About y competiría
con los covers de los proyectos. El crédito tiene que estar (lo piden los
términos), pero apenas se tiene que ver: es una atribución, no contenido, y
al final y en tono tenue se lee como el pie de una ficha. Es una decisión
consciente contra el contraste: `--ink-muted` da 3:1, debajo del
4,5:1 que pide WCAG para texto, y se prioriza que sea discreto. El link
sigue siendo un link con su texto y su aviso para lectores de pantalla, así
que la información está disponible.

### El widget es secundario en el About

> Reemplaza a "El widget va en el About, alineado arriba", que lo ponía al
> lado del copy, alineado arriba, para que al crecer solo se estirara hacia
> abajo.

**Contexto.** Visto en staging, el widget competía con el texto del About:
lo empujaba, estiraba la sección y su label en terracota peleaba con el
eyebrow de la sección. El texto es lo principal; el widget es un detalle
personal, no el protagonista. Además, el motivo de alinearlo arriba ya no
existía: el tocadiscos tiene altura fija.

**Decisión.**

- **El claim, el copy y la firma vuelven a su posición original**, la que
  tenían antes del widget.
- **El widget va después de la firma** en el HTML (y en el orden de
  tabulación). En celular y tablet queda debajo del copy. En escritorio va en
  la columna izquierda, **alineado abajo con la firma**, en posición
  absoluta: no empuja el copy ni estira la sección.
- **Más compacto y con menos peso**: el disco baja de 112 a 64 px, el padding
  de 24 a 16 px y la tipografía un escalón (el título de `text-xl` a
  `text-base`, cortado en dos líneas; las filas de `text-sm` a `text-xs`).
  Las filas miden 44 px con el dedo y 28 px con mouse o trackpad
  (`pointer-fine`), por encima de los 24 px que pide WCAG 2.5.8.
- **El label "Lo que suena cuando diseño" va en `--ink-secondary`**, no en
  terracota (en ese momento, `--ink-muted` no llegaba al contraste mínimo
  para texto).

**Por qué.** La jerarquía tiene que decir qué importa: el texto del About es
lo principal, y el widget suma personalidad sin pedir
atención (Estética-Usabilidad: menos peso en lo secundario). Lo personal sigue
junto a la presentación (Proximidad), sin sumar una sección entre los
proyectos y el contacto (Hick). En posición absoluta, el widget tiene que
entrar en el alto del copy: se midió en Chrome headless a 1024, 1280, 1440 y
1920 px. La primera versión compacta medía 381 px contra 292 del copy y
quedaba a 7 px del claim; con el crédito en la fila del cartel y las filas de
28 px con puntero fino bajó a 328 px y dejaba 60 px. Con el crédito
después al pie, mide 347 px y deja 41 px, por encima de los 32 px que la
escala de espaciado pide como mínimo debajo de un título.

### La interacción principal está en el widget de música

> **Reemplazada** por "El widget queda pasivo; la interacción significativa
> pasa al cambio de tema". Queda como registro de lo que se intentó.

**Decisión.** Elegir un tema de la lista de los últimos cinco lo pone en el
tocadiscos: cambia el tema destacado. La primera versión alternaba entre
pestañas "Ahora / Últimos 5" (ver "De pestañas a tocadiscos"). El detalle
por tema, que también estaba previsto, quedó afuera (ver la decisión
siguiente).

**Por qué.** Junta en un componente la API, sus estados (carga, error, vacío)
y una interacción que cambia lo que se muestra. Los cinco temas salen del
mismo pedido al endpoint, así que la interacción no suma pedidos a Last.fm.

### El widget queda pasivo; la interacción significativa pasa al cambio de tema

**Contexto.** El widget pasó por dos interacciones. Las pestañas "Ahora /
Últimos 5" no transmitían música. El tocadiscos con selección sí, pero
elegir un tema de la lista no aportaba nada que la lista no mostrara ya:
ponía arriba, más grande, un título y un artista que estaban a la vista.

**Decisión.** El widget queda pasivo, como detalle personal con datos en
vivo y sus estados (carga, en vivo, último escuchado, vacío, privado, error).
Arriba va siempre el tema que suena o, si no suena nada, el último. El
título de arriba y cada fila de la lista son links a la página del tema en
Last.fm, con el mismo hover y el mismo aviso de pestaña nueva para lectores
de pantalla. Se sacan el listbox, el mini disco de la fila elegida y el
estado de "tema elegido"; la fila del tema que suena conserva su
ecualizador. La interacción significativa del sitio pasa al cambio de tema
claro / oscuro, que se rediseña junto con la revisión de la identidad
visual.

**Por qué.** Una interacción que no cambia nada que importe es decoración con
costo: un patrón de teclado más, un estado más y un listbox que el lector de
pantalla anuncia como control. Como links, las filas hacen lo único útil que
podían hacer: llevar al tema. El cambio de tema sí modifica la experiencia
entera (la paleta de todo el sitio), así que es el lugar natural para la
interacción que el sitio quiere mostrar. La lista sigue incluyendo al tema
de arriba: sin él, cuando no suena nada quedarían cuatro filas y "Últimos 5"
mentiría.

### Sin detalle por tema

**Contexto.** El plan incluía elegir un tema de la lista para ver su detalle
con `track.getInfo` de Last.fm: cuántas veces lo escuché, sus etiquetas y su
duración.

**Decisión.** No se hace. Reemplaza la parte de "elegir un tema para ver su
detalle" de la decisión anterior.

**Por qué.**

- **Sería un proxy abierto a Last.fm con mi clave.** El endpoint del detalle
  tendría que recibir el artista y el tema desde el navegador, y cualquiera
  podría pedirle combinaciones inventadas. Cada una es un pedido nuevo que la
  caché no cubre.
- **El límite de Last.fm es por IP**, y la IP es la de la función de Vercel.
  Un abuso del detalle agotaría el límite también para el widget principal,
  que dejaría de cargar para todos. Evitarlo exige comparar cada pedido contra
  los temas recientes, que es otra llamada o una caché compartida.
- **Lo que más interesa no está documentado.** La documentación de
  `track.getInfo` dice que con el usuario devuelve sus escuchas y si marcó el
  tema como favorito, pero no nombra esos campos ni los muestra en el ejemplo.
  Además sumaría cuatro o cinco estados (cargando, no encontrado, datos a
  medias, error) para un dato que no cambia lo que cuenta el widget.

### Pestañas con el patrón Tabs, no botones con `aria-pressed`

> **Reemplazada** por "De pestañas a tocadiscos": el widget ya no tiene
> pestañas. Queda como registro de la primera versión.

**Contexto.** El selector cambia entre dos vistas que se excluyen. WAI-ARIA
tiene dos patrones posibles: un botón conmutador (`aria-pressed`) o pestañas.

**Decisión.** Pestañas (`tablist`, `tab`, `tabpanel`), con activación
automática y el teclado del patrón: flechas, Inicio y Fin.

**Por qué.** Un botón conmutador es *un* botón con dos estados. Dos botones
con `aria-pressed` se anuncian como interruptores independientes: no dicen que
se excluyen ni qué contenido cambian. Las pestañas dicen "pestaña,
seleccionada, 1 de 2" y conectan cada una con su panel (`aria-controls`). La
guía de WAI-ARIA recomienda la activación automática cuando los paneles se
muestran sin espera, que es el caso: los dos salen del mismo pedido.

### De pestañas a tocadiscos

**Contexto.** La primera versión de la interacción eran pestañas "Ahora /
Últimos 5". Funcionaba, pero vista construida no transmitía música, y estaba
pensada alrededor del caso "sonando ahora", que es la excepción: la mayoría
de las visitas caen cuando no estoy escuchando nada. En ese caso la pestaña
"Ahora" mostraba un tema del pasado con "Lo último que sonó · hace X".

**Decisión.** Un tocadiscos. Arriba, el tema destacado: un vinilo dibujado
en SVG con la G como etiqueta, el título y el artista, y un cartel "En vivo"
(ver "El disco gira siempre; el estado en vivo lo dice el cartel"). Por
defecto es el tema más reciente. Abajo, los últimos cinco temas como el
listado de un disco, y elegir uno lo ponía en el tocadiscos (después se sacó:
ver "El widget queda pasivo"). Sin tiempo relativo en ninguna parte, sin
flechas ni íconos de link: lo que dice "link" es el hover y el cursor.

**Por qué.** Parte del caso común en vez de la excepción: sin nada sonando,
el widget igual tiene algo que mostrar. La metáfora del disco hace que la
lista se entienda sin explicarla (Jakob: un listado de temas se reconoce).
Sacar el tiempo relativo saca también el único dato que hacía falta
actualizar con el reloj.

### La selección con el patrón Listbox

> **Reemplazada** por "El widget queda pasivo": la lista ya no se elige, cada
> fila es un link. Queda como registro del patrón que se usó.

**Contexto.** Elegir un tema es elegir uno de una lista. WAI-ARIA ofrece
varios patrones posibles: listbox, radio group, botones con `aria-pressed` o
botones con `aria-current`.

**Decisión.** Listbox de selección única (`listbox`, `option`,
`aria-selected`), con nombre desde el label visible "Últimos 5". La
selección sigue al foco: las flechas mueven y eligen a la vez. Tab entra a la
fila elegida, Inicio y Fin van a la primera y a la última. La lista incluye al
tema destacado, marcado, y su orden no cambia nunca. Sin región `aria-live`.

**Por qué.** Es el patrón para elegir un ítem de una lista. Radio group se
comporta casi igual, pero se anuncia como "botón de opción", el lenguaje de un
formulario. Dos botones con `aria-pressed` se anuncian como interruptores
independientes, y `aria-current` en botones no es un patrón de la guía.
El listbox exige que las filas no tengan elementos interactivos adentro: el
único link es el título del destacado. La guía recomienda que la selección
siga al foco cuando el cambio es instantáneo, y acá lo es (no hay pedido). La
fila elegida se anuncia "título, artista, seleccionado, 2 de 5", que es el
mismo contenido del destacado: una región viva lo repetiría en cada flecha.
Si la fila elegida desapareciera de la lista, las demás se correrían bajo el
cursor; por eso se queda, marcada con un mini disco (y no solo con color).

### El disco gira siempre; el estado en vivo lo dice el cartel

> Reemplaza a "El disco gira solo si suena", la primera versión del
> tocadiscos: el giro continuo solo con `isNowPlaying`, y al poner un tema que
> no suena, media vuelta y quieto.

**Contexto.** El widget no puede decir algo que no es cierto. En la primera
versión del tocadiscos el giro hacía las dos cosas: era el ambiente del
widget y la señal de "está sonando". Como casi nunca suena nada cuando
alguien entra, el disco pasaba la mayor parte del tiempo quieto, y un disco
quieto no dice "música". Además, la pausa nunca funcionó: una trampa de
Tailwind v4 dejaba la animación siempre corriendo (ver la bitácora).

**Decisión.** Se separan las dos funciones.

- **El disco gira siempre**, una vuelta cada 4 s (al principio eran 8), con
  `motion-safe`: con movimiento reducido, quieto. La velocidad vive en un solo lugar, el
  token `--animate-spin-record` de `global.css`.
- **Si estoy escuchando lo dice un cartel "En vivo"**, arriba a la derecha de
  la card y siempre visible, como el "On Air" de un estudio: un rectángulo
  chico con el texto adentro, sin animación. Apagado: borde y texto tenues.
  Prendido (algún tema tiene `isNowPlaying`): relleno terracota sólido con el
  texto en la tinta oscura de la marca (`#111110`, fija en los dos temas),
  que da 5:1. El lector de pantalla oye "Sonando ahora" solo cuando está
  prendido; apagado no se anuncia nada.
- **La fila del tema que suena conserva su ecualizador.**

**Por qué.** El giro pasa a ser ambiente: dice "esto es música" en cualquier
momento, que es lo que el widget tiene que transmitir. El estado real, que es
binario, queda en una pieza que existe solo para eso, prendida o apagada, y
un cartel apagado no afirma nada. El estado no depende solo del color (WCAG
1.4.1): el cartel pasa de un contorno a un bloque lleno. Apagado no se
anuncia porque "En vivo" leído sería falso, y "No está sonando" tampoco sería
cierto mientras carga o ante un error, cuando no se sabe. El cartel dice
*que* algo suena y el ecualizador de la fila dice *cuál*.

**Cartel sin efectos, y sin escala al elegir** (revisión en staging). La
primera versión del cartel tenía un punto que pulsaba con brillo, y elegir un
tema hacía que el disco se asentara con una escala. Con el disco girando
siempre, eran demasiados movimientos para un detalle secundario: un cartel
real de estudio es un bloque que se prende, sin efectos. Además, el texto en
terracota sobre la card no llegaba al contraste a 11 px; el texto oscuro
sobre el relleno terracota sí.

### El alto del widget se anima

**Contexto.** Los estados vacío y error tenían una altura mínima pensada para
un tema: una tarjeta grande y casi vacía. Además, el widget cambia de alto
entre estados, y en la primera versión crecía al pasar a la pestaña de la
lista.

**Decisión.** La tarjeta mide el alto de su contenido con un
`ResizeObserver` y lo anima con una transición CSS de 0,6 s con la curva de
la marca. La altura mínima se fue: el esqueleto de carga ya tiene las medidas
del contenido, y vacío, privado y error muestran el disco con el
mensaje al lado. En el tocadiscos, el bloque de arriba mide siempre lo que
el disco: el título se corta en dos líneas, con `text-wrap: balance` para
que no quede una palabra sola en la segunda ("Another One / Bites the Dust",
no "Another One Bites the / Dust"). Con movimiento reducido, la regla global
deja la transición en 0 y el cambio es instantáneo.

**Por qué.** Lo que viene después se desliza en vez de saltar (en
escritorio el widget está en posición absoluta y no mueve nada; en celular y
tablet, sí). Se descartó reservar siempre el alto
máximo, porque deja la tarjeta grande y vacía en los estados sin datos. CSS
no anima desde ni hacia `auto`, por eso el alto se mide y se pasa en píxeles.
No se usó Framer Motion: la isla no lo usaba, y la transición CSS ya respeta
la regla de movimiento reducido del sitio.

---

## Repositorio

### El CV no se versiona

**Contexto.** El sitio publicado sirve el CV en `/tiago-collado-cv.pdf`, y esa
URL ya circula. Este repositorio es público.

**Decisión.** El PDF no entra al repositorio. La URL redirige con un 307 a una
copia alojada afuera.

**Por qué.** El CV es un documento aparte del sitio. Con la redirección, la
URL que ya circula sigue funcionando.

### Redirección del CV en la configuración de Astro

*Reemplaza a "Redirección del CV en `vercel.json`".*

**Contexto.** La redirección tiene que ser 307. Sin adapter, la opción
`redirects` de Astro genera una página con meta refresh, sin código de
estado, así que la redirección vivía en `vercel.json`. Con el adapter de
Vercel, la configuración de rutas del deploy sale del build ya armada
(`.vercel/output/config.json`), y el adapter la arma solo a partir de
`astro.config.mjs`: no copia los `redirects` de `vercel.json`. La
documentación de Vercel no aclara si los aplica igual.

**Decisión.** La redirección pasa a los `redirects` de `astro.config.mjs` con
`status: 307`, y `vercel.json` se elimina: su otra regla, la barra final, ya
sale del `trailingSlash` de Astro.

**Por qué.** Con el adapter, los `redirects` de Astro sí dan un código de
estado real, y la regla queda en el `config.json` generado, donde se puede
revisar antes del deploy. Toda la configuración de rutas queda en un solo
archivo.

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
