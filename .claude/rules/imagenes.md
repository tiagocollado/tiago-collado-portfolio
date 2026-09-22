# Imágenes — Portfolio Gotya

Reglas de arte, medidas y vocabulario de todas las imágenes del sitio.
Antes de diseñar, exportar o cablear una imagen, releer esto.

Estaban partidas entre `CLAUDE.md` §2 y un `BRIEF-IMAGENES.md` que se dio de
baja. Con el vocabulario de tipos ya son un sistema —tipos, anchos, y dos
reglas que se comportan distinto en covers que en case studies— así que viven
juntas acá. `CLAUDE.md` §2 apunta a este archivo y no duplica nada.

---

## 1. Las dos reglas que más caro salen

Las dos se rompieron ya, las dos pasaron desapercibidas en revisiones donde se
medían proporciones con tres decimales, y ninguna la detecta un build.

### 1.1. El texto de una pantalla tiene que ser una captura REAL

Un generador de imágenes redibuja el texto chico y produce palabras que no
existen. Pasó: `SERVICIOS` salió `REMITIOOS`, `UBICACIÓN` salió `IWESCIÓN`, y
un párrafo decía *"a paseo del cueʟeo Intóniico y la zona de bosar"*.

**En un portfolio de UX/UI eso es letal**: una interfaz con el copy inventado
contradice el argumento del portfolio. Es el motivo por el que se dieron de
baja 31 imágenes de una sola vez.

El proceso correcto:

1. Capturar el sitio real — DevTools → `Ctrl+Shift+P` → *Capture full size screenshot*.
2. Meter esa captura en la pantalla. **En este orden de preferencia:**
   1. **Un mockup ya renderizado con la captura adentro** (los generadores de
      mockups la aceptan como input y devuelven el dispositivo con
      transparencia). Es el camino bueno.
   2. **Una captura plana**, con esquinas redondeadas y sombra, sin marco de
      dispositivo. Tampoco deforma nada.
   3. **Componer con transformación de perspectiva**, solo si no hay
      alternativa.
3. El marco del dispositivo, el fondo y la luz **sí** pueden ser generados.
   El contenido de la pantalla, **no**.
4. **Una captura no se retoca.** Si algo en la pantalla no conviene, se vuelve
   a capturar; no se editan píxeles. Caso real: en el hero de Ritual el carrito
   dice **3** en el celular y **0** en el desktop, porque son dos sesiones
   distintas. Se deja así: pintar un número encima convierte la captura en una
   pantalla inventada, que es justo lo que esta regla prohíbe.

> ⚠️ **La perspectiva es la que trae los problemas.** Deformar una captura para
> encajarla en una pantalla en ángulo dejó, en la primera corrección de Paseo,
> tres defectos que a 1280px no se distinguen de un reflejo: una **línea
> punteada negra** horneada en el borde de la captura, la captura **sin
> enmascarar** montada sobre el marco en la esquina redondeada, y la última
> línea de texto **cortada por la mitad** por el borde de la capa. A 1920px y a
> sangre, esa línea cortada se lee como garabatos: la misma impresión que el
> texto inventado.
>
> ✅ **Se resolvió cambiando el método, no parchando el composite.** La segunda
> versión usa un mockup del celular que ya venía con la captura adentro, y una
> captura plana para el desktop: **sin warp no hay fleco, ni esquina montada, ni
> empaste de remuestreo**. La clase entera de defectos desaparece.
>
> **Si igual hay que componer en perspectiva**: al 100%, recorrer los cuatro
> bordes de cada pantalla antes de dar la imagen por buena.

> ✅ **El control**: abrir el export al 100%, **ampliar el párrafo más largo de
> la pantalla y leerlo en voz alta**, palabra por palabra. Si alguna palabra no
> existe, la imagen no sirve. Esto va PRIMERO, antes de medir proporciones o
> rango tonal: un número verde no dice nada del contenido. La historia de cómo
> se aprendió está en `CLAUDE.md` §9.33 y en el incidente de abajo.

#### ⚠️ Incidente — la regla se violó en producción (covers, septiembre 2026)

**Qué se publicó.** El cover de Pulso salió con el párrafo del hero inventado:
*"Acompañamos a empresas **doude** una mirada estratégica, **corcaca e
Ireograi**… para **kligoizar** marcas, personas y **negocies**"*. El sitio real
dice *"desde una mirada estratégica, cercana e integral… para impulsar marcas,
personas y negocios"*. Es galimatías, y se lee con zoom.

**La causa.** Los mockups se generaron con IA **con la pantalla incluida**: la
imagen entera —hormigón, luz, laptop *y el sitio en pantalla*— salió del
generador. El paso 2 del proceso de arriba (componer la captura real en Figma)
no existió.

**Por qué los títulos y los logos NO sirven como test.** La IA copia bien lo
grande. En ese mismo cover, el titular *"Potenciamos marcas, líderes y
equipos"*, el logo y los ítems del nav salieron perfectos, así que un vistazo
dice que está todo bien. El error aparece en el texto chico, que el generador
**redibuja** en vez de copiar. Un mockup que pasa el test del título no pasó
ningún test.

**Cómo se detecta.** Ampliar **el párrafo más largo** del mockup y leerlo. No
el título, no el logo, no el nav: el párrafo.

**Por qué se escapó si ya se sabía.** El texto generado de los covers estaba
detectado y se había declarado *no bloqueante*, porque al ancho de la card
(628px) las palabras rotas miden 3-4px (`CLAUDE.md` §9.35). Ese criterio falla
por dos lados:

1. **Se lee con zoom.** Pellizcar en el celular amplía la variante 2× que sirve
   `next/image`. Y quien evalúa un portfolio de UX/UI hace zoom.
2. **El mismo mockup ahora va a sangre.** El hero del case study es la misma
   composición que el cover (§3): a 1920px de ancho el párrafo se lee sin zoom.

> ⚠️ Para texto generado, *"al tamaño de render no se ve"* **no es un
> argumento**. La revisión al tamaño de render (§6) sirve para decidir si algo
> molesta; no sirve para decidir si un texto inventado puede quedarse.

**Cómo se corrigió.** Se incrustó la captura real en la pantalla del mismo
mockup, conservando la iluminación. El hormigón, el marco y la luz siguen
siendo generados, que es justo lo que la regla permite.

**Estado de los covers:**

| Cover | Estado |
|---|---|
| Pulso Creativo | ✅ **Publicado y limpio.** Se corrigió primero incrustando la captura (`a203a6a`) y después se rehízo con el método sin perspectiva, junto con su `00-mockup` (`7f69757`): `2400 × 2400`, párrafo y nav leídos al 100%, rango tonal 209 |
| Paseo Güemes Hotel | ✅ **Corregido y limpio.** Las dos pantallas estaban generadas (el celular decía *"En el **cezacón** de Salta la Linda, a **poses** del centro histórico y la **zana** de bares"*). Rehecho con el método sin perspectiva: `2400 × 1800` (4:3, la forma de su card), texto real, sin costuras. **Publicable** |
| El Ritual del Tono | ❌ **Texto inventado, confirmado** (*"los **guionnates** más icónicos"*). **Se queda por decisión de Tiago** (2026-09-21), así que el hero se hizo aparte (§3) y la tanda **sigue abierta** |
| FutbolTalent.Pro | ❌ **Texto inventado, confirmado.** Se corrige en su tanda (ojo con el NDA, abajo) |

Se hicieron todos con la misma herramienta, así que se asume que los tres
tienen el problema, sin revisarlos uno por uno. Paseo lo confirmó, y en
**las dos** pantallas: si el mockup tiene más de un dispositivo, se revisan
todos.

> 🚨 **No es una tarea aparte, y no es opcional.** Como el cover y el hero son el
> mismo mockup (§3), la pantalla del cover se corrige **en la misma tanda en la
> que se producen las imágenes de ese proyecto**: se arma la escena una vez, con
> la captura real incrustada, y salen los dos encuadres. **La tanda de un
> proyecto no está cerrada mientras su cover siga con texto inventado**, aunque
> todas sus imágenes de case study estén listas.

> ⚠️ **FutbolTalent es la excepción al "mismo mockup".** El NDA prohíbe
> pantallas finales del producto (`CLAUDE.md` §4), así que su hero no puede ser
> un mockup con UI. El cover se corrige igual en su tanda, con **solo el logo
> real** en pantalla y nada de producto. Cómo se relaciona con su hero se
> decide al arrancar ese proyecto, pensándolo distinto desde el principio.

### 1.2. Una imagen tiene que ser comprensible a 330px de ancho

En mobile la imagen se muestra **completa y sin recortar, a ~330px**. Un frame
de 1200 se ve al **27%**.

**La regla:**

> Una imagen tiene que ser comprensible a 330px de ancho. Eso se cumple de dos
> maneras: **o su texto mide 36px o más** en el frame, **o no tiene contenido
> textual que haga falta leer** — su significado es estructural (tiras,
> diagramas, paletas, clústeres).

> ⚠️ Antes esto era *"texto mínimo 36px"* a secas, y estaba mal formulado de
> origen: prohibía la tira larga y los diagramas, que son justamente las dos
> cosas que mejor funcionan. No se arregló con una excepción —una excepción se
> erosiona— sino reformulando la regla alrededor de lo que de verdad importa,
> que es la comprensión, no el tamaño de la fuente.

Así formulada sigue prohibiendo exactamente lo que tenía que prohibir:
**screenshots con párrafos, bullets o cards de texto adentro.**

Los dos casos reales que la regla nueva juzga igual que la vieja:

| | Veredicto |
|---|---|
| `03-decisions` de Pulso (ya borrada) — un caso de éxito con bullets | ❌ A 330px solo se lee el título; la lista es textura. Tiene texto que hace falta leer y mide menos de 36px |
| `04-diagrama` de Pulso (antes `04-delivered`) — un diagrama de dos vías de contacto | ✅ Su significado está en la estructura y sobrevive al 27% de escala. **Es el estándar a igualar** |

**Y una sola idea por imagen.** Si hay que entrecerrar los ojos para entender
qué muestra, está mal. Era el otro defecto de las provisorias de Pulso:
`02-challenge` (ya borrada) metía logos + CTA + dos cards en la misma imagen.

---

## 2. Vocabulario de tipos — case study

Reemplaza a la cuota de "4 imágenes por caso". **No hay cantidad fija**: cada
proyecto usa los tipos que necesita, pueden ser 2 o 6.

> ⚠️ **Por qué se fue la cuota.** Se decidió "4 por case study" antes de saber
> qué necesitaba cada caso, y con una cuota fija terminás inventando qué poner
> en cada slot. Se materializó como un array de 4 posiciones fijas en
> TypeScript y de ahí se propagó al naming de los archivos, al brief y al
> cálculo de "35 imágenes". Nadie la escribió como decisión y nadie la
> defendió nunca.

En el código son dos campos del brief (`src/types/index.ts`), y la traducción a
layout vive en `src/components/case-study/imageSpec.ts`:

- **`type`** → qué es y, por consecuencia, cómo se rendea.
- **`slot`** → dónde cae en la página (`hero`, `intro`, `challenge`,
  `decisions`, `delivered`, `end`).

**Varias imágenes pueden compartir `slot`.** Eso es lo que produce los grupos
de 2-3 imágenes seguidas sin texto entre medio, en vez de la alternancia 1 a 1
párrafo-imagen que tenía el layout viejo y que se leía predecible.

### Los 6 tipos

| `type` | Archivo | Ancho | Recorte | Frame 1× | Export 2× |
|---|---|---|---|---|---|
| **`mockup`** | `mockup` | **a sangre** (viewport) | ninguno | `1280 × 549` (21:9) | `2560 × 1097` |
| **`long-strip`** | `tira` | **a sangre** (viewport) | ninguno | `1440 × alto real` | `2880 × …` |
| **`screen-cluster`** | `cluster` | shell (1280) | 3:2 | `1200 × 800` | `2400 × 1600` |
| **`palette`** | `paleta` | shell (1280) | 16:9 | `1200 × 675` | `2400 × 1350` |
| **`diagram`** | `diagrama` | shell (1280) | 3:2 | `1200 × 800` | `2400 × 1600` |
| **`detail`** | `detalle` | shell (1280) | 3:2 | `1200 × 800` | `2400 × 1600` |

La columna **Archivo** es el nombre que lleva la pieza en disco (§5). El `type`
queda en inglés porque es código; el archivo, en castellano, porque es lo que
se lee en Figma y en la carpeta.

### Casos reales: ningún proyecto usa todos los tipos

Es la prueba de que el vocabulario funciona. **La cantidad sale de lo que el
proyecto tiene para mostrar**, y lo que un proyecto no usa es tan deliberado
como lo que usa.

| | `mockup` | `long-strip` | `screen-cluster` | `palette` | `diagram` | `detail` | Total |
|---|---|---|---|---|---|---|---|
| **Pulso Creativo** | hero | intro | decisions | decisions | delivered | — | **5** |
| **Paseo Güemes** | hero | intro | decisions | delivered | — | — | **4** |
| **El Ritual del Tono** | hero | intro | decisions | delivered | decisions | — | **5** |

**Pulso va sin imagen en "El desafío".** El desafío era texto denso del cliente
y conflictos de plantillas de WordPress: no hay nada visual honesto que
mostrar. El slot vacío no es un hueco por completar.

**Paseo va sin diagrama.** Sus decisiones —reserva directa sobre las OTAs, un
stack que el cliente puede editar, la jerarquía del hero y los CTAs por
recorrido— no tienen una estructura que valga la pena dibujar. **Forzar un
diagrama sería volver a la cuota**: hacer la imagen porque el tipo existe, no
porque el proyecto la necesite.

Ninguno de los dos usa `detail`.

**`mockup` — el hero.** El sitio en un dispositivo, en un entorno real, en
encuadre panorámico 21:9. **Es la misma composición que el cover del home**, a
propósito (§3). Va a sangre y sin recorte: es una composición cerrada
—dispositivo, luz, sombra— y cualquier recorte le come el encuadre. Sin
parallax, por la misma razón que la tira.

> **Por qué es un tipo y no "el slot `hero` va a sangre".** El ancho lo decide
> **qué** es la imagen, nunca **dónde** cae. Si el slot decidiera el ancho, la
> misma pieza se vería distinto según el lugar y el nombre del archivo dejaría
> de alcanzar para saber cómo se va a rendear.

> **Por qué 2560 alcanza a sangre.** A 1920px con DPR 1 sobra; en una laptop
> de 1440 con DPR 2 cubre el 89% de lo que pediría. Mismo criterio que el 2×
> del shell (§5): la diferencia no se ve.

> ⚠️ **Rige la regla 1.1 igual que en el cover, y más fuerte.** A sangre, el
> párrafo de la pantalla se lee sin zoom. Ver el incidente.

**`long-strip` — la tira.** La página entera capturada, escalada para que
entre completa en una sola imagen. Muestra alcance sin explicar nada, y es la
única prueba de scope que sirve en los proyectos WordPress, donde no hay
wireframes que mostrar. Va a sangre y sin recorte: su significado **es** su
largo, así que recortarla a cualquier proporción fija deja ver una franja del
medio y tira el resto. Tampoco lleva parallax — lo que el ojo quiere de una
tira es recorrerla.

> **Puede ir en una columna o partida en columnas.** Una página en una sola
> columna da una tira muy alta; partida en columnas lado a lado entra en un
> formato apaisado. **Caso real — `01-tira` de Pulso:** la home desktop partida
> en dos columnas y la home mobile en dos, sobre hormigón de valor medio, en
> **16:9** (`2400 × 1350`, `frame: { width: 1440, height: 810 }`). Va en el
> slot `intro`, no en el hero. La textura de hormigón la emparenta con el
> mockup del hero: se leen como piezas de la misma familia.

> **Las columnas tienen que llenar el encuadre.** Una imagen a sangre necesita
> presencia. En la tira de Pulso las columnas ocupan ~60% del ancho y sobra
> gris alrededor: se ven como capturas chiquitas flotando. **La de Paseo es el
> estándar** —la home desktop en dos columnas y la mobile en tres, de borde a
> borde— y la de Pulso se rehace con ese criterio.

> **Variante: varias páginas distintas en vez de una sola partida.** La tira
> no tiene por qué ser siempre la home. Cuando el valor del proyecto es que es
> **un producto con varias pantallas** —y no un sitio de una página larga—, las
> columnas pueden ser páginas diferentes. **Caso real — `01-tira` de El Ritual
> del Tono:** cuatro columnas —la home, la página de un artista con el setup de
> cada canción, el catálogo de equipos y la ficha de un producto en mobile—
> sobre hormigón, en **16:9** (`2400 × 1350`, `frame: { width: 1440, height:
> 810 }`), llenando el encuadre de borde a borde. Rige lo mismo que en la tira
> de una sola página: escalar sin deformar, y todas las columnas a la misma
> altura para que se lean como una fila.

> ⚠️ Antes esta sección decía que la tira **era** el hero de cada case study.
> Dejó de serlo cuando el hero pasó a ser el `mockup`.

> **Cómo capturarla.** DevTools con el device toolbar en `1440 × 900` y **DPR
> 2**, después *Capture full size screenshot*: sale a 2880px de ancho nativos,
> que es exactamente lo que necesita una imagen a sangre. Componer sobre el
> fondo en un frame de 1440 y exportar a 2×.

> ⚠️ **Escalar proporcionalmente, nunca deformar.** "Comprimida en vertical"
> quiere decir que la página entera entra en una tira, no que se achate: una UI
> deformada se lee como un bug de render, y en un portfolio de UX/UI eso cuesta
> más que la imagen que ahorra.

> ⚠️ **Declarar `frame` en el brief.** El largo de una tira depende de cuánto
> mida la página y de cuántas columnas tenga, así que el código no puede
> adivinar su proporción. Si no se declara, se asume 1:3: la imagen se ve bien
> igual, pero la página pega un salto de layout al cargar (CLS). El `mockup`
> tiene 21:9 de default; si alguno se exporta en otra proporción, también
> declara `frame`.

### Qué proporción espera cada tipo y qué pasa si el archivo no coincide

**Leer esto antes de abrir Figma.** Salió de entregar la paleta de Pulso en 3:2
cuando `palette` recorta a 16:9.

Hay **dos familias**, y se comportan distinto:

| `type` | Proporción que asume | Export 2× | Mobile (`< 768px`) | Desktop (`md+`) si no coincide |
|---|---|---|---|---|
| **`mockup`** | 21:9 de default, **cualquiera** si se declara `frame` | `2560 × 1097` | Completa | **Nunca recorta.** Si `frame` no coincide con el archivo, la página pega un salto al cargar (CLS) |
| **`long-strip`** | 1:3 de default, **cualquiera** si se declara `frame` | `2880 × …` | Completa | Igual que `mockup`: sin recorte, solo salto al cargar |
| **`screen-cluster`** | **3:2, fija** | `2400 × 1600` | Completa + salto al cargar | **Recorta** con `object-cover` |
| **`palette`** | **16:9, fija** | `2400 × 1350` | Completa + salto al cargar | **Recorta** con `object-cover` |
| **`diagram`** | **3:2, fija** | `2400 × 1600` | Completa + salto al cargar | **Recorta** con `object-cover` |
| **`detail`** | **3:2, fija** | `2400 × 1600` | Completa + salto al cargar | **Recorta** con `object-cover` |

**Sin recorte (`mockup`, `long-strip`):** entregá la proporción que la pieza
necesite y **declarala en `frame`**. Nada se corta nunca; lo único que se
arriesga es el salto de layout.

**Con recorte (los otros cuatro):** la proporción es **del tipo, no de la
pieza**. `frame` no la cambia. Si el archivo no coincide:

- **Más alto que el tipo** (3:2 en un `palette` 16:9): se come arriba y abajo.
  Molesto, pero sobrevive si el contenido está centrado.
- **Más ancho que el tipo** (16:9 o 21:9 en un tipo 3:2): se come **los
  costados**, y mucho. Un 21:9 en 3:2 pierde ~250px por lado del frame de 1200.
  **Es el error caro.**

> ⚠️ **Aunque la proporción coincida, en desktop se pierde un borde.** El
> parallax hace la imagen **48px más alta** que su contenedor para tener
> recorrido, así que `object-cover` la agranda y recorta **también a los
> costados**. Medido en el desktop más angosto (688px de ancho, el peor caso):
>
> | | Por lado | Arriba / abajo (extremo del parallax) |
> |---|---|---|
> | 3:2 en `1200 × 800` | 57px | 76px |
> | 16:9 en `1200 × 675` | 66px | 74px |
>
> **Zona segura para los tipos con recorte: 80px en cada borde del frame 1×
> (160px en el export 2×).** Nada que importe —texto, bordes de una card, la
> punta de un diagrama— va ahí adentro. El fondo sí.
>
> Es el costo del parallax. Si algún día molesta, se achica el parallax; no se
> le pide más margen a cada imagen.

**`screen-cluster`.** Dos o tres pantallas juntas —mobiles o laptops— sobre un
plano de color liso. Es lo que hace que un caso se lea como "hay un sistema
entero acá" aunque no leas una palabra.

**`palette`.** Bandas de color con su nombre. Honesto para los proyectos donde
el sistema visual salió de los logos del cliente y no de una identidad propia.

> **Formato: sin tarjeta.** El logo **grande a la izquierda, apoyado sobre el
> fondo** —no dentro de una caja— y las bandas grandes a la derecha. El fondo va
> de **valor medio** (§4.2); el charcoal de la primera versión daba los números
> pero en la página no dejaba ver el borde de la imagen.

> ⚠️ **El logo va en una variante real de la marca, nunca recoloreado.** Sobre
> fondo oscuro se usa la versión clara **si el cliente tiene una y la usa**:
> Paseo la usa en el header de su propio sitio. Inventar un recoloreo es
> maquillar la identidad del cliente, y en un portfolio de UX/UI eso se nota.

> **El "sin tarjeta" es sobre no AGREGAR una caja, no sobre sacarle al logo la
> suya.** En El Ritual del Tono la púa va dentro de un **círculo blanco con
> contorno oscuro**, y está bien: así es el asset real, el favicon de la demo.
> Lo que se prohíbe es meter el logo en una card que no existe en la marca.

**`diagram`.** Solo cuando hay una decisión con estructura que mostrar: un
flujo, una arquitectura de información, un 70/30. Es el tipo que mejor
sobrevive a la escala, por 1.2.

> **Se justifica cuando lo que muestra no está en ninguna pantalla.** Si la
> decisión se ve en el producto, se muestra el producto. **Caso real —
> `03-diagrama` de El Ritual del Tono:** una Stratocaster del catálogo, un solo
> documento, referenciada por 11 canciones de 7 artistas. El modelo de datos no
> aparece en ninguna pantalla y es lo que prueba que el proyecto es full-stack
> y no un frontend con datos fijos. Sale de los esquemas reales del backend, no
> del copy. **El contraejemplo es `04-diagrama` de Pulso**: las dos vías de
> contacto sí se ven en el sitio, y por eso está en revisión (`CLAUDE.md` §8,
> punto 8).

**`detail`.** Un recorte o zoom de UNA pantalla. **Nunca la pantalla entera**:
a 330px una pantalla completa es una mancha gris.

### Lo que queda AFUERA del vocabulario

**Cualquier imagen que haya que LEER.** Screenshots con párrafos, con bullets o
con cards de texto adentro. Si la idea de la imagen es que el lector lea algo,
no es una imagen: es copy, y el copy va en el cuerpo del case study.

---

## 3. Covers del home

| | Frame 1× | Export 2× | Proporción |
|---|---|---|---|
| **Cover ancho** | `1200 × 900` | `2400 × 1800` | 4:3 |
| **Cover cuadrado** | `1200 × 1200` | `2400 × 2400` | 1:1 |

La forma de cada proyecto vive en `cardShape` (`src/data/projects.ts`). La
grilla del home es masonry de dos columnas, así que **cada card tiene el aspect
exacto de su imagen y `object-cover` no recorta nada**.

### Cómo se rendea (leer antes de abrir Figma)

```
reposo   la imagen SOLA, a sangre, a color y al 100%. CERO texto encima.
hover    lavado terracota + nombre (arriba izq) + "VER PROYECTO" (abajo izq)
         + categoría (abajo der) + escuadras en las 4 esquinas
```

### Reglas de los covers

1. **El texto de la pantalla tiene que ser real** → regla 1.1.
2. **La imagen no puede compartir la luminancia del fondo de página.** El sitio
   es dual-theme (`#111110` oscuro por defecto, `#EDE2CD` claro) y el cover es
   el mismo archivo en los dos: si el borde coincide en valor con alguno, la
   card se disuelve. En la práctica: **entorno gris neutro de valor medio**
   (hormigón, yeso, metal), que contrasta contra los dos. Es la misma regla que
   vale para **todas** las imágenes del sitio (§4.2), no una propia de covers.
   > ⚠️ Esta regla decía antes *"el fondo va oscuro, siempre"*. Fue la
   > corrección correcta cuando el primer cover era negro sobre negro, pero era
   > demasiado absoluta: prohibía justo lo que hace la referencia y lo que
   > terminó funcionando. Lo que importaba nunca fue que el fondo fuera oscuro,
   > sino que **no se confundiera con la página**.
3. **Rango tonal obligatorio: p95 − p05 ≥ 120.** El hover aplica un duotono
   terracota por CSS; si la imagen es pareja, el cambio no se percibe como
   interacción. Se consigue con **luz dura y direccional**, no aclarando el
   fondo. Referencia: el primer cover de Pulso daba 47 y el hover se sentía
   muerto; el actual da 207.
4. **Sin texto propio.** En reposo la card no muestra nada encima de la imagen.
   Ojo con las capturas: un titular grande del sitio compite con el nombre.
5. **Nunca entregar un cover ya duotonado.** El duotono lo aplica el CSS; si
   viene aplicado desde Figma se le pone dos veces.

### La receta única de los 7 covers

Se ven los 4 del home uno al lado del otro, así que la grilla tiene que leerse
como un sistema y no como un collage:

> El producto en un entorno real, con **luz dura y direccional**. Un
> dispositivo con el sitio en pantalla, apoyado sobre una superficie con
> textura (hormigón, yeso, metal), y una sombra diagonal marcada.

1. **El entorno es acromático.** Gris, sin color propio: **el único color de la
   imagen sale de la pantalla del dispositivo.**
2. **La luz es dura y direccional.** La sombra diagonal no es decoración: es lo
   que genera el rango tonal de la regla 3. Luz difusa = imagen plana = hover
   invisible.
3. **El dispositivo ocupa el centro óptico** (y ≈ 45% del alto, no 50%: el
   centrado geométrico se ve caído), con aire alrededor. Sombra difusa al
   **15-25% de opacidad** — la drop shadow default de Figma es demasiado dura y
   corta: subile el blur y bajale la opacidad.

> ⚠️ **Excepción a la regla 1 — El Ritual del Tono.** Su cover lleva un
> **amplificador Fender en tweed** (amarillo-marrón) y un pedal al lado de la
> laptop, así que la pantalla **no** es el único color de la imagen. **Decisión
> de Tiago (2026-09-21): queda.** El motivo: es el objeto que diferencia este
> cover de los otros tres. Cada cover tiene su protagonista para que la serie
> no se lea repetida, y el de Ritual es el equipo de guitarra; un ampli gris
> dejaría de decir "guitarristas".
>
> **Es una excepción de color, no un cambio de regla.** Los demás covers siguen
> acromáticos. Si otro proyecto pide un objeto con color propio, se decide caso
> por caso y se anota acá.

### El cover y el hero son el mismo mockup, a propósito

Una sola escena en dos encuadres: el de la card del home (4:3 o 1:1, según
`cardShape`) y **21:9 a sangre** para el hero del case study (`type: 'mockup'`).

> ⚠️ **Mirar `cardShape` antes de exportar el cover.** La card recorta con
> `object-cover` a su propia forma, así que un cover en la proporción de otra
> card pierde encuadre. Pasó con Paseo: salió en 1:1 (la de Pulso) y su card
> es `wide` (4:3), así que perdía 300px arriba y 300px abajo del archivo (ya
> re-exportado a `2400 × 1800`). **Pulso es `square`; Paseo, FutbolTalent y
> Ritual son `wide`.**
Crea continuidad: hacés clic en la card y aterrizás en la misma imagen, ahora
grande y completa.

> ⚠️ **Lo que sigue prohibido es otra cosa: un hero que sea una versión PEOR
> del cover.** Pasó con el `01-hero` provisorio de Pulso: el mismo screenshot,
> con menos margen, sin composición y con una cuña blanca en una esquina. Eso no
> es continuidad; es bajarle la calidad al cover justo en la primera imagen del
> case study.
>
> **Cómo se distinguen.** El hero bien hecho es la misma escena **compuesta para
> su lienzo**: misma luz, misma terminación, el dispositivo en su centro óptico
> y a la resolución de su propio export. El mal hecho sale de **recortar y
> agrandar** el cover. Cambia el lienzo, nunca la calidad.

> ⚠️ **Excepción — El Ritual del Tono: el cover y el hero divergen.** El cover
> tiene texto inventado en la pantalla (*"los tonos legendarios de los
> **guionnates** más icónicos"*) y **se queda como está por decisión de Tiago**
> (2026-09-21). Un hero sacado de esa escena heredaría el texto inventado, y a
> sangre se lee sin zoom. Por eso el hero es una **composición plana nueva**: la
> home en desktop (captura plana) y en celular (marco dibujado, pantalla con la
> captura real) sobre hormigón. Se pierde la continuidad card → hero, y es el
> precio de no publicar texto inventado a sangre.
>
> 🚨 **Esto no cierra el problema del cover.** Por la regla de §1.1, **la tanda
> de Ritual NO está cerrada** mientras su cover tenga texto inventado. Queda
> como pendiente, no como resuelto. Cuando se corrija, conviene rearmarlo
> desde la escena del hero nuevo, así cover y hero vuelven a ser la misma
> imagen.

> Antes esta regla decía lo contrario: *"si al mirarlos juntos parecen la misma
> imagen, rehacé uno de los dos"*. Se escribió contra ese `01-hero`, y mezclaba
> dos cosas distintas: que se parezcan (lo que ahora se busca) y que el hero
> sea peor (lo que sigue prohibido). **No borrar esta distinción.**

---

## 4. Qué cambia entre cover y case study — y qué no

Tres reglas nacieron en los covers. **Dos cambian** al pasar al case study,
porque sus razones no son las mismas en los dos lados: el color (4.1) y el
rango tonal (4.3). **Una no cambia**, porque su razón es idéntica: la
luminancia del borde (4.2).

Es la parte del sistema que más fácil se aplica mal, y ya pasó en la dirección
contraria: la regla de luminancia tuvo una excepción para el case study que no
tenía por qué existir.

### 4.1. Color: covers acromáticos · case studies con color de marca

| | Entorno | Por qué |
|---|---|---|
| **Covers** | **Acromático.** El único color sale de la pantalla (una excepción anotada en §3: el Fender de Ritual) | Los 4 se ven **juntos** en el home. Si cada uno trae el color de su cliente, la grilla se lee como un collage. Es lo que hace que siete proyectos con paletas distintas parezcan una misma serie |
| **Case study** | **Color de marca del cliente**, bienvenido (planos de color, bandas de paleta) | Se ve **solo**, una página a la vez. No hay nada con lo que competir, y el color del cliente es información sobre el proyecto |

> **Es un split deliberado, no una contradicción.** La receta acromática existe
> para que la serie del home se lea como una sola mano; adentro de un case
> study ese problema no existe. Si en algún momento se unifican las dos, el
> home vuelve a leerse como un collage.

**Caso real — Pulso Creativo.** Paleta del cliente, extraída del logo y del
sitio: `#95C01F` verde acción · `#8EB943` verde marca · `#414042` grafito ·
`#0A0D07` negro · `#FFFFFF` blanco.

| Imagen | Fondo | Color de marca | Por qué está bien |
|---|---|---|---|
| Cover | Hormigón gris | Solo en la pantalla | Se ve en la serie del home: receta acromática |
| `00-mockup` | Hormigón gris | Solo en la pantalla | Es la misma escena que el cover (§3), así que hereda su receta aunque viva en el case study |
| `01-tira` | Hormigón de valor medio | Solo en las capturas | Misma textura que el mockup: las dos piezas a sangre se leen como una familia. Y el valor medio la salva de §4.2 |
| `02-cluster` | **Plano del verde marca `#8EB943`** | Sí, todo el fondo | Se ve sola en su página. El verde dice de quién es el proyecto antes de leer nada |
| `03-paleta` | Gris de **valor medio** (73) | Sí, las bandas y el logo | El contenido **es** la paleta. Mismo formato sin tarjeta que la de Paseo |
| `04-diagrama` | Charcoal | Acentos | Es la otra pieza de **documentación** junto con la paleta. ⚠️ **Quedó desparejo**: la paleta pasó a valor medio (73) y el diagrama sigue en charcoal (42), que falla §4.2 en la página. Se iguala cuando se rehaga |

Ninguna de las dos de `decisions` es acromática, y eso es la regla funcionando,
no una excepción. **Lo que ordena la serie no es el color sino la familia**:
hormigón para lo que muestra el sitio, charcoal para lo que lo documenta.

**Caso real — Paseo Güemes Hotel.** Paleta del cliente, extraída del logo:
`#6A442E` marrón marca · `#8C6A4A` marrón claro · `#F5F1EB` crema ·
`#1A1A18` negro · `#FFFFFF` blanco.

| Imagen | Fondo | Color de marca | Por qué está bien |
|---|---|---|---|
| Cover | Hormigón gris | Solo en las pantallas | Receta acromática de la serie del home |
| `00-mockup` | Hormigón gris | Solo en las pantallas | La misma escena que el cover (§3) |
| `01-tira` | Hormigón | Solo en las capturas | Familia con el mockup, igual que en Pulso |
| `02-cluster` | **Plano del marrón marca `#6A442E`** | Sí, todo el fondo | El marrón del logo dice de quién es el proyecto antes de leer nada |
| `03-paleta` | Gris de **valor medio** (73), con degradado sutil | Sí, las bandas y el logo | El contenido es la paleta. El fondo neutro deja que las muestras se lean, y el valor medio cumple §4.2. El logo va en su **variante clara real**, la que el hotel usa sobre oscuro en su propio header |

**Caso real — El Ritual del Tono.** Paleta del sitio y del logo:
`#FD9A00` naranja acción · `#C47D58` cobre · `#2257A8` azul · `#0A0A0A`
negro · `#FFFFFF` blanco. El logo lo generó Tiago con IA: la paleta lo
muestra, pero **no se presenta como identidad diseñada por él**. Lo suyo son
las decisiones del sitio (el naranja como color de acción, la interfaz oscura).

| Imagen | Fondo | Color de marca | Por qué está bien |
|---|---|---|---|
| Cover | Hormigón gris + ampli Fender tweed | En la pantalla **y en el ampli** | La excepción anotada en §3 |
| `00-mockup` | Hormigón gris | Solo en las pantallas | Composición nueva, no la escena del cover (§3) |
| `01-tira` | Hormigón | Solo en las capturas | Familia con el mockup |
| `02-cluster` | **Plano del cobre del logo `#C47D58`** | Sí, todo el fondo | Mismo lugar que el verde de Pulso y el marrón de Paseo |
| `03-diagrama` | Hormigón con tarjeta oscura | Acentos en naranja | Documentación |
| `04-paleta` | Gris de valor medio (73) | Sí, las bandas y el logo | Mismo formato y fondo que las paletas de Pulso y Paseo |

Paseo repite el patrón de Pulso sin buscarlo, y eso lo confirma como sistema:
**hormigón para las piezas de producto, color de marca en el cluster, y un
fondo neutro para la documentación.** Lo único que cambió es el valor de ese
neutro: era charcoal y pasó a valor medio, porque el charcoal no cumplía §4.2.

### 4.2. Luminancia: una sola regla, sin excepción

> **Toda imagen necesita un borde claramente distinto de los DOS fondos de
> tema, `#111110` y `#EDE2CD`.** Covers y case study, a sangre o dentro del
> shell de 1280. Sin excepción.

**Por qué.** El borde es lo que hace que una imagen se lea como **pieza**. Si
coincide con el fondo, la imagen pierde sus límites: lo que tiene adentro deja
de verse como una lámina y pasa a verse como contenido suelto flotando en la
página —pantallas, bandas o cajas sin nada que las contenga—. Eso no depende
del ancho: pasa igual a 1280 que a sangre. Y como el sitio tiene dos temas y el
archivo es el mismo en los dos, tiene que separarse de **los dos fondos a la
vez**: un borde que se lee en oscuro puede fundirse en claro, y al revés.

> ⚠️ **Había una excepción y se borró.** La tabla vieja eximía a las imágenes
> del shell *"porque tienen `--color-surface` y el gutter de por medio, así que
> nunca tocan el fondo"*. Era falso en el código: el `--color-surface` queda
> detrás de la imagen y la imagen lo tapa entero, y el gutter **es** fondo de
> página. El caso real lo desmintió: `04-diagrama` tenía el **100%** del borde
> igual a `#111110`. No se parchó la excepción; se borró, porque el motivo de la
> regla es el mismo en los dos casos.

**La forma segura: un fondo de valor medio.** Un gris o un color que no sea ni
muy oscuro ni muy claro (hormigón, yeso, un plano de marca en tono medio) se
separa de los dos temas con margen. Un fondo oscuro se lee contra el tema claro
y queda justo contra el oscuro; uno claro, al revés. Es la misma solución que
el entorno de los covers (§3, regla 2).

**Cómo se verifica — dos pasos, y el segundo manda:**

1. **El número, como piso.** Medir el borde (4px) contra los dos fondos: si más
   del ~15% queda cerca de alguno (diferencia sumada por canal ≤ 30), no pasa.
2. **La página, como prueba.** Mirarla en el sitio, **en los dos temas**. Si el
   contorno de la imagen no se lee sin buscarlo, no pasa, aunque el número dé
   verde.

> ⚠️ **El número es un piso, no una prueba.** Solo caza el caso extremo: un
> fondo casi idéntico al de la página. `04-diagrama` sobre charcoal dio **0%**
> cerca de `#111110`, y en la página real el borde casi no se lee.

**Casos reales — Pulso y Paseo.** Luminancia del borde, y su distancia a cada
fondo (`#111110` ≈ 17 · `#EDE2CD` ≈ 227). "—" en la última columna = no
revisado a mano en la página.

| Imagen | Borde | Distancia oscuro / claro | Número | En la página |
|---|---|---|---|---|
| `01-tira`, primera versión | casi negro | — | ❌ 71,5% del borde pegado a `#111110` | Se fundía en el tema por defecto |
| `01-tira` | hormigón, 92 | 75 / 135 | ✅ | — |
| `04-diagrama`, primera versión | `#0E0E0E` | — | ❌ 100% igual a `#111110` | La card no tenía contorno |
| `04-diagrama` | charcoal, 42 | **25** / 185 | ✅ | ❌ **Casi no se lee.** Pendiente: sube un escalón cuando se rehaga |
| `03-paleta`, primera versión | charcoal, 42 | **25** / 185 | ✅ | ⚠️ El mismo borde que el diagrama |
| `03-paleta` | valor medio, 73 | 56 / 154 | ✅ | — Rehecha con el formato de Paseo |
| `02-cluster` | verde marca, 167 | 150 / 60 | ✅ | — |
| `00-mockup` | hormigón, 101 | 84 / 126 | ✅ | — Rehecho sin perspectiva |
| Cover | hormigón, 92 | 75 / 135 | ✅ | — Rehecho sin perspectiva |
| **Paseo** `00-mockup` | hormigón, 110 | 93 / 117 | ✅ | — |
| **Paseo** `01-tira` | hormigón + capturas en los costados, 127 | 110 / 100 | ✅ | — |
| **Paseo** `02-cluster` | marrón marca, 75 | **58** / 152 | ✅ | — Es la más cercana al oscuro después del charcoal. Mirarla en la página |
| **Paseo** `03-paleta` | valor medio, 73 | 56 / 154 | ✅ | — Rehecha: la primera versión era charcoal (42), el mismo que el diagrama de Pulso |
| **Paseo** cover | hormigón, 96 | 79 / 131 | ✅ | — |
| **Ritual** `00-mockup` | hormigón, 82 | 65 / 145 | ✅ 0% cerca de los dos | — Composición nueva, no la del cover (§3) |
| **Ritual** `01-tira` | hormigón, 93 | 76 / 134 | ✅ 0% cerca de los dos | — |
| **Ritual** `02-cluster` | cobre del logo, 137 | 120 / 90 | ✅ 0% cerca de los dos | — |
| **Ritual** `03-diagrama` | hormigón alrededor de una tarjeta oscura, 92 | 75 / 135 | ✅ 0% cerca de los dos | — **Re-exportada.** La primera versión tenía la tarjeta a 48px del borde: en desktops angostos el recorte se comía el hormigón y el borde visible pasaba a ser la tarjeta oscura, pegada a `#111110`. Ahora está a 103 / 83 |
| **Ritual** `04-paleta` | valor medio, 73 | 56 / 154 | ✅ 0% cerca de los dos | — Mismo fondo que las paletas de Pulso y Paseo |

El único dato que hay para calibrar un umbral mejor: **25 de distancia contra
el fondo no alcanza**. Cuando haya más casos vistos en la página, se puede
reemplazar el test del ~15% por una distancia mínima.

### 4.3. Rango tonal: solo covers

**Rango tonal p95 − p05 ≥ 120** en los covers; **no aplica** a las imágenes de
case study.

**Por qué.** La regla existe para que el **duotono del hover** se perciba como
interacción. Las imágenes de case study **no tienen hover**: no abren nada, y
por eso tampoco tienen cursor custom. Sin hover no hay nada que la regla
proteja.

---

## 5. Exportación y naming

**El proceso**, paso a paso:

1. Seleccionar **el frame**, no el grupo de adentro. Si exportás el grupo,
   Figma recorta al contenido y perdés el fondo y la proporción.
2. Panel derecho → **Export** → `+`
3. Escala **2×** · sufijo **vacío** (si lo dejás, el archivo sale con `@2x` en
   el nombre y no matchea el path del código).
4. **JPG** para lo fotográfico o con degradados · **PNG** para lo plano y
   gráfico (diagramas, wireframes, composiciones de color: pesa poco y queda
   perfecto).

> ⚠️ **No busques un control de calidad para el JPG: Figma no lo tiene.** El
> panel solo tiene formato y escala. La elección real es JPG vs PNG y se decide
> **por peso, no por calidad**: el master se re-comprime a WebP igual, así que
> un PNG sin pérdida es el mejor input — pero un PNG fotográfico de 2400×1600
> pesa 5-8 MB.

**Peso**: sin presupuesto. Referencia sana: que ninguno pase de ~1 MB (hasta
~1,5 MB está bien en las más altas), por el peso del repo.

**Lo responsive no depende de vos.** `next/image` genera 8 anchos de cada
archivo y le sirve a cada dispositivo el que le toca. Entregás **un** master.

> **Por qué 2× alcanza.** El lugar más grande donde se rendea una imagen del
> shell es 1280px CSS, que en retina pediría 2560px. El master de 2400 cubre
> 1,875× en vez de 2× y la diferencia no se ve. Si alguna vez querés el 2×
> exacto, exportá esa pieza a 2,2×.
>
> ⚠️ Ese 1280 **era 944** cuando el case study tenía sidebar sticky. Si volviera
> a angostarse la columna, este número y el `sizes` de `imageSpec.ts` se mueven
> juntos.

**Naming — el nombre dice QUÉ es, no DÓNDE va:**

```
public/images/covers/{slug}-cover.jpg

public/images/case-study/{slug}/{nn}-{nombre}.jpg
                                 │    └─ el tipo de pieza (columna "Archivo" de §2)
                                 └─ orden de aparición en la página
```

El caso real de Pulso, cinco piezas de cinco tipos:

```
00-mockup.jpg      type mockup          slot hero
01-tira.jpg        type long-strip      slot intro
02-cluster.jpg     type screen-cluster  slot decisions
03-paleta.jpg      type palette         slot decisions
04-diagrama.jpg    type diagram         slot delivered
```

**El número es el orden. El nombre es el tipo. El `slot` del brief decide
dónde cae.** El archivo dice qué es; el código dice dónde va.

> ⚠️ **Por qué cambió.** El naming viejo era `01-hero` · `02-challenge` ·
> `03-decisions` · `04-delivered`, y esos nombres codificaban la **sección** de
> la página. O sea: la cuota de 4 no vivía solo en el código, también estaba
> escrita en los nombres de archivo. Mientras un archivo se llame
> `02-challenge`, hay exactamente un lugar donde puede ir y exactamente una
> imagen que puede ir ahí.
>
> En las referencias (Studio Dizzy, mikekus, Posta) las imágenes no están
> atadas a párrafos: son una secuencia visual con su propio ritmo, y el texto
> va por al lado. Studio Dizzy tiene tres imágenes en Voltfang; mikekus tiene
> diez en MIXD, porque es branding y tiene packaging y merch. **La cantidad sale
> de lo que el proyecto tiene para mostrar, no de cuántas secciones de prosa
> hay.**

Dos consecuencias:

- **Dos piezas del mismo tipo llevan sufijo**: `02-cluster-a.jpg`,
  `02-cluster-b.jpg`. Con el naming viejo era imposible: no podés tener dos
  `02-challenge`.
- **La numeración no es una plantilla.** Pulso tiene cinco, Paseo tiene
  cuatro, otro puede tener tres. No existe un `00`–`04` fijo, y que un slot
  quede sin imagen es el sistema funcionando (ver *"Casos reales: ningún
  proyecto usa todos los tipos"* en §2).

> Ya no queda ningún archivo con el naming viejo: las provisorias de Pulso y de
> Paseo se borraron al rehacerse.

⚠️ **La extensión en `projects.ts` tiene que ser la real** (`.jpg` / `.png`),
nunca `.webp`: el WebP lo genera Next al vuelo y no existe en el repo.

**Cómo cablear una imagen** — subir el archivo y agregar el `src`. No hace
falta tocar ningún componente:

```ts
// Cover — en el entry del proyecto:
coverImage: '/images/covers/pulso-creativo-cover.jpg',

// Case study — un brief nuevo en imageBriefs:
{
  type: 'long-strip',
  slot: 'intro',
  frame: { width: 1440, height: 810 },   // solo tipos sin recorte
  alt: { es: '…', en: '…' },
  src: '/images/case-study/pulso-creativo/01-tira.jpg',
},
```

---

## 6. Cómo se juzga una imagen terminada

**Dos revisiones, distintas, y las dos hacen falta.** Una no reemplaza a la
otra: al 100% se ve lo que el tamaño de render esconde, y al tamaño de render
se ve lo que el 100% exagera.

> ⚠️ **El texto generado no se juzga al tamaño de render.** Con los covers se
> lo declaró no bloqueante porque al ancho de la card mide 3-4px, y fue un
> error: se lee con zoom, y el mismo mockup va a sangre en el hero. Si el
> control al 100% encuentra una palabra inventada, la imagen no sirve, se vea
> o no a 628px. Ver el incidente en §1.1.

| | Qué se controla |
|---|---|
| **Al 100%** | El **contenido**: que el texto exista y sea real, que no haya artefactos |
| **Al tamaño de render** | El **impacto**: qué se lee de verdad, si algo molesta, si hay jerarquía |

Para renderizar al tamaño real, `sharp` alcanza:

```js
sharp(f).resize(628, 471)   // card ancha del home
sharp(f).resize(1280)       // imagen de case study en desktop
sharp(f).resize(330)        // imagen de case study en celular
```

⚠️ **Un número verde no dice nada del contenido.** El rango tonal, el contraste
y las proporciones se pueden medir con tres decimales mientras la imagen dice
`REMITIOOS`. Primero 1.1, después los números.
