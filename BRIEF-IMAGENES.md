# Brief de imagenes — Gotya

> **Documento temporal, y solo direccion de arte**: como tiene que verse cada una de
> las 35 imagenes. El proceso vive en otro lado — medidas en `CLAUDE.md` §2, orden de
> prioridad en §8, como cablear cada archivo en §10. Cuando esten las 35, este archivo
> se borra.

**Estado**: ✅ **los 4 covers del home estan hechos y cableados**, mas 4 imagenes
de case study de Pulso. Van 8 de 35.

Dos deudas conocidas, ninguna bloqueante:

1. **El texto de las pantallas esta generado, no capturado** (regla 0), en Paseo,
   Pulso y Ritual. Medido al ancho real de la card (628px) las palabras rotas son
   de 3-4px y no se leen, asi que se publican asi. Al rehacerlos **solo hay que
   reemplazar el contenido de la pantalla**: la composicion esta bien.
2. **Las 4 imagenes de case study de Pulso son PROVISORIAS.** Se rehacen enteras
   cuando se rediseñe la pagina de case study, siguiendo las referencias de Studio
   Dizzy y mikekus/MIXD. **No hagas mas imagenes de case study hasta entonces**: la
   pagina nueva decide cuantas y de que tipo.

Antes de esto habia 31 imagenes que se dieron de baja porque se leian como
generadas con IA. La regla 0 existe para no repetirlo.

---

## Ficha tecnica

### Los covers tienen DOS formas. Las de case study, una sola.

La grilla del home es **masonry**: dos columnas que fluyen por separado y
terminan a distinta altura. Son **solo dos formas**, no una por proyecto.

| | Frame en Figma | Export 2× | Proporcion |
|---|---|---|---|
| **Cover ANCHO** | `1200 × 900` | `2400 × 1800` | 4:3 |
| **Cover CUADRADO** | `1200 × 1200` | `2400 × 2400` | 1:1 |
| **Case study** | `1200 × 800` | `2400 × 1600` | 3:2, siempre |

> **De donde salen esas dos proporciones.** De medir la referencia (Studio
> Dizzy): sus cards son 4:3, 3:2 y ≈1:1. Se tomaron las dos extremas, que son
> las que dan el contraste; la del medio no aportaba una tercera forma util.

> ✅ **Con masonry no se recorta nada.** Cada card tiene exactamente el aspect
> de su imagen, en todos los breakpoints, asi que `object-cover` no corta. Los
> margenes de abajo son aire de diseno, no zona de rescate. (Con la grilla
> alineada por filas que se probo antes si recortaba, y por eso habia un margen
> vertical obligatorio: ya no hace falta.)

**Que forma le toca a cada proyecto:**

| Orden | Proyecto | Forma | Columna |
|---|---|---|---|
| 1 | Paseo Güemes Hotel | ANCHA `1200×900` | izquierda |
| 2 | Pulso Creativo | **CUADRADA** `1200×1200` | derecha |
| 3 | FutbolTalent.Pro | ANCHA `1200×900` | izquierda |
| 4 | El Ritual del Tono | ANCHA `1200×900` | derecha |
| 5-7 | Multibrand · Recuérdalo · Cabify | Definidas, se usan al hacer /projects |

> Las columnas **alternan**: el 1 y el 3 van a la izquierda, el 2 y el 4 a la
> derecha. Por eso la izquierda mide 966px y la derecha 1123px — ese borde
> disparejo es lo que la hace masonry.

✅ **Pulso ya esta en CUADRADA `1200×1200`.**

**Formato de archivo**: **JPG** para lo fotografico o con degradados · **PNG**
para lo plano y grafico.

**Peso**: sin presupuesto. Referencia sana: que ninguno pase de ~1 MB (el cover
alto pesa mas por ser el doble de alto — hasta ~1,5 MB esta bien).

### Por que estas medidas y no un preset de Figma

Porque `1440×1024` y compania son frames de **pantalla**, no de imagen. Representan un viewport: el rectangulo donde entra un sitio entero. Vos no estas disenando una pantalla, estas disenando **contenido que va adentro de una caja que ya existe en el sitio**. La caja es la card: mide `628 × 471` si es ancha (4:3) y `628 × 628` si es cuadrada (1:1).

Dos cosas deciden el numero, en este orden:

**1. La proporcion la dicta la caja** → 4:3 o 1:1, segun el slot. Es lo unico que realmente importa. Si entregas otra proporcion, Next recorta la diferencia y perdes lo que quede afuera.

**2. La resolucion la dicta el lugar mas grande donde se rendea**:

| Donde se usa | Ancho CSS real | En pantalla retina (×2) |
|---|---|---|
| Cover en el home | 628px | necesita **1256px** |
| Imagen de case study | 944px | necesita **1888px** |

Manda el segundo. Cualquiera de los frames exportado a **2×** da **2400px** de ancho, que pasa los 1888 con aire. Exportando a 1× te quedarias en 1200 y las de case study se verian blandas en cualquier laptop moderna.

Tampoco tiene sentido ir mas grande: todo lo que pases de ~2400px `next/image` lo achica igual antes de servirlo. Solo pesa mas el repo.

> **Lo responsive ya esta resuelto y no depende de vos.** Next genera 8 anchos de cada archivo y le sirve a cada dispositivo el que le toca. Entregas **un** master; los tamanos los hace el.

### Como exportar, paso a paso

1. Seleccionar **el frame**, no el grupo de adentro (si exportas el grupo, Figma recorta al contenido y perdes el fondo y la proporcion).
2. Panel derecho → **Export** → `+`
3. Escala **2×** · sufijo **vacio** (si lo dejas, el archivo sale con `@2x` en el nombre y no matchea el path del codigo).
4. Formato **JPG** o **PNG** segun la tabla de arriba.
5. Renombrar al nombre exacto de la seccion **Naming**.

> ⚠️ **No busques un control de calidad para el JPG: Figma no lo tiene.** El panel de
> export solo tiene formato y escala. Exporta en alta calidad y no hay nada que
> configurar.
>
> **Cuando dudes entre JPG y PNG, elegi por peso, no por calidad.** El master se
> re-comprime a WebP igual, asi que un PNG (sin perdida) es tecnicamente el mejor
> input — pero un PNG fotografico de 2400×1600 pesa 5-8 MB y son 35 archivos. Por eso
> la regla practica: **PNG si es plano** (diagramas, wireframes, composiciones de
> color: pesa poco y queda perfecto), **JPG si tiene fotos o degradados**.

### Naming

```
public/images/covers/{slug}-cover.jpg          (o .png segun el caso)

public/images/case-study/{slug}/01-hero.jpg    → Intro (el hook)
                              /02-challenge.jpg → El desafio
                              /03-decisions.jpg → Como lo resolvi
                              /04-delivered.jpg → Lo entregado
```

Slugs exactos (sin acentos):

```
pulso-creativo · paseo-guemes-hotel · futbol-talent-pro · el-ritual-del-tono
multibrand-design-system · recuerdalo · cabify-music-match
```

---

# COVERS

## Como se rendea (leer antes de abrir Figma)

```
reposo   la imagen SOLA, a sangre, a color y al 100%.
         CERO texto encima. Ni titulo, ni ano, ni categoria.

hover    lavado terracota oscurecido sobre toda la imagen
         + nombre del proyecto      (arriba a la izquierda)
         + "VER PROYECTO" con flecha (abajo a la izquierda)
         + categoria del servicio    (abajo a la derecha)
         + escuadras en las 4 esquinas
```

Tres consecuencias que mandan sobre todo lo demas:

1. **La imagen es lo unico que se ve en reposo.** No hay texto que la explique
   ni filtro que la disimule: si el cover es feo, el proyecto se lee feo.
2. **El lavado del hover lo aplica el CSS, no vos.** Nunca entregues un cover ya
   duotonado desde Figma: se le aplicaria dos veces.
3. **El texto del hover va encima de la imagen, en blanco.** El lavado esta
   calibrado al 70% de opacidad para que ese blanco pase AA (6,06:1) incluso
   sobre un area blanca pura. No hace falta que dejes espacio libre, pero si
   que las 4 esquinas y el borde superior izquierdo no tengan detalle critico:
   ahi caen el nombre y las escuadras.

## Reglas duras

### 0. El texto de la pantalla tiene que ser una captura REAL

**Es la regla que mas caro sale romper.** Un generador de imagenes redibuja el
texto chico y produce palabras que no existen. Los dos primeros covers cayeron en
esto: `SERVICIOS` salio `REMITIOOS`, `UBICACION` salio `IWESCION`, y el parrafo
decia *"a paseo del cueʟeo Intoniico y la zona de bosar"*.

En un portfolio de UX/UI eso es letal: **una interfaz con el copy inventado**
contradice el argumento del portfolio. Es el mismo motivo por el que se dieron de
baja las 31 imagenes anteriores.

**El proceso correcto:**

1. Capturar el sitio real — DevTools → `Cmd/Ctrl+Shift+P` → *Capture full size screenshot*.
2. En Figma, **componer** esa captura dentro de la pantalla del mockup, con la
   transformacion de perspectiva que corresponda.
3. El marco del dispositivo, el fondo y la luz **si** pueden ser generados. El
   contenido de la pantalla, **no**.

> ✅ **El control, antes de dar por buena cualquier imagen**: abri el export al 100%
> y **lei el texto mas chico en voz alta**. Si alguna palabra no existe, no sirve.
> Esto va primero, antes de medir proporciones o rango tonal: un numero verde no
> dice nada del contenido.

### 1. La imagen no puede compartir la luminancia del fondo de pagina

El sitio tiene dos fondos de pagina —`#111110` en tema oscuro (el default) y
`#EDE2CD` en claro— y **el cover es el mismo archivo en los dos**. Si el borde de
la imagen coincide en valor con alguno de esos dos, la card se disuelve contra la
pagina en ese tema.

**La regla practica: el entorno del cover va en un gris neutro de valor medio.**
Hormigon, yeso, metal, papel gris. Un valor medio contrasta contra el crema del
tema claro Y contra el casi-negro del oscuro, asi que funciona en los dos sin
tener que entregar dos archivos.

> ⚠️ **Esta regla decia antes "el fondo va OSCURO, siempre".** Fue la correccion
> correcta en su momento —el primer cover de Pulso era negro sobre negro— pero era
> demasiado absoluta: prohibia justo lo que hace la referencia y lo que termino
> funcionando. Lo que importaba nunca fue que el fondo fuera oscuro, sino que **no
> se confundiera con la pagina** y que **tuviera rango tonal** (regla 2).

> **Verificacion**: el cover de Pulso da 1,18:1 de contraste contra el crema, con
> solo el 3,3% del borde cerca de ese valor. Pasa. Si mas del ~15% del borde
> quedara en el valor de la pagina, ahi si se disolveria.

### 2. Rango tonal obligatorio

El hover aplica un duotono terracota por CSS. Para que ese cambio se **perciba**
como una interaccion y no como un cambio de temperatura, la imagen necesita
recorrido de valores: zonas claras y zonas oscuras en la misma foto.

**Como se consigue**: con luz dura y direccional. La sombra marcada es lo que
crea el recorrido. No hace falta ni un fondo claro ni uno oscuro — hace falta
que convivan los dos en la misma imagen.

| | Rango (p95 − p05) | Resultado |
|---|---|---|
| Objetivo | **≥ 120** | el hover se lee |
| Primer cover de Pulso (negro sobre negro) | 47 | el hover se sentia muerto |
| Cover actual de Pulso (hormigon + sombra) | **207** | ✅ |

> **Prueba en Figma**: saturacion −100. Si queda un gris uniforme, falta
> recorrido; si ves negros, grises y blancos, esta bien.

### 3. Las demas

- **Zona segura** (ver la tabla de medidas): 96px a los lados y 64px arriba y
  abajo, en el frame de 1200.
- **Sin texto propio.** En hover la card superpone el nombre, "VER PROYECTO" y
  la categoria. Ojo con las capturas: si el titular del sitio queda grande,
  compite con el nombre y vas a tener dos titulares en la misma caja.
- **Las 4 esquinas llevan escuadras** y el borde superior izquierdo lleva el
  nombre. No pongas detalle critico ahi.
- **Nunca entregues un cover ya duotonado.** El duotono lo aplica el CSS; si viene
  aplicado desde Figma se le pone dos veces.
- **Ya NO hace falta que funcione en escala de grises** como pieza terminada: en idle
  va a color y al 100%. Lo que hace falta es el rango tonal de la regla 2.

## Anatomia del frame — donde va el mockup

```
COVER ANCHO 1200 × 800            COVER ALTO 1200 × 1600

   96px            96px             96px            96px
  ├────┤          ├────┤           ├────┤          ├────┤
  ┌──────────────────────┐ y=0     ┌──────────────────────┐ y=0
  │ ╎ [nombre]        ╎ │ ←64px    │ ╎ [nombre]        ╎ │ ←64px
  │ ╎                 ╎ │          │ ╎                 ╎ │
  │ ╎  ┌───────────┐  ╎ │          │ ╎                 ╎ │
  │ ╎  │ ARTEFACTO │  ╎ │ y=360    │ ╎  ┌───────────┐  ╎ │
  │ ╎  └───────────┘  ╎ │  (45%)   │ ╎  │ ARTEFACTO │  ╎ │ y=720
  │ ╎    ╰ sombra ╯   ╎ │          │ ╎  │           │  ╎ │  (45%)
  │ ╎                 ╎ │          │ ╎  └───────────┘  ╎ │
  │ ╎ [ver]     [cat] ╎ │ ←64px    │ ╎    ╰ sombra ╯   ╎ │
  └──────────────────────┘ y=800   │ ╎                 ╎ │
                                   │ ╎ [ver]     [cat] ╎ │ ←64px
    ⌐ ¬  escuadras en las          └──────────────────────┘ y=1600
    ∟ ┘  4 esquinas, a 12px
```

Los `[corchetes]` son el texto que superpone la card **en hover**. No los
disenes vos: marcan las zonas donde no conviene poner detalle importante.

### ⚠️ Todas las medidas, en las DOS escalas

Se disena en el frame de `1200×800` y se exporta a 2×, asi que **el archivo final
tiene todo al doble**. Confundir las dos columnas ya causo un error real, por eso
van juntas: usa la columna del archivo que estas mirando.

| | En el frame `1200×800` | **En el master `2400×1600`** |
|---|---|---|
| **Margen lateral del cover** | 96px | **192px** |
| **Margen vertical del cover** | 64px | **128px** |
| **Margen del case study** (4 lados) | 72px | **144px** |
| **Texto minimo** | 36px | **72px** |
| **Ancho del artefacto** | 600-760px | **1200-1520px** |
| **Centro optico** (cover ancho) | y ≈ 360 (45%) | **y ≈ 720** |
| **Centro optico** (cover alto) | y ≈ 720 (45%) | **y ≈ 1440** |

> ⚠️ **El margen vertical dejo de ser obligatorio.** Lo fue mientras la grilla
> alineaba por filas con una altura fija, que recortaba arriba y abajo. Con
> masonry cada card tiene el aspect exacto de su imagen y no se recorta nada,
> asi que los 64px son aire de composicion y no zona de rescate.

> Los dos `72` de esta tabla son **cosas distintas** y estan en columnas distintas:
> 72px es el margen del case study en el frame chico, y 72px es el texto minimo en
> el archivo grande. No es el mismo numero dos veces.

| | Valor (frame 1200) | Por que |
|---|---|---|
| **Margen lateral** | 96px cada lado | En mobile la card pasa a 4:3 y recorta ~11% del ancho, centrado. Nada esencial afuera de ahi. |
| **Area util** | `1008 × 800` | Lo que sobrevive en cualquier pantalla. |
| **Ancho del artefacto** | 60-75% del area util (~600-760px) | Menos se ve perdido en el fondo; mas y toca los bordes y pierde el aire que hace que "flote". |
| **Centro optico** | ~45% de la altura, **no 50%** | Los ultimos 200px llevan el gradiente y el titulo. Centrado geometrico se ve caido. |
| **Sombra** | Direccional hacia abajo, muy difusa, 15-25% de opacidad | Es lo que separa el artefacto del plano. La drop shadow default de Figma es demasiado dura y corta: subile el blur y bajale la opacidad. |

⚠️ **Arriba y abajo no se recorta nunca.** El recorte es solo lateral, asi que podes usar todo el alto — pero respetando que el tercio inferior comparte espacio con el titulo.

## El lenguaje visual comun

Los 4 covers del home se ven juntos, uno al lado del otro. Para que la grilla se
lea como un sistema y no como un collage, **los 7 comparten la misma receta**:

> **El producto en un entorno real, con luz dura y direccional.**
> Un dispositivo con el sitio en pantalla, apoyado sobre una superficie con
> textura (hormigon, yeso, metal), y una sombra diagonal marcada.

Tres cosas hacen que la serie se lea como una sola mano:

1. **El entorno es acromatico.** Gris, sin color propio. Esto es lo que mas
   importa y es facil de pasar por alto: en la referencia el entorno nunca tiene
   color, **el unico color de la imagen sale de la pantalla del dispositivo**. Por
   eso siete proyectos con paletas distintas siguen pareciendo una misma serie.
2. **La luz es dura y direccional.** La sombra diagonal no es decoracion: es lo
   que genera el rango tonal que el hover necesita (regla 2). Luz difusa = imagen
   plana = hover invisible.
3. **El dispositivo ocupa el centro optico**, con aire alrededor.

> ⚠️ **Esta seccion decia antes "un artefacto flotando sobre un fondo plano, sin
> mockups de laptop, sin escritorios", y el color del fondo tenia que salir de la
> marca del proyecto.** Se reescribio cuando el cover de Pulso —laptop sobre
> hormigon con sombra dura— resulto ser claramente mejor que la receta anterior y
> ademas coincidir con la referencia. El color de marca ya no vive en el fondo:
> vive en la pantalla.

## Direccion por proyecto

⭐ = va en el home.

- [x] ⭐ **Pulso Creativo** · `pulso-creativo-cover.jpg` · ANCHA `1200×900`
      ✅ **HECHO — y es la referencia de la serie.** Laptop con la home en
      pantalla, sobre hormigon, con sombra diagonal dura. Rango tonal 207.
      Los otros seis se hacen contra este.
      > Pendiente menor: esta exportado a 1× (`1200×900`). Deberia ser 2×
      > (`2400×1800`). Se ve bien igual, pero conviene re-exportarlo.

- [x] ⭐ **Paseo Güemes Hotel** · `paseo-guemes-hotel-cover.jpg` · ✅ HECHO
      Celular adelante con la laptop detras desenfocada — el caso es mobile-first,
      asi que el protagonista es el telefono.
      El mas fotografico de los cuatro. La pantalla mobile del sitio sobre una toma
      del hotel o del Monumento a Güemes, o directamente la foto con la pantalla
      superpuesta. Aca el fondo puede ser una foto en vez de un plano — es el unico
      de los cuatro donde conviene, justamente para que no queden los cuatro iguales.

- [x] ⭐ **FutbolTalent.Pro** · `futbol-talent-pro-cover.jpg` · ✅ HECHO
      Celular en diagonal sobre hormigon con la sombra de una red de arco, y el
      logo sobre azul de marca. Cero texto chico, asi que cero riesgo de regla 0.
      **La excepcion del NDA.** No puede mostrar pantallas finales del producto
      (`CLAUDE.md` §4). Pero si puede mostrar **el producto de tu trabajo**: el mapa
      de arquitectura de informacion, o el design system, tratados como artefacto —
      un tablero de Figma o una pantalla con la IA, dentro de un dispositivo y en
      el mismo entorno de hormigon con luz dura que los otros. Se lee como producto
      sin serlo.
      > Permitido: wireframes de baja/media, flujos, design system, user personas.
      > Prohibido: pantallas finales del producto.

- [x] ⭐ **El Ritual del Tono** · `el-ritual-del-tono-cover.jpg` · ✅ HECHO
      Laptop con un Fender y un pedal al lado, y la sombra de un mastil en la
      pared. El entorno cuenta el tema sin mostrar el tema.
      El mas fotogenico de los siete. Un objeto con caracter (pedal, cabezal, cable)
      con sombra dura, o el objeto y la pantalla del sitio conviviendo. Aprovechalo:
      es el unico proyecto donde el cover puede ser puro producto fisico.

- [ ] **Multibrand Design System** · `multibrand-design-system-cover.png`
      Composicion de tokens: bandas de color, formas modulares repetidas, la misma
      pieza resuelta en dos marcas distintas. Muy grafico, muy plano — este va en PNG.

- [ ] **Recuérdalo** · `recuerdalo-cover.jpg`
      Calidez humana y contraste alto. La pantalla de la app con las 4 categorias,
      sobre un fondo calido de la paleta Gotya. **Evita el cliche** del adulto mayor
      mirando un telefono.

- [ ] **Cabify Music Match** · `cabify-music-match-cover.jpg`
      Prototipo iPhone 14 sobre el violeta de Cabify. Es el mas cerca del patron de
      la referencia: dos o tres pantallas superpuestas sobre un plano saturado.

---

# IMAGENES DE CASE STUDY

## Reglas duras

- **Margen de seguridad: 72px en los cuatro lados** (el parallax de desktop se come ~3,5% de cada borde).
- **Texto minimo 36px** medido en el frame de 1200×800.
  > **La regla que manda**: en mobile la imagen se muestra **completa y sin recortar,
  > a ~330px de ancho**. Tu frame de 1200 se ve al **27%**. Cualquier texto por debajo
  > de 36px es ilegible en celular.
- **Una sola idea por imagen.** Si tenes que entrecerrar los ojos, esta mal.

## Cover vs `01-hero` — no repitas la imagen

Ahora que el cover muestra producto, el cover y `01-hero` se pueden pisar. La division:

| | |
|---|---|
| **Cover** | El poster. Compuesto, sobre fondo plano, pensado para verse chico y a distancia. |
| **`01-hero`** | La cosa en si, sin composicion de poster. Otro encuadre, otro momento. |

Si al mirarlos juntos parecen la misma imagen, rehace uno de los dos.

## Como tratar cada tipo

| Tipo | Tratamiento |
|---|---|
| **Screenshot de producto** | No pongas la pantalla entera. Recorta la seccion que importa y agrandala hasta que el texto pase los 36px. |
| **Wireframes** | Maximo 2-3 pantallas por imagen, no una grilla de 8. Etiqueta con texto tuyo grande, no con el texto interno del wireframe. |
| **Diagrama** | Donde mas brillas y lo mas facil de que quede bien: pocos elementos, mucho aire, tipografia grande. |
| **Comparacion A/B** | Lado a lado con divisoria clara. Etiquetas de 48px+. |
| **Flujo / secuencia** | Maximo 3 pasos por imagen. Si son mas, partilo en dos slots. |

## Las 28, una por una

El texto de cada una sale del `alt` que ya esta escrito en `src/data/projects.ts`.
La etiqueta en **negrita** dice que receta de la tabla de arriba aplica.

> **8 de las 28 son diagramas** — el tipo donde mas brillas y el mas facil de que
> quede bien. Si vas a arrancar por algo, arranca por esos.

### ⭐ Pulso Creativo
- [ ] **`01-hero`** · *Screenshot* — Home del sitio institucional en desktop
- [ ] **`02-challenge`** · *Screenshot (detalle)* — Carrusel de marcas con comportamiento táctil
- [ ] **`03-decisions`** · *Screenshot (detalle)* — Casos de éxito en formato de viñetas con íconos
- [ ] **`04-delivered`** · *Flujo* — Sistema de contacto dual: formulario y WhatsApp ruteado por servicio

### ⭐ Paseo Güemes Hotel
- [ ] **`01-hero`** · *Screenshot* — Hero del sitio con video del Monumento a Güemes y el CTA de reserva
- [ ] **`02-challenge`** · *Wireframes* — Wireframes de desktop y mobile en Figma
- [ ] **`03-decisions`** · *Diagrama* — Sistema visual aplicado: paleta, tipografías y versiones del logo
- [ ] **`04-delivered`** · *Flujo* — Sitio en mobile: habitaciones, reserva directa y WhatsApp flotante

### ⭐ FutbolTalent.Pro

> ⚠️ **NDA — las cuatro van en version "Marca Blanca".** Permitido: wireframes de
> baja/media, flujos, design system, user personas. **Prohibido: pantallas finales
> del producto.**
>
> Notar que las cuatro caen en tipos permitidos por el NDA. No es casualidad: son
> justo los tipos que muestran criterio de diseno en vez de producto terminado.

- [ ] **`01-hero`** · *Diagrama* — ⚠️ El `alt` actual dice "Pantalla de plataforma móvil": se escribio cuando habia screenshots reales y **hoy contradice `CLAUDE.md` §4**. Hay que **reencuadrar la imagen** (arquitectura de informacion, o un wireframe de media fidelidad) **y actualizar el `alt` en los dos idiomas** en `projects.ts`.
- [ ] **`02-challenge`** · *Wireframes* — Wireframes de baja fidelidad
- [ ] **`03-decisions`** · *Diagrama* — Sistema de componentes UI
- [ ] **`04-delivered`** · *Flujo* — Flujos de usuario y documentación de handoff

### ⭐ El Ritual del Tono
- [ ] **`01-hero`** · *Screenshot* — Página principal mostrando un artista y su cadena de señal
- [ ] **`02-challenge`** · *Diagrama* — Esquema de las 3 colecciones MongoDB: Artists con Songs como subdocumentos, Gears reutilizables y Orders
- [ ] **`03-decisions`** · *Screenshot (detalle)* — Página de canción mostrando la cadena de señal: guitarra, pedales y amplificador en orden
- [ ] **`04-delivered`** · *Flujo* — Carrito y checkout simulado mostrando el setup completo de un tono

### Multibrand Design System
- [ ] **`01-hero`** · *Diagrama* — Tablero Figma del Design System con paleta, componentes y tipografía
- [ ] **`02-challenge`** · *Diagrama* — Diagrama 70/30: core invariante vs tokens personalizables
- [ ] **`03-decisions`** · *Comparación A/B* — Misma UI aplicada con dos marcas distintas: una formal/académica y una dinámica/innovadora
- [ ] **`04-delivered`** · *Screenshot (detalle)* — Documentación en Notion: guías, checklist de accesibilidad y proceso de creación de submarcas

### Recuérdalo
- [ ] **`01-hero`** · *Screenshot* — Pantalla principal con las 4 categorías emergentes del card sorting
- [ ] **`02-challenge`** · *Diagrama* — Card sorting documentado: 15 tarjetas agrupadas por usuarios mayores en 4 categorías emocionales
- [ ] **`03-decisions`** · *Flujo* — Secuencia de pasos reversibles: indicador numérico, botón Volver grande y confirmación visual inmediata
- [ ] **`04-delivered`** · *Comparación A/B* — Comparación de accesibilidad: UI estándar versus Recuérdalo con tipografía y touch targets aumentados

### Cabify Music Match
- [ ] **`01-hero`** · *Screenshot* — Prototipo iPhone 14 con la pantalla principal de Music Match y la playlist fusionada
- [ ] **`02-challenge`** · *Diagrama* — Diagrama del algoritmo de fusión: dos perfiles Spotify con géneros y artistas convergen en una playlist compartida
- [ ] **`03-decisions`** · *Flujo* — User flow del onboarding skippable de Spotify, en 3 pantallas mobile
- [ ] **`04-delivered`** · *Flujo* — Tres estados clave: fusión, playlist por mood y modo silencio
