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
[Datos en vivo](#datos-en-vivo)), en dos vistas que elige quien visita:

- **Ahora**: el tema que suena, con un ecualizador animado, o el último que
  sonó y hace cuánto.
- **Últimos 5**: los últimos cinco temas, cada uno con su link a Last.fm.

Se ocupa de tres cosas: pedir los datos al endpoint propio (y volver a
pedirlos al volver a la pestaña), traducir el `state` de la respuesta a lo
que muestra (carga, datos, vacío, privado o error) y manejar la selección
entre las dos vistas. Recibe del `.astro` solo los textos que usa, ya
traducidos, y el idioma de la página para el tiempo relativo.

Pendiente: el resto de los componentes propios.

## Datos en vivo

En la sección About, el widget **"Lo que suena cuando diseño"** muestra el
tema que estoy escuchando o, si no suena nada, el último que sonó y hace
cuánto. Con las pestañas **Ahora / Últimos 5** se pasa a la lista de los
últimos cinco temas. Los datos son de [Last.fm](https://www.last.fm), que
registra lo que escucho.

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
  más de un minuto. Las dos vistas salen del mismo pedido, así que cambiar de
  pestaña no espera ni vuelve a pedir nada. El tiempo relativo ("hace 12
  minutos" / "12 minutes ago") sale de `Intl.RelativeTimeFormat`, en el idioma
  de la página.
- **Las pestañas** siguen el patrón Tabs de WAI-ARIA: la lista de pestañas
  toma su nombre del título visible del widget, cada pestaña indica si está
  seleccionada y a qué panel controla, y se usan con teclado (Tab entra a la
  pestaña activa, las flechas cambian de pestaña, Inicio y Fin van a la
  primera y a la última, Tab otra vez pasa al panel). Se activan al recibir el
  foco porque los dos paneles ya están cargados.
- **El widget crece sin saltos.** La lista es más alta que la vista Ahora. La
  tarjeta mide el alto de su contenido y lo anima, así lo que viene abajo se
  desliza en vez de saltar. Con movimiento reducido el cambio es instantáneo.

### Si la API falla o no hay datos

El endpoint siempre responde JSON con un campo `state`, también cuando falla,
así que el widget decide qué mostrar sin interpretar códigos HTTP. Ningún
error queda como un 500 sin explicación.

| Situación | `state` | HTTP | Qué muestra el widget |
|---|---|---|---|
| Hay un tema sonando | `ok` | 200 | El tema, con un ecualizador animado, y la pestaña Últimos 5 |
| No suena nada | `ok` | 200 | El último tema y hace cuánto sonó, y la pestaña Últimos 5 |
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
  contenido más común (las pestañas y un tema), así el paso a los datos no
  cambia el alto.
- **Vacío, privado y error** se muestran en una tarjeta compacta, del alto del
  mensaje, sin pestañas: no hay nada entre qué elegir.
- **Si la lista no suma nada** (suena un tema y no hay otros, o la cuenta
  tiene un solo tema), las pestañas no aparecen y queda la vista Ahora.
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
  de texto "Datos de Last.fm": el botón *"powered by AudioScrobbler"* que
  nombran los términos ya no se publica entre los recursos de Last.fm. Cada
  tema enlaza a su página en Last.fm, como piden los términos. No se muestran
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
