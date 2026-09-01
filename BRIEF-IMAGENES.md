# Brief de imagenes — Gotya

> **Documento temporal.** Es la hoja de ruta para rehacer las 35 imagenes del portfolio.
> Cuando esten todas subidas, este archivo se borra. Las reglas permanentes viven en `CLAUDE.md` §2.

**Estado**: hoy el sitio no tiene ninguna imagen. Las provisorias se dieron de baja porque se leian como generadas con IA, y en un portfolio de UX/UI eso contradice el argumento del portfolio mas de lo que un hueco lo debilita.

---

## Formatos

| | Frame en Figma | Exportar | Archivo final |
|---|---|---|---|
| **Cover** | `960 x 600` | @2x | `1920 x 1200` |
| **Case study** | `1200 x 800` (3:2) | @2x | `2400 x 1600` |

**Ambas**: exportar **PNG o JPG calidad 90+**, sin presupuesto de KB.

> ⚠️ **Esto cambio con la migracion a `next/image` (D3).** Antes decia "WebP
> calidad 80, maximo 250 KB por archivo", porque se usaba un `<img>` pelado sin
> `srcset` y el celular bajaba el mismo archivo que el desktop.
>
> Ahora **Next genera los tamanos solo**: de cada archivo saca 8 variantes
> (640, 750, 828, 1080, 1200, 1920, 2048 y 3840 px de ancho), las convierte a
> WebP y le sirve a cada dispositivo la que le corresponde. Un celular de 375px
> baja la de 750w, no la de 1920.
>
> Por eso conviene exportar **una sola vez, grande y con poca compresion**: el
> archivo del repo es el master del que Next recorta, no lo que ve el visitante.
> Comprimirlo a mano ya no ahorra nada al usuario y encima suma perdida de
> calidad (el archivo se re-comprime igual). Como referencia sana, que ninguno
> pase de ~1 MB para no inflar el repo.

---

## Naming

```
public/images/covers/{slug}-cover.webp

public/images/case-study/{slug}/01-hero.webp
                              /02-challenge.webp
                              /03-decisions.webp
                              /04-delivered.webp
```

El numero mapea a la seccion donde cae la imagen:

| Archivo | Seccion |
|---|---|
| `01-hero` | Intro (el hook) |
| `02-challenge` | El desafio |
| `03-decisions` | Como lo resolvi |
| `04-delivered` | Lo entregado |

Slugs exactos (sin acentos):

```
pulso-creativo
paseo-guemes-hotel
futbol-talent-pro
el-ritual-del-tono
multibrand-design-system
recuerdalo
cabify-music-match
```

---

## COVERS — leer esto antes de abrir Figma

El cover **no se ve como lo disenas**. Se renderea asi:

```
idle    opacity 50%  + escala de grises
hover   opacity 80%  + color
+ gradiente encima: 30% arriba  ->  92% abajo
```

Dos consecuencias que mandan sobre todo lo demas:

1. **La mitad inferior queda tapada** por el gradiente (ahi va el titulo). El interes visual va **arriba**.
2. **Un screenshot se pierde.** Al 50% de opacidad y en gris no sobrevive ningun detalle fino. Lo que atraviesa es **forma y contraste**, no informacion.

> Por eso los covers son imagenes **atmosfericas o graficas**, nunca capturas de producto.

**Reglas duras**: zona segura `580 x 360` centrada (todo lo de afuera se recorta en alguna pantalla) · **sin texto** (la card ya superpone tag, ano y titulo) · **debe funcionar en escala de grises**.

### Direccion por proyecto

- [ ] **Pulso Creativo** · 2026 · card ANCHA (2 columnas)
      `pulso-creativo-cover.webp`
      Textura corporativa sobria: trama tipografica gigante, papel, o una composicion geometrica en la paleta de marca. **Nada de screenshots del sitio.** Es la card mas ancha del grid, aguanta una composicion amplia.

- [ ] **Paseo Güemes Hotel** · 2026 · card normal (1 columna)
      `paseo-guemes-hotel-cover.webp`
      Atmosfera de hotel: toma arquitectonica con contraste fuerte, o el Monumento a Guemes en silueta. Funciona en gris de forma natural.

- [ ] **FutbolTalentPro** · 2025 · card normal (1 columna)
      `futbol-talent-pro-cover.webp`
      **Abstracto obligatorio.** La seccion 4 de CLAUDE.md prohibe pantallas del producto, y eso incluye el cover. Trama de cancha, lineas de campo, o una grilla de datos abstracta.
      > NDA: nada de UI real del producto.

- [ ] **El Ritual del Tono** · 2025 · card ANCHA (2 columnas)
      `el-ritual-del-tono-cover.webp`
      Un objeto con caracter: pedal, cabezal, cable. Foto de producto con sombra dura. Es el proyecto mas fotogenico de los siete y es card ancha: aprovechalo.

- [ ] **Multibrand Design System** · 2025 · card normal (1 columna)
      `multibrand-design-system-cover.webp`
      Composicion de tokens: bandas de color, formas modulares repetidas. Muy grafico, muy plano. Alto contraste para que sobreviva al gris.

- [ ] **Recuérdalo** · 2025 · card normal (1 columna)
      `recuerdalo-cover.webp`
      Calidez humana y contraste alto: manos, textura, formas grandes. **Evita el cliche** del adulto mayor mirando un telefono.

- [ ] **Cabify Music Match** · 2023 · card normal (1 columna)
      `cabify-music-match-cover.webp`
      Dos ondas o dos trazos que convergen. Metafora de fusion, sin literalidad de app.

---

## IMAGENES DE CASE STUDY

**Formato**: frame `1200 x 800` -> @2x · margen de **72px** en los cuatro lados · **texto minimo 36px**.

> **La regla que manda**: en mobile la imagen se muestra **completa y sin recortar, a ~330px de ancho**. Tu frame de 1200 se ve al **27%**. Cualquier texto por debajo de 36px es ilegible.

> Cada imagen comunica **una sola idea**. Si tenes que entrecerrar los ojos, esta mal.

### Como tratar cada tipo

| Tipo | Tratamiento |
|---|---|
| **Screenshot de producto** | No pongas la pantalla entera. Recorta la seccion que importa y agrandala hasta que el texto pase los 36px. |
| **Wireframes** | Maximo 2-3 pantallas por imagen, no una grilla de 8. Etiqueta con texto tuyo grande, no con el texto interno del wireframe. |
| **Diagrama** | Donde mas brillas y lo mas facil de que quede bien: pocos elementos, mucho aire, tipografia grande. |
| **Comparacion A/B** | Lado a lado con divisoria clara. Etiquetas de 48px+. |
| **Flujo / secuencia** | Maximo 3 pasos por imagen. Si son mas, partilo en dos slots. |

### Lista completa

El texto de cada una sale del `alt` que ya esta escrito en `src/data/projects.ts`.

#### Pulso Creativo · 2026
`public/images/case-study/pulso-creativo/`

- [ ] **`01-hero.webp`** — _Intro (el hook)_
      Home del sitio institucional en desktop
- [ ] **`02-challenge.webp`** — _El desafio_
      Carrusel de marcas con comportamiento táctil
- [ ] **`03-decisions.webp`** — _Como lo resolvi_
      Casos de éxito en formato de viñetas con íconos
- [ ] **`04-delivered.webp`** — _Lo entregado_
      Sistema de contacto dual: formulario y WhatsApp ruteado por servicio

#### Paseo Güemes Hotel · 2026
`public/images/case-study/paseo-guemes-hotel/`

- [ ] **`01-hero.webp`** — _Intro (el hook)_
      Hero del sitio con video del Monumento a Güemes y el CTA de reserva
- [ ] **`02-challenge.webp`** — _El desafio_
      Wireframes de desktop y mobile en Figma
- [ ] **`03-decisions.webp`** — _Como lo resolvi_
      Sistema visual aplicado: paleta, tipografías y versiones del logo
- [ ] **`04-delivered.webp`** — _Lo entregado_
      Sitio en mobile: habitaciones, reserva directa y WhatsApp flotante

#### FutbolTalentPro · 2025
`public/images/case-study/futbol-talent-pro/`

> ⚠️ **NDA — las cuatro van en version "Marca Blanca".** Permitido: wireframes de baja/media, flujos, design system, user personas. **Prohibido: pantallas finales del producto.**
>
> ⚠️ Ojo con el `alt` de `01-hero`: dice "Pantalla de plataforma movil", que se escribio cuando habia screenshots reales y **hoy contradice la seccion 4**. Al rehacer esa imagen hay que **reencuadrarla** (por ejemplo: arquitectura de informacion, o un wireframe de media fidelidad) **y actualizar el `alt` en los dos idiomas** en `projects.ts`.

- [ ] **`01-hero.webp`** — _Intro (el hook)_
      ~~Pantalla de plataforma móvil~~ → **reencuadrar, ver aviso de arriba**
- [ ] **`02-challenge.webp`** — _El desafio_
      Wireframes de baja fidelidad
- [ ] **`03-decisions.webp`** — _Como lo resolvi_
      Sistema de componentes UI
- [ ] **`04-delivered.webp`** — _Lo entregado_
      Flujos de usuario y documentación de handoff

#### El Ritual del Tono · 2025
`public/images/case-study/el-ritual-del-tono/`

- [ ] **`01-hero.webp`** — _Intro (el hook)_
      Hero shot — página principal de El Ritual del Tono mostrando un artista y su cadena de señal
- [ ] **`02-challenge.webp`** — _El desafio_
      Esquema de las 3 colecciones MongoDB del proyecto: Artists con Songs como subdocumentos, Gears reutilizables y Orders
- [ ] **`03-decisions.webp`** — _Como lo resolvi_
      Página de canción mostrando la cadena de señal: guitarra, pedales y amplificador en orden
- [ ] **`04-delivered.webp`** — _Lo entregado_
      Carrito y checkout simulado mostrando el setup completo de un tono

#### Multibrand Design System · 2025
`public/images/case-study/multibrand-design-system/`

- [ ] **`01-hero.webp`** — _Intro (el hook)_
      Hero shot — tablero Figma del Design System con paleta, componentes y tipografía
- [ ] **`02-challenge.webp`** — _El desafio_
      Diagrama 70/30 mostrando el core invariante vs los tokens personalizables
- [ ] **`03-decisions.webp`** — _Como lo resolvi_
      Misma UI aplicada con dos marcas distintas: una formal/académica y una dinámica/innovadora
- [ ] **`04-delivered.webp`** — _Lo entregado_
      Documentación del design system en Notion: guías, checklist de accesibilidad y proceso de creación de submarcas

#### Recuérdalo · 2025
`public/images/case-study/recuerdalo/`

- [ ] **`01-hero.webp`** — _Intro (el hook)_
      Hero shot — pantalla principal de Recuérdalo con las 4 categorías emergentes del card sorting
- [ ] **`02-challenge.webp`** — _El desafio_
      Card sorting documentado: 15 tarjetas de funcionalidades agrupadas por usuarios mayores en 4 categorías emocionales
- [ ] **`03-decisions.webp`** — _Como lo resolvi_
      Secuencia de pasos reversibles: indicador numérico, botón Volver grande y confirmación visual inmediata
- [ ] **`04-delivered.webp`** — _Lo entregado_
      Comparación de accesibilidad: UI estándar versus Recuérdalo con tipografía y touch targets aumentados

#### Cabify Music Match · 2023
`public/images/case-study/cabify-music-match/`

- [ ] **`01-hero.webp`** — _Intro (el hook)_
      Hero shot — prototipo iPhone 14 mostrando la pantalla principal de Music Match con la playlist fusionada
- [ ] **`02-challenge.webp`** — _El desafio_
      Diagrama del algoritmo de fusión: dos perfiles Spotify con géneros y artistas convergen en una playlist compartida
- [ ] **`03-decisions.webp`** — _Como lo resolvi_
      User flow del onboarding skippable de Spotify, en 3 pantallas mobile
- [ ] **`04-delivered.webp`** — _Lo entregado_
      Tres estados clave de Music Match: fusión, playlist por mood y modo silencio

---

## Como poner cada imagen en el sitio

No hay que tocar ningun componente. Por cada imagen terminada:

**Cover** — subir el archivo y en `src/data/projects.ts` cambiar:

```ts
coverImage: null,
//  ->
coverImage: '/images/covers/pulso-creativo-cover.webp',
```

**Case study** — subir el archivo y agregar el `src` al brief correspondiente:

```ts
{
  alt: { es: '...', en: '...' },
  src: '/images/case-study/pulso-creativo/02-challenge.webp',   // <- agregar
},
```

La imagen aparece sola: `ProjectCard` envuelve el cover en `{project.coverImage && ...}` y la page rendea cada `CaseStudyImage` solo si el brief tiene `src`.

---

## Progreso

- [ ] Covers — 0 / 7
- [ ] Case study — 0 / 28

**Total: 35 imagenes.**

Cuando este todo en verde, borrar este archivo.