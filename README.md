# Gotya — portfolio de Tiago Collado

## Sobre el proyecto

Pendiente.

## Cómo correrlo

Requisitos: Node.js 22.23.4 o superior (lo fija `engines` en `package.json`) y npm.

```sh
# instalar dependencias
npm install

# servidor de desarrollo en http://localhost:4321
npm run dev

# build de producción
npm run build
```

El widget de música necesita dos variables de entorno: copiar `.env.example`
como `.env` y completar `LASTFM_API_KEY` (se pide en
[last.fm/api/account/create](https://www.last.fm/api/account/create)) y
`LASTFM_USERNAME`. Sin ellas el sitio funciona igual y el widget muestra que
la música no está disponible.

## Stack y decisiones

Pendiente. El detalle de cada decisión está en
[docs/proceso/decisiones.md](docs/proceso/decisiones.md).

## Componentes

### NowPlaying: lo que suena cuando diseño

[`NowPlaying.jsx`](src/components/sections/NowPlaying.jsx) es una isla de
React que se hidrata al entrar en pantalla (`client:visible`), en el About.
Muestra lo que escucho, con datos de Last.fm (ver
[Datos en vivo](#datos-en-vivo)), como un tocadiscos:

- **Arriba, el tema destacado**: un vinilo dibujado en SVG con la G de la
  marca como etiqueta, y al lado el título (link a su página en Last.fm) y el
  artista. Por defecto es el tema más reciente.
- **Abajo, los últimos cinco temas**, como el listado de un disco. Elegir uno
  lo pone en el tocadiscos.

El disco gira siempre: es ambiente. Si de verdad estoy escuchando algo lo
dice un cartel **"En vivo"**, arriba a la derecha y siempre visible, como el
"On Air" de un estudio: apagado si no suena nada, prendido (con el punto en
terracota, brillando) si suena. Al poner un tema, el disco se asienta en el plato con una escala
corta: es la respuesta a la acción.

Se ocupa de tres cosas: pedir los datos al endpoint propio (y volver a
pedirlos al volver a la pestaña), traducir el `state` de la respuesta a lo
que muestra (carga, datos, vacío, privado o error) y manejar qué tema está en
el tocadiscos. Recibe del `.astro` solo los textos que usa, ya traducidos.

Pendiente: el resto de los componentes propios.

## Datos en vivo

En la sección About, el widget **"Lo que suena cuando diseño"** muestra lo
último que escuché como un tocadiscos: el tema más reciente en el plato y,
abajo, los últimos cinco para elegir cuál poner. Los datos son de
[Last.fm](https://www.last.fm), que registra lo que escucho.

```
navegador ──► /api/now-playing.json ──► Last.fm (user.getRecentTracks)
              endpoint propio, con la clave
```

- **El navegador nunca habla con Last.fm.** Llama a
  [`/api/now-playing.json`](src/pages/api/now-playing.json.js), la única ruta
  del sitio que se ejecuta a pedido (una función de Vercel); todo lo demás es
  estático. El endpoint agrega la clave, que es una variable secreta de
  servidor (`astro:env`) y no aparece en el código generado ni en el
  JavaScript del navegador.
- **Qué devuelve.** El tema que suena ahora (si hay uno) y los últimos cinco,
  cada uno con título, artista, álbum, link a su página en Last.fm, si está
  sonando y cuándo sonó. Nada más: la respuesta es chica y no trae portadas
  (ver [Créditos y licencias](#créditos-y-licencias)).
- **Límites.** La respuesta correcta se guarda 30 segundos en la CDN de
  Vercel (`Cache-Control: public, s-maxage=30, stale-while-revalidate=60`):
  con cualquier cantidad de visitas, Last.fm recibe como mucho un pedido cada
  30 segundos por región. Last.fm no manda headers de caché propios. El pedido
  a Last.fm se corta a los 5 segundos.
- **El widget** ([`NowPlaying.jsx`](src/components/sections/NowPlaying.jsx))
  pide los datos al hacerse visible y otra vez al volver a la pestaña, si pasó
  más de un minuto. Del endpoint toma los cinco temas más recientes, contando
  el que suena. Elegir un tema no hace otro pedido: los datos ya están.
- **Nunca dice algo que no es cierto.** El cartel "En vivo" se prende solo si
  algún tema tiene `isNowPlaying`, y la fila de ese tema muestra un
  ecualizador. Para el lector de pantalla, el cartel prendido dice "Sonando
  ahora"; apagado no anuncia nada. No muestra tiempo
  relativo ("hace X"). Está pensado para el caso común: que cuando alguien
  entra, yo no esté escuchando nada.
- **La lista** sigue el patrón Listbox de WAI-ARIA, de selección única: toma su
  nombre del label visible "Últimos 5", la fila elegida se anuncia como
  seleccionada, y se usa con teclado (Tab entra a la fila elegida, las flechas
  arriba y abajo mueven y eligen a la vez, Inicio y Fin van a la primera y a
  la última). Incluye al tema destacado, marcado, y su orden no cambia nunca.
- **El alto no salta.** El destacado mide siempre lo que el disco (el título
  se corta en tres líneas), así que elegir un tema no cambia el alto. Entre
  estados (carga, datos, error) la tarjeta anima su alto.
- **Movimiento reducido**: el disco no gira y los cambios son instantáneos.

### Si la API falla o no hay datos

El endpoint siempre responde JSON con un campo `state`, también cuando falla,
así que el widget decide qué mostrar sin interpretar códigos HTTP. Ningún
error queda como un 500 sin explicación.

| Situación | `state` | HTTP | Qué muestra el widget |
|---|---|---|---|
| Hay un tema sonando | `ok` | 200 | Ese tema en el tocadiscos, el cartel "En vivo" prendido y la lista, con un ecualizador en su fila |
| No suena nada | `ok` | 200 | El tema más reciente, el cartel apagado y la lista |
| La cuenta no tiene temas | `empty` | 200 | "Todavía no registré ningún tema." |
| El perfil oculta lo que escucha (error 17 de Last.fm) | `private` | 403 | "Mi historial de Last.fm está en privado." |
| Usuario inexistente, clave inválida o suspendida (errores 6, 10, 26) | `user-not-found` · `invalid-key` · `key-suspended` | 502 | "No pude cargar la música ahora." |
| Last.fm caído o limitando pedidos (errores 8, 11, 16, 29) | `unavailable` · `rate-limited` | 503 | ídem |
| Last.fm no responde en 5 segundos | `timeout` | 504 | ídem |
| Respuesta inesperada o falla de red | `unavailable` | 502 | ídem |
| Faltan las variables de entorno | `not-configured` | 500 | ídem |

- **Los errores no se cachean** (`Cache-Control: no-store`): el próximo pedido
  vuelve a intentar.
- **Mientras carga**, el widget muestra un esqueleto con las medidas del
  contenido más común (el destacado y cinco filas), así el paso a los datos
  no cambia el alto.
- **Vacío, privado y error** muestran el disco con el mensaje al lado y el
  cartel apagado, sin lista: la tarjeta queda del alto del disco.
- **Con un solo tema** no hay lista: no hay entre qué elegir.
- **Sin JavaScript** el widget no puede pedir los datos, así que no se
  muestra.

## Responsive y accesibilidad

Pendiente.

## Próximos pasos

Pendiente.

## Créditos y licencias

- **Datos de música**: [Last.fm](https://www.last.fm), vía su
  [API](https://www.last.fm/api), bajo sus
  [términos de uso](https://www.last.fm/api/tos), que permiten solo uso no
  comercial y piden acreditar a Last.fm con un link. El widget lleva un link
  de texto "vía Last.fm": el botón *"powered by AudioScrobbler"* que
  nombran los términos ya no se publica entre los recursos de Last.fm. El
  título del tema destacado enlaza a su página en Last.fm, como piden los
  términos. No se muestran
  portadas de discos, porque los términos excluyen las imágenes y el arte de
  lo que se puede usar.
- Skills de IA de Anthropic, usadas en local y no incluidas en este
  repositorio: [`frontend-design`](https://github.com/anthropics/skills/tree/main/skills/frontend-design)
  y [`design-critique`](https://github.com/anthropics/knowledge-work-plugins/tree/main/design/skills/design-critique).
  Cada una se rige por la licencia de su repositorio de origen.

## Proceso

Cómo se construyó el proyecto, en [docs/proceso/](docs/proceso/):

- [Bitácora](docs/proceso/bitacora.md): por etapa, desde el antecedente en
  Next, qué se hizo y qué costó; cómo se verifica y qué queda abierto.
- [Decisiones](docs/proceso/decisiones.md): cada decisión de diseño,
  arquitectura y tecnología, con su contexto y su porqué.
- [Cómo uso IA](docs/proceso/uso-de-ia.md): por tipo de tarea, qué hizo la
  IA, qué revisé o descarté, qué errores aparecieron y qué decidí yo.

## Cómo uso IA

Uso Claude Code (modelo Claude Opus 5.5) como asistente de desarrollo, en
cuatro tipos de tarea: migrar componentes del sitio anterior, verificar cada
API contra la documentación y el código de las librerías, configurar
herramientas y redactar documentación. La IA propone un enfoque y lo ejecuta
cuando lo apruebo; yo reviso, tomo las decisiones de diseño, alcance y
arquitectura, y hago los commits. No puede abrir un navegador: lo visual y lo
interactivo lo pruebo yo. Tampoco abre el archivo `.env`: la clave de la API
la cargo yo.

- **Reglas.** Lee en cada sesión [CLAUDE.md](CLAUDE.md) y
  [.claude/rules/](.claude/rules/): tokens de diseño, producción de imágenes y
  errores conocidos del stack.
- **Skills.** [`auditar-copy`](.claude/skills/auditar-copy/SKILL.md), propia,
  contrasta el copy contra la evidencia y busca patrones de texto generado por
  IA. Además uso `frontend-design` y `design-critique`, de Anthropic, que no se
  incluyen en el repositorio (ver [Créditos y licencias](#créditos-y-licencias)).

El detalle, con ejemplos, está en
[docs/proceso/uso-de-ia.md](docs/proceso/uso-de-ia.md).
