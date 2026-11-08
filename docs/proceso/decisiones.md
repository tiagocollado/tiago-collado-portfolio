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
el título del tema destacado enlaza a su página en Last.fm.

**Por qué.** Cumple lo que los términos permiten con lo que Last.fm ofrece
hoy. Además, una portada sería el único color fuerte del About y competiría
con los covers de los proyectos.

### El widget va en el About, alineado arriba

**Contexto.** El widget cuenta algo de quién soy, y su alto cambia entre
estados (carga, datos, error).

**Decisión.** En el About, en la columna izquierda que queda libre bajo el
claim, alineado arriba con el texto. En mobile va después de la firma.

**Por qué.** Lo personal queda junto a la presentación (Proximidad), sin sumar
una sección entre los proyectos y el contacto (Hick). Alineado arriba, cuando
crezca solo se estira hacia abajo y el texto de al lado no se mueve.

### La interacción principal está en el widget de música

**Decisión.** Elegir un tema de la lista de los últimos cinco lo pone en el
tocadiscos: cambia el tema destacado. La primera versión alternaba entre
pestañas "Ahora / Últimos 5" (ver "De pestañas a tocadiscos"). El detalle
por tema, que también estaba previsto, quedó afuera (ver la decisión
siguiente).

**Por qué.** Junta en un componente la API, sus estados (carga, error, vacío)
y una interacción que cambia lo que se muestra. Los cinco temas salen del
mismo pedido al endpoint, así que la interacción no suma pedidos a Last.fm.

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
(ver "El disco gira siempre; el estado en vivo lo dice el cartel"). Por defecto es el tema
más reciente. Abajo, los últimos cinco temas como el listado de un disco, y
elegir uno lo pone en el tocadiscos. Sin tiempo relativo en ninguna parte,
sin flechas ni íconos de link: las filas se ven elegibles por su hover y por
el cursor.

**Por qué.** Parte del caso común en vez de la excepción: sin nada sonando,
el widget igual tiene algo que mostrar y algo para hacer. La metáfora del
disco hace que la lista se entienda sin explicarla (Jakob: un listado de
temas se reconoce), y la elección cambia lo que se ve arriba, que es una
interacción con efecto visible y no un cambio de vista. Sacar el tiempo
relativo saca también el único dato que hacía falta actualizar con el reloj.

### La selección con el patrón Listbox

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

- **El disco gira siempre**, una vuelta cada 8 s, con `motion-safe`: con
  movimiento reducido, quieto. La velocidad vive en un solo lugar, el token
  `--animate-spin-record` de `global.css`.
- **Si estoy escuchando lo dice un cartel "En vivo"**, arriba a la derecha de
  la card y siempre visible, como el "On Air" de un estudio. Apagado: punto
  hueco y texto gris tenue. Prendido (algún tema tiene `isNowPlaying`): texto
  en `--ink-primary` y punto lleno en terracota, con brillo y una pulsación
  lenta con `motion-safe`. El texto no va en terracota: a 11 px da 3,1:1 en
  tema claro, debajo del 4,5:1 que pide WCAG; la luz la da el punto. El
  lector de pantalla oye "Sonando ahora" solo cuando está prendido; apagado
  no se anuncia nada.
- **Al poner un tema, el disco se asienta**: arranca al 96% y vuelve a su
  tamaño en 0,4 s, con la curva de la marca. Reemplaza a la media vuelta.
- **La fila del tema que suena conserva su ecualizador.**

**Por qué.** El giro pasa a ser ambiente: dice "esto es música" en cualquier
momento, que es lo que el widget tiene que transmitir. El estado real, que es
binario, queda en una pieza que existe solo para eso, prendida o apagada, y
un cartel apagado no afirma nada. El estado no depende solo del color (WCAG
1.4.1): cambian también la forma del punto, el brillo y la intensidad.
Apagado no se anuncia porque "En vivo" leído sería falso, y "No está
sonando" tampoco sería cierto mientras carga o ante un error, cuando no se
sabe. Con el disco siempre girando, media vuelta más se lee como una
aceleración, no como "poner el disco". Una escala chica es otro movimiento
(escala, no rotación) y se lee como el disco que se apoya en el plato. El
cartel dice *que* algo suena y el ecualizador de la fila dice *cuál*, algo
que el cartel no puede decir cuando está elegido otro tema.

### El alto del widget se anima

**Contexto.** Los estados vacío y error tenían una altura mínima pensada para
un tema: una tarjeta grande y casi vacía. Además, el widget cambia de alto
entre estados, y en la primera versión crecía al pasar a la pestaña de la
lista.

**Decisión.** La tarjeta mide el alto de su contenido con un
`ResizeObserver` y lo anima con una transición CSS de 0,6 s con la curva de
la marca. La altura mínima se fue: el esqueleto de carga ya tiene las medidas
del contenido, y vacío, privado y error muestran el disco con el
mensaje al lado. En el tocadiscos, el bloque destacado mide siempre lo que el
disco (el título se corta en tres líneas), así que elegir un tema no cambia
el alto. Con movimiento reducido, la regla global deja la transición en 0 y
el cambio es instantáneo.

**Por qué.** El widget crece hacia abajo (va alineado arriba) y lo que viene
después se desliza en vez de saltar. Se descartó reservar siempre el alto
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
