@AGENTS.md
# Portfolio Tiago Collado — marca **Gotya**

> **Cómo usar este archivo**: las reglas de diseño, la ley UX y el NDA
> son obligatorias. El resto es contexto del proyecto. Lo que falta hacer
> está en la sección "Qué falta hacer". El historial vive en `git log`.
> Las trampas del stack y los tokens de diseño están importados al final.

---

## 2. 🎨 Reglas de diseño

### Imágenes

📋 **Todas las reglas de imagen viven en `.claude/rules/imagenes.md`**, que se
importa al final de este archivo: vocabulario de tipos, medidas de cada frame,
dirección de arte de los covers, la regla de comprensión a 330px, exportación y
naming.

Estaban partidas entre esta sección y un `BRIEF-IMAGENES.md` que se dio de baja
(tenía una idea escrita para cada una de las 35 y ninguna servía; si hace falta
ver qué decía: `git show 045fd0e:BRIEF-IMAGENES.md`). Con el vocabulario de
tipos ya son un sistema, así que se consolidaron en un solo lugar. **No
dupliques medidas ni reglas de arte acá.**

Lo único que se queda en este archivo, porque es estructura y no arte:

| | |
|---|---|
| Forma de la card del home | `cardShape` en `src/data/projects.ts` (`wide` 4:3 · `square` 1:1). La grilla es masonry, así que la card tiene el aspect exacto de su imagen y no recorta nada |
| Qué imágenes tiene un case study | `imageBriefs` en `src/data/projects.ts`. **Sin cantidad fija**: cada brief declara su `type` (qué es) y su `slot` (dónde cae) |
| Traducción de `type` a layout | `src/components/case-study/imageSpec.ts` |


## 4. 🔒 Confidencialidad y NDA — FutbolTalent

**REGLA ESTRICTA. Leer antes de tocar texto, imagen o metadata de `futbol-talent-pro`.**

- **Vocabulario prohibido**: *freemium, premium, monetización, inversores, fundadores, Flutter*. Aplica a `case_study_futbol-talent-pro` en ambos JSON y al entry en `projects.ts` (tagline, description, metadata, alts).
- **Nunca revelar** flujos de negocio, estrategias de retención ni métricas internas — incluidos números que impliquen escala del producto.
- **Framing obligatorio**: siempre **MVP validado técnicamente**, con eje en **arquitectura de información** y **reducción de carga cognitiva**.
- **NO ocultar** `metadata.client` (`FutbolTalent.Pro`), el `title` ni el `slug`: el vínculo laboral ya es público y el NDA no lo restringe.
- **Material permitido**: wireframes de baja/media, flujos, design system, user personas. **Nunca** pantallas finales del producto.

> ⚠️ Los `alt` de los `imageBriefs` también cuentan: son el brief con el que se diseña la imagen. El de `01` decía *"Pantalla de plataforma móvil"* — o sea, pedía justo el material prohibido — y se cambió por *"Arquitectura de información de la plataforma"*. **Al escribir un brief nuevo para FTP, revisar que el alt no prometa producto real.**

> ✅ **Pendiente legal — resuelto.** Las imágenes de FutbolTalent mostraban UI real del producto y siguieron publicadas un tiempo después de la purga textual. Se borraron del repo junto con el resto de las provisorias, así que ya no están ni en la página ni accesibles por URL directa en el deploy. **Cuando subas las versiones "Marca Blanca", valen las mismas reglas de esta sección**: wireframes, flujos, design system y personas sí; pantallas finales del producto no.

**Tono general del copy**: directo, sin narrativas forzadas de Silicon Valley. La confidencialidad se menciona solo dentro del case study de FTP, nunca en el About.

---

## 5. Sobre Tiago y la marca

**Tiago Collado** · Estudiante avanzado de Lic. en Tecnología Multimedial (Universidad Maimónides) · perfil híbrido UX/UI Designer + Frontend Developer, más fuerte en diseño que en programación.
**Target**: reclutadores de equipos de producto, de pymes a corporaciones, donde se valore diseño y ejecución técnica.
**Contacto**: tiago.collado@gmail.com · [LinkedIn](https://www.linkedin.com/in/tiagocollado/) · [GitHub](https://github.com/tiagocollado)

### Marca: Gotya by Tiago Collado
- Wordmark **GOTYA** en mayúscula (Hero gigante + navbar). "by Tiago Collado" solo en footer, firma del About y metadata.
- Lema — ES: *"Diseñar experiencias con empatía. / Crearlas con precisión."* · EN: *"Designing experiences with empathy. / Building them with precision."*
- **Voz: primera persona en todo el sitio.** Gotya es el nombre comercial, no un "nosotros". Sin excepciones: el label `NUESTROS CLIENTES` de la grilla pasó a `PROYECTOS` / `PROJECTS` (mismo nombre que el nav y que el ancla `#projects`).

### ⚠️ Nivel técnico
Tiago sigue estudiando y la programación no es su fuerte. **El código tiene que ser lo más entendible posible**: claridad sobre abstracciones avanzadas, y siempre explicar el *por qué* de las decisiones técnicas.

### Identidad visual
- **Accent**: terracota `#C96A3A` (hover `#B05A2E`)
- **Light**: bg `#EDE2CD` · surface `#F4EAD5` · ink `#111110`
- **Dark**: bg `#111110` · ink `#F0EDE8` — **es el tema por defecto**
- **Símbolo**: la "G" de Gotya en `src/app/icon.svg` — **vector real exportado de Illustrator**, un único path relleno. Chaflán hexagonal a la izquierda, esquina superior derecha redondeada y una diagonal que sube apuntando al codo de la transversal: esa es la flecha. Su `viewBox` está recortado respecto del artboard original (§6). Reemplazó a la G de trazo circular.
- **Radius** 12px cards / 999px pills · **Easing** `cubic-bezier(0.16, 1, 0.3, 1)`
- **Tipografía**: Space Grotesk (display) + Geist (body) + Geist Mono (labels) → *pendiente de reemplazo, ver F3*
- Concepto: "minimalismo técnico pero cálido".

---

## 6. Estado actual — qué existe hoy

**Deploy**: https://tiagocollado.vercel.app/ · cada push a `main` redeploya. Build de referencia: **15 páginas SSG** (eran 21 con los 7 case studies; los 3 no publicados ya no se buildean, §8), TS limpio, sin warnings.

**Defaults**: tema **dark**, locale **`en`** (`/` redirige a `/en`; las URLs `/es/...` siguen vivas).

**Capa "frontend creativo"**: Lenis smooth scroll (con reset de scroll en cambio de ruta) · custom cursor dot+ring con variants `default | link | view | drag` · SplitText char reveal · magnetic hover + `<MagneticLink>` · grain SVG global · scrollbar custom terracota · `<MotionConfig reducedMotion="user">` global.

**Home**: Navbar `h-16` fijo (NavLogo izq · links centrados · LanguageToggle + tema der · hamburger en `<lg`) · Hero con NameLogo GOTYA sticky que achica con el scroll y hace handoff al navbar, lema en dos líneas, CTA magnético con chevrons e `InteractiveDotGrid` · ServicesMarquee con fondo invertido · grilla masonry de proyectos (2 columnas, 4 cards, covers a sangre sin texto) · About 4.0 (micro-labels, claim con bold, copy a la derecha, firma) · Stack con carrusel infinito · **bloque de cierre unificado** (ver abajo).

**Bloque de cierre** (Contact + Footer): se leen como una sola pieza. Contact no cierra su padding inferior y el Footer arranca pegado, sin `border-t` entre medio. Contact lleva el micro-label, una **pregunta corta sin párrafo de body** (quien llega acá ya hizo click en "Hablemos": viene con intención, no hay que volver a venderle), el mail en **mono grande** con botón de copiar al portapapeles, y los 4 canales (LinkedIn / GitHub / WhatsApp / CV). El Footer es una única barra de tres zonas: copyright · back-to-top · crédito. **En mobile (`<sm`) esa barra pasa a 2 columnas**: copyright y crédito apilados a la izquierda, back-to-top a la derecha abarcando las dos filas (`row-span-2`) y centrado contra ellas — la mitad derecha es la zona de menor costo motor para el pulgar (Fitts). Las posiciones van explícitas (`col-start`/`row-start`) y se resetean con `sm:*-auto`, porque el orden del DOM es copyright → botón → crédito y el auto-placement pondría el crédito en el lugar equivocado.

> El bloque va dentro de un `<div className="min-h-screen flex flex-col justify-between">` en `page.tsx`: al entrar por el ancla `#contact` ocupa exactamente una pantalla, con la barra del footer pegada abajo. Es un `div` y no un `section`/`main` a propósito — esos scopearían al `<footer>` y le sacarían el landmark.

> ⚠️ **Ese razonamiento estaba anulado un nivel más arriba**: `layout.tsx` envuelve todo en `<main className="pt-16">`, y un `<footer>` descendiente de `<main>` pierde el rol `contentinfo` por spec — cuidar el wrapper del home no alcanzaba. **Se resuelve con `role="contentinfo"` explícito en el `<footer>`**, que le gana al mapeo implícito. Ese atributo **no es redundante: si se saca, el landmark desaparece** y no lo avisa ni el build ni el linter.

**Cards de proyecto**: en reposo son SOLO la imagen del cover, a sangre y sin una
palabra encima. En hover el lavado terracota **barre de izquierda a derecha**
(`scale-x` con `origin-left`, no un fade) y después entran nombre, "VER PROYECTO",
categoría y las escuadras de las 4 esquinas.

> ⚠️ **En táctil no hay hover, así que no hay lavado**: el nombre y la categoría
> van DEBAJO de la card como texto normal. Se decide por `(hover: none)` y no por
> ancho de pantalla, porque una tablet en horizontal es ancha y tampoco tiene hover.
> Antes el overlay quedaba fijo en mobile y se veía como si la card estuviera
> siempre en hover, con el lavado tapando el cover.

**El `<Footer />` cierra el home Y los cuatro case studies publicados.** Antes era solo del home (la card de "próximo proyecto" oficiaba de cierre), pero al pie de un case study largo faltaba el camino de vuelta arriba. El cierre del case study es entonces `CaseStudyNextNav` + `Footer`.

> ⚠️ **`id="top"` es requisito, no detalle.** El back-to-top es un `<a href="#top">`; toda página que renderee el `<Footer />` necesita ese id o el botón queda **muerto sin dar ningún error** — el build pasa, no hay warning, simplemente no scrollea. Hoy vive en el `<section>` del Hero (home) y en el `<div>` raíz del case study.

**Cierre del case study**: el "Próximo proyecto" **cicla solo entre los publicados**, en el orden del home (`order`), y el último vuelve al primero: hoy Paseo → Pulso → FutbolTalent → Ritual → Paseo. Sale de `publishedProjects`, la misma lista que la grilla, así que no pueden divergir. El pill "Ver todos los proyectos" lleva a `/{locale}#projects`, la grilla del home, hasta que exista la página de V2. Los dos paths van en **una sola fila** desde `md+` — pill ghost "Ver todos los proyectos" en columna `auto` a la izquierda, card "Próximo proyecto" en `1fr` a la derecha. La card es el CTA primario inequívoco (tamaño, fondo, thumbnail, glow en hover); la pill no compite (Hick). La card va **primero en el DOM** y las columnas se cruzan con `md:order-*`: así el apilado en mobile sale correcto sin `order`, y el primario encabeza el orden de tabulación.

**Back-to-top**: `<a href="#top">` con el `id="top"` en el `<section>` del Hero. Lenis monta con `anchors: true`, así que lo intercepta y hace el scroll suave él. Nunca `window.scrollTo`: pelearía contra su animación. Las dos flechas apiladas suben en loop mientras hay hover.

**Case studies** (los 4 publicados; los otros 3 siguen en el repo con `published: false`, §7): **secuencia vertical de bloques hermanos**, cada uno declarando su propio ancho — barra de metadata (Cliente / Año / Rol / Duración / Equipo / Stack / NDA / Links; **en mobile va debajo del intro**, ver §8) + hero a sangre + 5 secciones editoriales — **Intro → El desafío → Cómo lo resolví → Lo entregado → Cierre** — con tiradas de imágenes entre medio. Componentes en `src/components/case-study/`.

> ⚠️ **Era una grilla de 12 columnas con sidebar sticky** (`col-span-3` + `col-span-9`), y eso tenía tres consecuencias que se arrastraron hasta que se midieron: la columna editorial quedaba clavada en **944px**, así que ninguna imagen podía ir a sangre; entre una laptop de 1440 y un monitor de 1920 la imagen crecía **24px** (el desktop no ofrecía nada que justificara la pantalla grande); y en mobile el sidebar caía full-width **arriba del hook de intro**, así que lo primero que leías de un proyecto era su duración.
>
> **El cap del `max-w-7xl` pesaba más que el sidebar**: en 1920px el sidebar se comía 336px y el cap 384px. Por eso sacar el sidebar no alcanzaba para ir a sangre — hacía falta que los bloques fueran hermanos y cada uno eligiera su ancho. Hoy el texto vive en un shell de 1280 y **solo `mockup` y `long-strip` salen del shell**.

**El ancho de una imagen lo decide su `type`, no el componente ni el `slot`.** `mockup` (el hero) y `long-strip` van a sangre (viewport completo, sin recorte, sin parallax, radio 0); el resto va al shell de 1280. La traducción de tipo a layout está en `src/components/case-study/imageSpec.ts` y el arte en `.claude/rules/imagenes.md`.

> ⚠️ **`sizes` sale del ancho real y hay que moverlo con él.** Estuvo hardcodeado en `944px` mientras existía el sidebar; con la barra arriba pasó a 1280 y el valor viejo quedaba mintiendo 336px. Sin `sizes` correcto, `next/image` no sirve de nada.

**Convención de contenido**: un case study real necesita `awwwardsLayout: true` + 12 keys de TEXTO en ambos JSON (`intro`, `challenge`, `decision_1-3_title/body`, `delivered_1-3`, `closing`). La key **`process`** es opcional (bajada de "Cómo lo resolví") y se carga con `t.has()`. Si falta una obligatoria, el catch deja `hasCaseStudy: false` y el cuerpo no se renderea.

> **`challenge` admite varios párrafos**, separados por una línea en blanco (`\n\n` en el JSON). La page lo parte y rendea un `<p>` por párrafo con `space-y-6`; sin línea en blanco sale un solo párrafo, como antes. Hace falta porque HTML colapsa los saltos de línea: un `\n\n` adentro de un único `<p>` se ve como un espacio. Hoy solo lo usa Ritual (problema de producto + problema técnico). **Las demás keys siguen siendo de un solo párrafo**: si otra lo necesita, se le agrega el mismo `split`.

**Imágenes de case study**: **no hay cantidad fija** — cada proyecto usa los tipos que necesita, pueden ser 2 o 6. Cada brief declara `type` (qué es: `mockup` · `long-strip` · `screen-cluster` · `palette` · `diagram` · `detail`) y `slot` (dónde cae: `hero` · `intro` · `challenge` · `decisions` · `delivered` · `end`). **Varias imágenes pueden compartir `slot`**: eso es lo que da los grupos de 2-3 seguidas sin texto entre medio.

En mobile se ven completas y quietas (sin crop ni parallax); el recorte y el parallax arrancan en `md+`, y `mockup` y `long-strip` no llevan ninguno de los dos en ningún breakpoint. No tienen hover ni cursor custom porque no abren nada — **por eso la regla de rango tonal ≥120 no les aplica**: existe para que se perciba el duotono del hover de las cards.

> ⚠️ **Eran 4 fijas, atadas a 4 secciones.** La page leía `imageBriefs[0]`…`[3]` en cuatro puntos hardcodeados, así que un quinto brief no se rendeaba en ningún lado y no lo avisaba nada. La cuota se decidió antes de saber qué necesitaba cada caso —con cuota fija terminás inventando qué poner— y nunca se escribió como decisión: se materializó como un array de 4 posiciones en TypeScript y de ahí se propagó al naming de archivos y al cálculo de "35 imágenes".

**Open Graph**: `src/app/[locale]/opengraph-image.tsx` genera un PNG 1200×630 en build time: **solo la marca G centrada** sobre el fondo oscuro, **sin texto**. Al vivir en el segmento `[locale]` aplica también a `/projects/[slug]`: compartir cualquier link muestra la marca, no una captura del proyecto.

> **Por qué sin texto.** La versión anterior tenía eyebrow + wordmark + lema alineados a la izquierda. WhatsApp (y varios clientes de chat) no muestran la card ancha: **recortan un cuadrado del centro**, que entraba por la mitad del wordmark y dejaba un "ya" con texto ilegible alrededor. Una marca centrada sobrevive cualquier recorte. De yapa, al no haber texto la imagen **ya no depende de la tipografía**, así que F3 dejó de arrastrarla y los TTF de `src/app/[locale]/fonts/` se borraron del repo.

> El SVG se lee de `src/app/icon.svg` — **el mismo archivo que el favicon**, no una copia. Cambiar el logotipo actualiza las dos cosas a la vez. Va como data URI en un `<img>` porque es lo que satori soporta de forma confiable.

> ⚠️ Las dos imágenes (`es` / `en`) ahora son **idénticas byte a byte, a propósito**: sin texto no hay nada que localizar.

> Medidas reales, verificadas decodificando el PNG: el `<img>` es de 460px pero la **tinta** mide 315×314 (el `icon.svg` tiene su propio encuadre interno), o sea **~50% del cuadro que recorta WhatsApp**, que es el objetivo. El centro de la tinta cae a 2px del centro del lienzo. **Si se toca el path de `icon.svg`, volver a medir**: el encuadre se ajusta con el `viewBox`, no moviendo coordenadas.

> ✅ El lema **ya no está duplicado**. Vivía hardcodeado en `opengraph-image.tsx` además de en `hero.headline` / `hero.subheadline`, y había que acordarse de tocarlo en los dos lados. Al sacarle el texto a la OG image, la única fuente de verdad volvieron a ser los JSON.

**i18n**: next-intl con paridad total ES/EN (17 namespaces). **Regla**: toda key nueva va en los dos archivos.

**Accesibilidad** (auditado sobre el HTML generado, no sobre el código):
- Un solo `<main>`, `<nav>`, `<header>` y `<footer>` por página · `lang` correcto por locale · **cero imágenes sin `alt`** · `aria-label` en todos los controles de solo ícono.

> **Conteos verificados sobre el HTML generado (2026-09-23)**: el home tiene 4 imágenes y 14 `aria-label`; un case study, entre 4 y 6 imágenes —según cuántas tenga el proyecto— y 7 `aria-label`. **El `alt` vacío de los covers y del thumbnail de "próximo proyecto" es deliberado**: son decorativos y el texto que los nombra ya está en el DOM, así que un alt descriptivo los haría anunciar dos veces. Los números viejos ("12 imágenes, 17 aria-label") eran de una sola pasada y se desactualizaron con cada tanda: **lo que hay que sostener es el cero sin `alt`, no la cifra.**
- **Nada suprime el focus ring del browser**, así que el foco de teclado se ve en todo. La única excepción es `<main>`, que lo suprime a propósito: recibe foco solo por script desde el skip link, y un contorno alrededor de toda la página se lee como un bug. **No agregar más excepciones.**
- El cursor custom **no** oculta el nativo (no hay ninguna regla `cursor: none`), así que no interfiere con el foco.
- **Skip link** (`SkipLink.tsx`): primer elemento focusable, invisible hasta recibir foco. Es un client component con `onClick` + `preventDefault` en vez de un `<a href="#main">` pelado, porque Lenis intercepta las anclas y puede comerse el movimiento de foco nativo — que acá es lo único que importa, ya que `<main>` arranca al tope y no hay nada que scrollear.
- **Jerarquía de headings**: el case study da `h1 → h2 → h3` sin saltos. Ojo: el label de `CaseStudySection` es un **`<h2>` que se ve como micro-label**. Era un `<p>`, y por eso el outline salía `h1 → h3` con el único `h2` siendo la card del pie. El tamaño chico es decisión visual, no jerárquica — **no lo devuelvas a `<p>`**.

---

## 7. Proyectos del portfolio

Orden = campo `order`. Si la página existe lo decide **`published`**; qué se muestra en el home, `showOnHome`; la forma de la card, `cardShape` (`wide` 4:3 · `square` 1:1). La grilla es masonry de dos columnas.

| # | Proyecto | Año | Publicado | Home | Forma | Qué es |
|---|---|---|---|---|---|---|
| 1 | **Paseo Güemes Hotel** | 2026 | ✅ | ✅ | ancha | Hotel 3★ en Salta. UX/UI + WordPress, reserva directa contra OTAs. |
| 2 | **Pulso Creativo** | 2026 | ✅ | ✅ | **cuadrada** | Consultora B2B 25+ años. Sitio institucional, contacto dual, rediseño UX del contenido. |
| 3 | **FutbolTalent.Pro** | 2025 | ✅ | ✅ | ancha | UX/UI de plataforma de scouting. **Bajo NDA — ver sección 4.** |
| 4 | **El Ritual del Tono** | 2025 | ✅ | ✅ | ancha | **Proyecto universitario** (Programación Multimedial III, Maimónides). Full-stack MERN con demo en vivo. |
| 5 | **Multibrand Design System** | 2025 | — V2 | — | ancha | Simulación laboral No Country, equipo de 6. |
| 6 | **Recuérdalo** | 2025 | — V2 (primero) | — | **cuadrada** | Proyecto universitario, UX inclusivo para adultos 70+. |
| 7 | **Cabify Music Match** | 2023 | — V2 | — | ancha | Concept UX/UI, prototipo iPhone 14. |

> **Los 5-7 no están publicados** (§8, *"Alcance de esta versión"*): su página da 404 y no aparecen en ningún lado del sitio, pero sus datos, copy e imágenes siguen en el repo. **Volver a publicar uno es cambiar `published` a `true`**, después de su tanda.

La grilla es **masonry**: `Projects.tsx` rendea dos columnas `flex-col`
independientes y reparte los proyectos **alternando** — el 1 y el 3 a la
izquierda, el 2 y el 4 a la derecha.

| Columna | Proyectos | Alto |
|---|---|---|
| izquierda | Paseo Güemes (ancha) · FutbolTalent.Pro (ancha) | 966px |
| derecha | Pulso Creativo (**cuadrada**) · El Ritual del Tono (ancha) | 1123px |

**Las columnas terminan a distinta altura a propósito.** Eso es lo que la hace
masonry. El primer intento usó `grid-auto-rows` + `row-span` y alineaba las filas:
se veía como una grilla, no como la referencia.

✅ **El orden de lectura en mobile está resuelto.** Alternar dejaba 1·3·2·4 al
apilarse, porque ese es el orden del DOM. Se arregla con `display: contents` en
las columnas abajo de `md`: los `<div>` desaparecen del layout, las 4 cards pasan
a ser hijas directas del grid y el `order` de cada una las ordena 1·2·3·4. En
desktop las columnas vuelven a `flex` y el `order` no molesta.

**Fuera del portfolio**: Retro Kicks, Govah, SoundCloud Redesign, Rick & Morty Explorer.

**Regla**: salvo que se diga "académico" o "universitario", se asume que el proyecto es real. Hoy hay **dos** flageados como universitarios, con el mismo formato en `metadata.client` (`Proyecto universitario · Maimónides`): **Recuérdalo** y **El Ritual del Tono**.

> ⚠️ **El Ritual del Tono estuvo mal clasificado**: figuraba como "Proyecto personal" en `projects.ts` y como uno de "los reales para clientes" en §8. Es un trabajo de **Programación Multimedial III (Universidad Maimónides, 2025)** — lo dice la página About de la propia demo. Antes de rotular un proyecto, mirar si el sitio publicado dice de dónde salió.

### Cómo se rotula cada proyecto — formato de agencia

El título de la card da la marca y el campo **`services`** da la categoría, como hacen las agencias (`Colonial Helados` / `Social Media & Producción Audiovisual`). Se rendea en dos lugares: bajo el título en la card y sobre el título en el header del case study. Separador: ` & `.

| Proyecto | `services` ES | `services` EN | `metadata.role` ES |
|---|---|---|---|
| Pulso Creativo | Diseño Web | Website Design | Diseño UX/UI e implementación en WordPress |
| Paseo Güemes Hotel | Diseño Web & Dirección de Arte | Website Design & Art Direction | Dirección de arte, diseño UX/UI e implementación en WordPress |
| FutbolTalent.Pro | Aplicaciones Móviles & Design System | Mobile Apps & Design System | Diseñador UX/UI |
| El Ritual del Tono | Diseño Web & Desarrollo de Producto | Website Design & Product Development | Diseño UI y Desarrollo Full-stack |
| Multibrand Design System | Design System | Design System | Diseño UX/UI y Design System |
| Recuérdalo | Aplicaciones Móviles | Mobile Apps | Investigación UX y Diseño Inclusivo |
| Cabify Music Match | Aplicaciones Móviles | Mobile Apps | Diseño UX/UI y Prototipado |

**Las tres reglas del rótulo:**

1. **`services` lleva CATEGORÍAS, nunca roles.** "Diseño Web", "Aplicaciones Móviles", "Design System", "Branding" — jamás "Diseño UX/UI", "Full-stack" ni "WordPress". Eso describe *cómo* se hizo y vive en `role` y en `stack`. Reemplazó al campo `type`, que salía igual en 5 de las 7 cards y describía a Tiago en vez del trabajo.
2. **Máximo 2 categorías.** Con 3 la línea se parte en dos renglones en la card y deja de escanearse.
3. **`role` no lleva "Freelance".** No aporta nada profesional y es lo primero que un reclutador descuenta.

> **Precisión de los títulos, para poder defenderlos en una entrevista.** *UX/UI Designer* diseña pantallas y flujos con el problema ya definido; *Product Designer* participa en decidir **qué** construir (priorización, métricas, definición del problema); *Desarrollo de Producto* incluye ingeniería, así que no aplica si no lo programaste. FTP dice `Diseñador UX/UI` por eso: lo contrataron para hacer las pantallas.
>
> Mismo criterio con **Branding vs Dirección de Arte**: en Paseo Güemes el logo se lo dieron y él definió paleta, tipografías y el sistema visual — eso es dirección de arte. Decir "Branding" invita a la repregunta "¿hiciste el logo?", y la respuesta resta.

> **`team` describe alcance, no cantidad de gente.** "Responsable único" y "Trabajo individual" señalan que no había nadie más; "Diseño y ejecución end-to-end · trato directo con el cliente" describe lo mismo como control sobre el proyecto. Misma realidad, lectura opuesta. No hace falta variar la redacción entre proyectos: **el campo solo se ve en la barra de metadata de un case study a la vez**, nunca dos juntos.

> **`stack` lleva solo herramientas core.** UX Research, Card Sorting y Design System son *actividades*, no stack: viven en `role` y en el cuerpo del caso. Cuatro proyectos quedan en `Figma` a secas y está bien — inflar la lista con actividades le quita credibilidad a la parte que sí es herramienta.

### Stack que se muestra en el carrusel
Solo lo que Tiago pueda defender en una entrevista.
- ✅ **Diseño**: Figma, FigJam, Photoshop, Illustrator, Premiere
- ✅ **Frontend**: HTML5, CSS3, React, Next.js, Tailwind
- ✅ **UX**: Research, Writing, Prototyping, User Testing, Card Sorting, Design Systems, Accessibility
- ✅ **Otros**: IA generativa aplicada al diseño, Git/GitHub, WordPress
- ❌ **No incluir**: MongoDB, Node.js, TypeScript, Express (los tocó, no los domina)

> Excepción: en el case study de El Ritual del Tono sí se nombran Mongo/Node/Express porque son el contexto de ese proyecto. Distinto a promocionarlos como habilidad general.

> **Herramientas propias**: no nombrar los temas de WordPress que usa (decisión de Tiago). En la copy va "un tema liviano" y el porqué de la elección. Elementor, WPForms, Rank Math y LiteSpeed sí se pueden nombrar **en el cuerpo del case study**, pero ya **no van en `metadata.stack`**: ese campo quedó podado a lo core (`Figma · WordPress`), porque una lista de plugins en la barra de metadata tapa la herramienta que importa.

---

## 8. 🚦 Qué falta hacer

**REGLA: una tarea por sesión.** No abrir frentes en paralelo (ya pasó factura). Excepción válida: un plan en fases acordado de antemano, con check-in entre fases.

### 🎯 Alcance de esta versión: 4 proyectos publicados

**Decisión de Tiago (2026-09-21).** El sitio publica solo los cuatro que se
están terminando: **Pulso Creativo, Paseo Güemes, FutbolTalent.Pro y El Ritual
del Tono**. Multibrand, Recuérdalo y Cabify **salen del sitio publicado**:
todavía no están para mostrar, y los reclutadores prefieren pocos proyectos
completos a muchos a medias.

**No se borró nada.** Los datos, el copy de los dos JSON, los briefs y las
imágenes de los tres siguen en el repo, con **`published: false`** en
`projects.ts`. Ese campo decide si la página existe: con `false` no se buildea
(da 404), no aparece en el home y no entra en el ciclo de "Próximo proyecto".
Todo lo que se ve en el sitio lee de **`publishedProjects`**, así que un
proyecto oculto no puede colarse aunque un componente nuevo se olvide de
filtrar.

> ⚠️ **Sacarlo de `generateStaticParams` no alcanzaba.** Por defecto Next
> genera a pedido cualquier slug que no esté en la lista, y como los datos
> siguen en el repo, la página oculta se seguía viendo entrando por la URL. Lo
> que da el 404 es `dynamicParams = false` en la page (`.claude/rules/stack-traps.md`).

> ⚠️ **Y despublicar las páginas tampoco alcanzaba: los tres seguían en el
> código fuente.** Sin una sola mención visible, aparecían en dos lugares:
> 1. **El copy de todos los case studies viajaba en cada página.** El layout
>    le pasaba al `NextIntlClientProvider` **todos** los mensajes, y los
>    bloques `case_study_*` eran el 87% del texto. Ahora el layout filtra esos
>    bloques: los lee solo la page del case study, en el servidor.
> 2. **Los datos de los 7 viajaban en un JS.** `Projects.tsx` es un
>    componente del cliente e importaba `projects.ts` entero. Ahora el home
>    (servidor) elige los proyectos y se los pasa como prop.
>
> Verificado en el build: los tres no aparecen ni en el HTML visible, ni en
> el código fuente de las 12 páginas, ni en los 117 payloads RSC, ni en los
> 17 JS del navegador. **De yapa, el HTML bajó un 16% (29% en gzip)**: los
> case studies, un 20-25% cada uno (Ritual ES 85,4 → 68,2 KB), y el home un 5%.

| ID | Tarea | Notas |
|---|---|---|
| **V2** ⏳ | **Versión siguiente: página de todos los proyectos + Multibrand, Recuérdalo y Cabify** | **Recuérdalo primero**, porque es el que más prueba investigación UX. Cada uno vuelve con una tanda completa (vocabulario de imágenes, cover, pasada de hechos del copy) y recién ahí pasa a `published: true`. La página `/projects` reemplaza a la vieja P-1: ⚠️ **`id="top"` obligatorio** en el div raíz (renderea el `<Footer />`), y al crearla hay que apuntar ahí el pill "Ver todos los proyectos" de `CaseStudyNextNav` (hoy va a `/{locale}#projects`, la grilla del home) y volver a poner el link del header de `Projects.tsx` (la key `projects.view_all` sigue en los dos JSON). El conteo del build cambia con cada uno: hoy son **15 páginas**; cada proyecto publicado suma 2 y la página de proyectos suma 2 |

### 🔓 El repositorio es público — decisión tomada, no un pendiente

**Decisión de Tiago (2026-09-22): el repo se queda público.** No vuelve a
aparecer como tarea ni se trata como un descuido. Lo que sigue es el riesgo
asumido, escrito para que nadie lo redescubra y lo abra de nuevo:

- **El historial conserva el material de FutbolTalent que se purgó de HEAD.**
  La purga (`f9ba5af`) y el borrado de las imágenes limpiaron el sitio, no
  `git log`. Siguen accesibles sin autenticarse: el copy original con las seis
  palabras prohibidas de §4, el flujo de convocatorias, los inversores y el
  stack (`d742a14`), y **las 4 imágenes con UI real del producto** en
  `196e39c`, descargables por `raw.githubusercontent.com`.
- **Esta misma documentación es pública.** La lista de "vocabulario prohibido"
  de §4 dice, por sí sola, que el producto tiene plan pago, inversores y con
  qué está hecho. Es lo que vuelve a T3 más urgente que antes.
- **Sacarlo después no alcanza**: GitHub sirve los commits viejos por SHA
  aunque se reescriba el historial, y reescribir necesita `git-filter-repo`,
  que no está instalado, más un push forzado.

> ⚠️ **Lo que esto implica para el trabajo diario**: todo lo que se commitea es
> público desde el primer push, así que el control de NDA se hace **antes** de
> commitear, no después. Un archivo en `public/` se sirve en producción y
> además queda en el historial para siempre.

### Bloqueado por contenido de Tiago
| ID | Tarea | Notas |
|---|---|---|
| **IMG-1** | **Rehacer las imágenes de los 4 publicados** — covers + case study | ⚠️ **Con el alcance nuevo (arriba) el "35 = 7 covers + 28" ya no aplica**: esta versión cubre solo los 4 publicados, y los otros 3 pasan a V2 con sus tandas. Reemplaza a NDA-img, WP-img y B1, que quedaron sin objeto al darse de baja todas las provisorias (§10). 📋 **La dirección de arte, las medidas y el vocabulario de tipos están en `.claude/rules/imagenes.md`**; el cableado en §10 y las prioridades acá abajo. ⚠️ **Ya no son 4 por case study**: la cuota se reemplazó por el vocabulario, así que "28 de case study" es una estimación, no un target. ✅ **D3 ya está hecho**, así que el cableado es solo agregar el `src`: no hay que optimizar nada a mano ni pensar en `srcset`. |
| ~~**B3**~~ | ~~Métricas reales de FutbolTalent.Pro~~ | ❌ **Dada de baja (2026-09-22).** La tarea se contradecía con §4, que prohíbe publicar métricas internas del producto: aunque Tiago consiguiera los números, no se podrían usar. El caso cierra con el proceso y el sistema, que es lo que el NDA sí permite mostrar. |

**Orden** — hechas en este orden, el sitio queda presentable después del primer bloque en vez de después del último:

| | Bloque | Por qué en ese orden |
|---|---|---|
| **P0** | Los 4 covers del home (Pulso Creativo, Paseo Güemes, FutbolTalent.Pro, El Ritual del Tono) | Es lo único que ve alguien que entra y no scrollea. **`pulso-creativo-cover` desbloqueó la tarea P-3.** |
| **P1** | Las de case study de esos 4 | Son los 4 casos publicados. Sin cantidad fija por caso (`.claude/rules/imagenes.md` §2) |
| ~~**P2**~~ · ~~**P3**~~ | ~~Los 3 covers y las imágenes de case study restantes~~ | **Pasaron a V2** con el alcance nuevo (arriba) |

Progreso: P0 `4/4` cableados · **Pulso, Paseo y FutbolTalent con el cover limpio** · P1: **Pulso ✅ cerrado (5)**, con 2 pendientes de imagen · **Paseo ✅ cerrado (4)** · **Ritual ✅ publicado y verificado en `d6e50eb` (5)**, tanda abierta por el cover con texto inventado · **FutbolTalent ✅ publicado y verificado en `4165f6d` (3)**

> **Los 4 case studies están publicados con sus imágenes.** Lo que queda para
> cerrar la versión son cuatro arreglos sobre lo ya publicado, en el orden de
> abajo, y antes de todo eso **T4**.

> **Ya no se cuenta sobre 35.** Ese total salía de la cuota de 4 por caso: Pulso cerró con 5 y Paseo con 4. El denominador de cada caso sale de lo que el proyecto tiene para mostrar (`.claude/rules/imagenes.md` §2, *"Casos reales"*).

⚠️ **De los 4 covers del home, tres están limpios (Pulso, Paseo y
FutbolTalent) y uno no.** Solo Ritual sigue con texto inventado, y se corrige
en la tanda de su proyecto. El de FutbolTalent estaba flageado por analogía y
se verificó limpio: en su pantalla va solo el logo. Ver *"Incidente de los covers"* más abajo. Los 4 son mockup de
dispositivo sobre hormigón con luz dura, generados con Nano Banana Pro y
compuestos en Figma. Specs verificados: `2400×1800` (4:3) los tres anchos,
rango tonal 164-196. Cada uno tiene su propio protagonista para que la serie
no se lea repetida: Paseo va con celular adelante (el caso es mobile-first),
Ritual suma un Fender y un pedal con la sombra del mástil en la pared, y
FutbolTalent es un celular con el logo sobre la sombra de una red de arco.

### Rework de Projects — plan en fases (acordado, con check-in entre cada una)

Sale de la referencia [mikekus.com](https://mikekus.com/): el home muestra 4-6 proyectos destacados, el resto vive en una página aparte, y el cover muestra **el producto a color** que en hover se transforma. Hoy el sitio hace lo contrario en las tres cosas.

**Decidido**: 4 proyectos en el home — **los cuatro que mejor muestran rango** (Pulso Creativo, Paseo Güemes, FutbolTalent.Pro, El Ritual del Tono). El criterio era "los cuatro reales para clientes" y dejó de valer cuando se supo que Ritual es universitario (§7); **se queda en el home porque es el único full-stack con demo en vivo** (decisión de Tiago, 2026-09-21). Los otros 3 (simulación, universitario, concept) **no están publicados** en esta versión; vuelven en V2, en una página propia · página, no carrusel · label en dos líneas · título visible en idle.

| ID | Tarea | Toca | Notas |
|---|---|---|---|
| ~~**P-4**~~ | ~~Label `nombre + servicios`~~ | — | ✅ **Hecha.** El campo `type` se borró; la convención y la tabla de los 7 viven ahora en §7. |
| ~~**P-1**~~ | ~~Página `/projects` con los 7 + un 8º tile de CTA~~ | — | ➡️ **Pasó a V2** (arriba, *"Alcance de esta versión"*), junto con los 3 proyectos que la llenan. Las notas de `id="top"` y del link del header se mudaron ahí. |
| ~~**P-2**~~ | ~~Home a 4 cards~~ | — | ✅ **Hecha.** `featured` → `showOnHome`. La grilla uniforme 3:2 duró poco: se reemplazó por el bento de dos formas (`cardShape`) en P-3. |
| ~~**P-3**~~ | ~~Dirección de arte de la card~~ | — | ✅ **Hecha.** Reposo: solo la imagen, cero texto. Hover: lavado + nombre + VER PROYECTO + categoría + escuadras. Grilla bento de dos formas. |
| ~~**P-5**~~ | ~~Cierre de docs: §6, §7 y §10~~ | — | ✅ **Cerrada (2026-09-23).** Las tres describen lo que existe: 15 páginas, 4 proyectos publicados, 21 imágenes y la grilla masonry con `cardShape`. De paso se corrigieron los conteos de accesibilidad de §6, que eran de una pasada vieja. |

⚠️ **El link "Ver todos los proyectos ↗" se sacó del home** porque tiraba 404.
Vuelve con la página de V2, en el header de `Projects.tsx` — la key
`projects.view_all` **sigue en los dos JSON**, así que no hay que crearla de
nuevo. En el componente quedó un comentario en el lugar exacto donde iba.

✅ **La estructura de la página de case study ya se rediseñó** (sigue sin
commitear, ver abajo). Lo que se hizo, contra las referencias de Studio Dizzy
(screenshots largos a sangre) y mikekus/MIXD (barra de metadata arriba, series
de imágenes full-width):

| | |
|---|---|
| **Metadata a barra superior** | Se eliminó `CaseStudySidebar`. Libera el shell completo de 1280 y arregla el orden de lectura en mobile (§6) |
| **El hero es el mockup, a sangre** | `type: 'mockup'`, 21:9. Es la misma escena que el cover en otro encuadre, a propósito: clic en la card y aterrizás en la misma imagen. Primero se había decidido que el hero fuera la tira larga; cambió al cerrar Pulso. Lo que sigue prohibido es un hero que sea una versión PEOR del cover (`.claude/rules/imagenes.md` §3) |
| **Metadata debajo del intro en mobile** | En desktop la barra sigue arriba; en mobile baja después del intro, para que la primera pantalla sea la frase que explica el proyecto. DOM en orden mobile + `md:order-first` |
| **Vocabulario de tipos** | `type` + `slot` en cada brief, sin cuota fija. La page recorre el array en vez de leer 4 posiciones |
| **Regla de los 36px reformulada** | Pasó a ser comprensión a 330px, que admite tiras y diagramas sin necesidad de una excepción (`.claude/rules/imagenes.md` §1.2) |

**Lo que queda de esa tanda**, en orden:

1. ✅ **Cover corregido de Pulso publicado** en `a203a6a` (2026-09-17). Commit
   de un solo archivo, sin arrastrar el borrado staged. Verificado contra el
   deploy: el sitio sirve el archivo nuevo, byte a byte.
2. ✅ **Pulso visto en la página.** De ahí salieron dos pendientes que siguen
   abiertos (lista en *"Pulso — cerrado"*).
3. ✅ **Tanda de Paseo — cerrada** (ver *"Paseo — tanda"*). Qué es una tanda,
   para no dejar nada suelto. Una tanda de un proyecto incluye **siempre**:
   - las imágenes de case study con el vocabulario,
   - **el cover corregido**, con la captura real en pantalla. No es opcional:
     cover y hero son el mismo mockup, así que salen de la misma escena. **La
     tanda no está cerrada mientras el cover siga con texto inventado.**
   - **y las dos cosas pasan el control al 100%** (`.claude/rules/imagenes.md`
     §6): texto real **y sin artefactos**. Esto se agregó con Paseo, que tenía
     el texto bien y costuras de composición en las pantallas.

   📋 **Antes de producir**: la tabla de proporciones por tipo y la zona segura
   (`.claude/rules/imagenes.md` §2), la regla de luminancia (§4.2), y el
   `cardShape` del proyecto para el encuadre del cover (§3).
4. **Después, Ritual y FutbolTalent**, con la misma definición de tanda. Los
   dos son `wide`: **cover en 4:3**.
   ⚠️ **FutbolTalent NO lleva mockup con UI ni tira**: el NDA (§4) prohíbe
   pantallas finales del producto. Su hero tiene que salir del material
   permitido (wireframes, flujos, design system, personas), y su cover se
   corrige con solo el logo real en pantalla.

✅ **FutbolTalent — publicado y verificado en `4165f6d` (2026-09-23).** El copy
está reescrito contra las respuestas de Tiago y las 3 imágenes están cableadas,
con el cover verificado limpio. **Con esto cierran los cuatro case studies de
esta versión.**

**Verificado contra el deploy**: las 3 imágenes y el cover, idénticos byte a
byte a los del repo · en los dos idiomas, el copy nuevo completo (intro,
`process`, las tres decisiones, "Más de 35 pantallas" y el cierre con la
confidencialidad) y **cero apariciones** de las afirmaciones viejas y del
vocabulario prohibido de §4 · las 3 imágenes en orden `00` → `01` → `02` con
sus alts · Pulso, Paseo, Ritual y el home, **con el texto visible idéntico al
build local**, o sea que la tanda no tocó nada de los otros casos.

> **Cómo se comparan dos páginas contra el deploy, para la próxima**: hashear el
> HTML entero **no sirve** —el payload de los `<script>` trae los IDs del build
> y cambia en cada deploy, así que todo "difiere"—. Hay que sacar `<script>` y
> `<style>`, después las etiquetas y las entidades, normalizar los espacios y
> recién ahí comparar. Con eso las cinco páginas dieron idénticas al carácter.

> **Queda un detalle cosmético**, sin bloquear: en `02-cluster` dos de las tres
> secciones dicen *"ON BOARDING + REGISTR…"*, cortado por el ancho de la
> sección en Figma. A 1280 se lee truncado, y son justo las que prueban la
> decisión 1. Se arregla ensanchando esas secciones y volviendo a capturar.

| Archivo | `type` | `slot` | Medida | Estado |
|---|---|---|---|---|
| `00-mockup.jpg` | `mockup` | `hero` | `2560×1097` (21:9), a sangre — captura del archivo de Figma (página del Design System, panel de estilos abierto) plana sobre hormigón | ✅ Cableada |
| `01-diagrama.jpg` | `diagram` | `challenge` | `2400×1600` — las tres protopersonas sobre un plano del azul del logo, y **el tramo de registro** del user flow de scout/club | ✅ Cableada en la tercera versión (abajo) |
| `02-cluster.jpg` | `screen-cluster` | `decisions` | `2400×1600` — vista alejada de los wireframes, con la sección del feed sin registro recortada | ✅ Cableada |
| cover | — | — | `2400×1800` (4:3) — celular con el logo sobre hormigón, con la sombra de una red | ✅ **Verificado limpio**, rango tonal 175. No estaba roto: el flag venía de asumir el defecto de los otros covers |

✅ **`01-diagrama` — resuelto recortando, en tres vueltas.** La primera versión
mostraba los dos user flows enteros, con tres nodos que el caso no puede
mostrar. Mientras estuvo así **el archivo se mantuvo fuera de `public/`**
(§11: todo lo que vive ahí se sirve en producción, aunque no se muestre en la
página). Los tres nodos eran:

1. Flujo 2 (scout/club) — *"Popup: El usuario debe registrarse para guardar contenido"*, entre "¿Quiere guardar contenido?" y "¿El usuario tiene cuenta?".
2. Flujo 2 — *"Navegar a Rankings"*, en el grupo que sale de "Resultados de Búsqueda". Es la gamificación que el copy no nombra por §4.
3. Flujo 1 (jugador) — *"Popup: El usuario debe registrarse para subir contenido"*. Mismo muro, otra redacción.

> **El criterio es la fidelidad, no el tema** (decisión de Tiago, 2026-09-22).
> La restricción del NDA es **no mostrar pantallas**: por eso la sección del
> feed sin registro sale de los wireframes, donde es una pantalla, y el nodo
> *"Pantalla Feed"* se queda en el flujo, donde es una caja de un diagrama. Las
> dos imágenes no tienen que decir lo mismo; tienen que respetar lo mismo.

**Cómo se resolvió** (decisión de Tiago, 2026-09-22): **salió el flujo 1**
—se veía chico y desprolijo— y **el flujo 2 se recortó para que los nodos
queden fuera del encuadre. Recortar, no tapar.**

> **El recorte que cierra es el tramo de registro**: "¿El usuario tiene
> cuenta? → Ir a Registro → Onboarding → Sign Up → ¿Jugador o Scout? → Carga
> de datos iniciales", con la base de datos de los campos, y abajo la línea de
> "Login → Pantalla Explorar". Deja el popup afuera por la izquierda y los
> rankings por abajo, se lee solo, y **es justo lo que sostiene la decisión 1**:
> el registro cambia según el perfil.
>
> ⚠️ **No cualquier recorte servía.** *"Navegar a Rankings"* está en el medio
> del grupo que sale de "¿Qué perfil busca el usuario?" y converge en
> "Resultados de Búsqueda", **en paralelo con "Aplicar Filtros Avanzados"**:
> cortarlo por arriba dejaba los conectores de esa rama yendo hacia la nada.
> Por eso el tramo que se salva es el de registro y no el de búsqueda. La otra
> salida, si alguna vez hace falta el tramo de búsqueda, es **borrar ese nodo
> en FigJam y re-exportar** — editar el archivo antes de capturar no es
> retocar, es lo mismo que se hizo con la sección del feed en los wireframes.

**Verificado en la versión final**, al 100% sobre el archivo publicado: en el
borde izquierdo entra la flecha a "¿El usuario tiene cuenta?" sin rastro del
popup, y el corte de abajo cae después de "Pantalla Explorar", sin rastro de
rankings. La pieza va sobre un plano del **azul del logo** en vez de hormigón
—las tres son capturas de Figma y el color rompe la monotonía, igual que el
cluster de Paseo sobre marrón—. Números: borde **78** (la segunda versión daba
61, el plano más oscuro de los cuatro clusters; ahora queda en la línea de
Paseo, 75), 0% cerca de los dos fondos · los tres roles a **60px en el frame
1×**, con la regla en 36 · márgenes 140 / 141 / 105 / 93, sobre la zona segura
de 80.

> ⚠️ **El alt tuvo que cambiar con la imagen.** Decía *"los user flows de cada
> una"* y ahora hay **un** flujo, recortado. Un alt que describe la versión
> anterior de su imagen no lo detecta ningún build: se revisa cuando se cambia
> el archivo, igual que el `src`.

> ⚠️ **Los user flows dicen algo distinto del copy y de los wireframes.** Los
> wireframes tienen tres onboardings, uno por perfil, pero los flows son dos:
> `UserFlow 1 — Jugador` y `UserFlow 2 — Scout / Club`. Por eso el copy afirma
> el **registro** distinto por perfil, que es lo que las dos imágenes prueban,
> y no tres flujos separados.

**El copy se rehízo entero** (`process` incluida, que antes no tenía). Salió de
las respuestas de Tiago, no de código ni de un sitio publicado: acá no hay nada
que contrastar. Lo que se cayó, además de las 🔒 del NDA: el buscador
progresivo que nunca propuso, los "Filtros Avanzados" como sección, el Design
System atómico (las pantallas cambiaban todo el tiempo, así que hizo los
componentes primero y el sistema al final), "UX Research" como tag (no hubo
entrevistas ni pruebas) y el equipo "multidisciplinario".

### 🚦 Orden para cerrar esta versión (decisión de Tiago, 2026-09-23)

**Primero T4**, que está arriba y no es de imagen. Después, en este orden:

| | Tarea | Dónde está el detalle |
|---|---|---|
| 1 | **El cover de Ritual** con texto inventado | *"Ritual — publicado y verificado"*, abajo. Es lo único que le falta a su tanda |
| 2 | **El diagrama de Pulso** — reemplazarlo por una captura de su página de contacto | *"Pulso — cerrado"*, punto 8. Arrastra el punto 5 y menciones en §1.2, §2, §4.1, §4.2 y §5 de las rules |
| 3 | **La tira de Pulso** — columnas más grandes, con el criterio de la de Paseo | *"Pulso — cerrado"*, punto 4 |
| 4 | **Las etiquetas del `02-cluster` de FutbolTalent** | En la tanda de FTP, arriba. Cosmético |

Con esos cuatro, la versión queda cerrada; la página de todos los proyectos
pasa a V2 (arriba). Y sigue pendiente una decisión que la estructura nueva
habilita pero nadie tomó: qué otros tipos además del hero merecen ir a sangre
(hoy `palette` y `screen-cluster` van al shell de 1280, que fue decisión
explícita de Tiago).

#### ✅ Commiteado y publicado en `7f69757` (2026-09-17)

Todo este bloque estuvo semanas sin commitear y entró junto, en un solo commit
de 38 archivos. **Verificado contra el deploy**: el sitio sirve las imágenes
nuevas (hashes idénticos a los del repo), el case study de Pulso ya no dice
*"ruteado por servicio"* y el de Paseo dice *"El sitio ya está publicado"*.

Queda como registro de qué entró y por qué.

| Archivo | Qué cambió |
|---|---|
| `src/messages/{es,en}.json` | Case study de Pulso reescrito. Se sacó todo lo que **no existe en el sitio publicado**: el WhatsApp "ruteado por servicio" (es Joinchat, un solo número y el mismo mensaje en todas las páginas), el texto "limitado a 800px" (no hay ningún 800px en el CSS) y la "optimización de rendimiento en servidor" (no se hizo). Las 3 decisiones ahora son carrusel de logos · casos en viñetas · dos vías de contacto. Se borró la key opcional `process`. |
| `src/data/projects.ts` | `tagline` ("Plataforma" → "Sitio"), `description` y los alts de 02, 03 y 04. **Y el rediseño**: `type` + `slot` en los 28 briefs, más la nota de que las 8 cableadas son provisorias. |
| **Rediseño de la página de case study** ↓ | |
| `src/components/case-study/CaseStudyMetaBar.tsx` | **Nuevo.** Barra de metadata horizontal (`grid-cols-2 sm:3 lg:4` + `border-y`). Reemplaza al sidebar. |
| `src/components/case-study/CaseStudySidebar.tsx` | **Borrado.** |
| `src/components/case-study/imageSpec.ts` | **Nuevo.** Traduce cada `type` a ancho, recorte, parallax, `frame` nominal y `sizes`. Módulo plano sin `'use client'` a propósito: lo leen un client component y un server component. |
| `src/components/case-study/CaseStudyImageRun.tsx` | **Nuevo.** Rendea las imágenes de un `slot` seguidas, y decide por imagen si va a sangre o dentro del shell. |
| `src/components/case-study/CaseStudyImage.tsx` | Recibe `type` en vez de `aspectRatio`. Camino nuevo sin recorte para `long-strip` + `priority` para la del hero. |
| `src/app/[locale]/projects/[slug]/page.tsx` | De grilla 12-col a secuencia de bloques hermanos con un `<Shell>` local. Las imágenes se piden por `slot`. |
| `src/components/case-study/CaseStudyHeader.tsx` | Le saqué su `max-w-7xl` propio: el ancho lo da el `<Shell>` de la page. |
| `src/types/index.ts` | `CaseStudyImageType` · `CaseStudyImageSlot` · `CaseStudyImageBrief`. |
| `.claude/rules/imagenes.md` | **Nuevo.** Todas las reglas de imagen consolidadas. Importado desde `CLAUDE.md`. |
| `.gitignore` | Ignoraba `.claude` **entero**, así que las rules importadas y las skills no se versionaban y un clon limpio quedaba con `CLAUDE.md` importando archivos que no existen. Ahora versiona `rules/` y `skills/`, y deja afuera `settings.local.json`. |
| `.claude/rules/*.md` · `.claude/skills/auditar-copy/` | Sin trackear hasta ese cambio del `.gitignore`. |
| **Tanda Pulso — imágenes finales (2026-09-16)** ↓ | |
| `public/images/case-study/pulso-creativo/` | 5 imágenes con el naming nuevo: `00-mockup` · `01-tira` · `02-cluster` · `03-paleta` · `04-diagrama`. Se borraron `01-hero`, `02-challenge` y `03-decisions`; `04-delivered` se renombró a `04-diagrama`. |
| `src/types/index.ts` · `imageSpec.ts` | Tipo nuevo **`mockup`**: a sangre, sin recorte, sin parallax, 21:9 de default. `frame` pasa a valer para los dos tipos sin recorte. |
| `src/data/projects.ts` | Los 5 briefs de Pulso. Flag *pendiente de revisión* en los covers de Paseo, FutbolTalent y Ritual. |
| `src/app/[locale]/projects/[slug]/page.tsx` | Metadata debajo del intro en mobile (`md:order-first` en desktop). El contenedor pasó de `space-y` a `flex` + `gap`, porque `space-y` reparte el margen por orden del DOM y con `order` dejaba mal los espacios. |
| `src/components/case-study/CaseStudyMetaBar.tsx` | `animate` → `whileInView`: en mobile la barra quedó fuera de la primera pantalla y hacía su entrada donde nadie la veía. |
| `.claude/rules/imagenes.md` | Incidente de los covers (§1.1) · tipo `mockup` y tira en columnas (§2) · cover y hero, mismo mockup (§3) · caso real de Pulso en el split de color (§4.1) · naming `{nn}-{nombre}` (§5). Segunda vuelta: tabla de proporciones por tipo + zona segura (§2) · casos reales de luminancia (§4.2). Tercera vuelta: §4 reestructurada — **una sola regla de luminancia para todas las imágenes, sin excepción** (§4.2) y el rango tonal pasa a §4.3 · covers con texto inventado confirmado, corregidos dentro de la tanda de cada proyecto (§1.1). |
| `public/images/case-study/pulso-creativo/` (segunda vuelta) | `01-tira` sobre hormigón · `03-paleta` a 16:9 · `04-diagrama` sobre charcoal. |
| **Tanda Paseo (2026-09-17)** ↓ | |
| `public/images/case-study/paseo-guemes-hotel/` | 4 imágenes con el naming nuevo: `00-mockup` · `01-tira` · `02-cluster` · `03-paleta`. Borradas las 4 provisorias. |
| `public/images/covers/paseo-guemes-hotel-cover.jpg` | Cover con el texto corregido. ⚠️ **No publicar solo** como se hizo con el de Pulso: tiene costuras y es 1:1 (ver *"Paseo — tanda"*). |
| `src/data/projects.ts` | Los 4 briefs de Paseo con alts nuevos en los dos idiomas. El flag del cover de Paseo pasa de "texto inventado" a los dos pendientes reales. |
| `.claude/rules/imagenes.md` | Casos reales de uso del vocabulario (§2) · criterio de columnas de la tira · `cardShape` antes de exportar el cover (§3) · paleta de Paseo (§4.1) · Paseo en la tabla de luminancia (§4.2) · costuras al componer (§1.1). |
| **Tanda Paseo, segunda vuelta (2026-09-17)** ↓ | |
| `public/images/covers/paseo-guemes-hotel-cover.jpg` · `.../paseo-guemes-hotel/00-mockup.jpg` | Rehechos **sin perspectiva**: mockup de celular con la captura adentro + captura plana para el desktop. Cover a `2400×1800` (4:3). Sin costuras. |
| `public/images/case-study/paseo-guemes-hotel/03-paleta.jpg` | Formato sin tarjeta (logo grande a la izquierda, bandas a la derecha) sobre fondo de valor medio (73). |
| `src/data/projects.ts` | El comentario del cover de Paseo pasa de "pendientes" a limpio. |
| `.claude/rules/imagenes.md` | Orden de preferencia para meter una captura en una pantalla, con la perspectiva como último recurso (§1.1) · formato de `palette` y la regla de no recolorear un logo (§2) · Paseo actualizado en §3, §4.1 y §4.2. |
| **Auditoría de copy (2026-09-17)** ↓ | |
| `public/images/case-study/pulso-creativo/03-paleta.jpg` | Rehecha con el formato de Paseo: sin tarjeta, fondo de valor medio (73). |
| `src/messages/{es,en}.json` | **Case study de Paseo, pasada de hechos contra el sitio publicado.** Se corrigió: el cierre decía *"está por publicarse"* y el sitio ya está online; `delivered_3` prometía *"base de SEO local, backups automáticos y rendimiento optimizado"* (el HTML no tiene meta description, ni datos estructurados, ni H1 en la portada) y *"formularios"* en plural cuando hay uno; y *"el activo que más convierte"*, un superlativo sin métrica en el mismo párrafo que dice que no hay métricas. Además, dos posesivos comidos en el inglés (`the hotel own` → `the hotel's own`) y dos dos-puntos que anunciaban. |

✅ **Ya está publicado**: el case study en vivo tiene la estructura nueva, las imágenes con el vocabulario y el copy contrastado contra los sitios reales.

Decisiones de Tiago que siguen abiertas sobre el copy de Pulso:
- ¿El sitio está dado de alta en Search Console? En el HTML no hay meta de verificación, pero puede estar verificado por DNS.
- El cierre dice *"hoy no tengo números de consultas para mostrar"*. Es honesto y se puede suavizar.
- La negociación con el cliente está contada en abstracto. Con un ejemplo concreto (qué querían contar, qué se cortó) es la mejor parte del caso.

> ✅ **La skill `auditar-copy` ya tiene la pasada de hechos** (2026-09-23).
> Audita en tres pasadas y la de hechos va primero, con la tabla de dónde se
> verifica según de dónde salga el caso —sitio publicado, código, API o la
> memoria de Tiago— y la regla de preguntar cuando falta el dato. Se escribió
> con lo que costó aprenderlo en los cuatro casos.
>
> **Cómo se hizo a mano en Paseo, que es de donde salió el método**: bajar el
> HTML del sitio con `curl` y buscar la evidencia de cada afirmación —
> `<video>` para un hero con video, `<form>` y sus `<label>` para un formulario,
> `data-settings` del widget para "tres logos en mobile", `name="description"` /
> `ld+json` / `<h1>` para una afirmación de SEO. ⚠️ **No alcanza con un resumen
> de la página**: el resumen de texto de Paseo decía que el hero era una imagen
> fija, y en el HTML hay un `<video autoplay loop>`. La afirmación era cierta y
> por poco se "corrige" una verdad.

🚨 **Incidente de los covers — la regla de captura real se violó en producción.**
Los mockups se generaron con IA **con la pantalla incluida**, y el cover de Pulso
publicado tiene el párrafo del hero en galimatías (*"doude una mirada
estratégica, corcaca e Ireograi… para kligoizar marcas"*). Se lee con zoom.

Esto **reemplaza** a la "deuda conocida, no bloqueante" que había acá: se había
decidido publicarlos porque a 628px las palabras rotas no se ven. Ese criterio
no aguanta —se lee con zoom, y el mismo mockup ahora va a sangre en el hero— y
el análisis completo, con cómo detectarlo, está en `.claude/rules/imagenes.md`
§1.1.

| Cover | Estado |
|---|---|
| Pulso Creativo | ✅ **Publicado y limpio.** Primero se corrigió incrustando la captura (`a203a6a`), y después **se rehízo con el método sin perspectiva** junto con su `00-mockup`, que entró en `7f69757`. Hoy: `2400×2400`, párrafo y nav leídos al 100%, rango tonal 209, bordes de pantalla limpios |
| Paseo Güemes | ✅ **Publicado y limpio**, `2400×1800` (4:3). Las dos pantallas estaban generadas; se rehizo con el método sin perspectiva. Entró en `7f69757` |
| El Ritual del Tono | ❌ **Texto inventado, confirmado** (*"los **guionnates** más icónicos"*). Se corrige **dentro de la tanda de su proyecto**, porque es el mismo mockup que el hero. Flageado también en `projects.ts` |
| FutbolTalent.Pro | ✅ **Verificado limpio (2026-09-22).** Estaba flageado por analogía con los otros y no correspondía: en su pantalla va **solo el logo**, así que no hay copy de producto que un generador pueda redibujar. Leído al 100%, dice *FUTBOLTALENT PRO* y coincide con el asset del Figma |

> El cover de Pulso estaba exportado a 1× (`1200×1200`) y la card en retina pide 1256px. **Se cerró con el corregido**, que viene a 2×. Los cuatro covers llegan ahora.

> ✅ **El cover se publicó solo, adelantado a la tanda de case study**, en `a203a6a`. La trampa que lo hacía necesario **ya no existe**: el borrado de `CaseStudySidebar.tsx` entró con el resto en `7f69757`. La receta queda porque el patrón se repite cada vez que haya que publicar un archivo suelto con trabajo a medio terminar en el árbol.
>
> **Qué pasaba entonces**: `CaseStudySidebar.tsx` estaba staged como borrado y el `page.tsx` publicado todavía lo importaba, así que un `git add <archivo>` + `git commit` a secas metía ese borrado y **rompía el build de Vercel**. Para publicar un archivo suelto **no se hace `git add`**: se commitea con el path al final, que toma solo ese archivo e ignora el resto del stage.
>
> ```
> git commit -m "…" -- <archivo>
> git show --stat HEAD     # tiene que listar UN solo archivo
> git push
> ```

✅ **Pulso — cerrado con el vocabulario.** Cinco imágenes de cinco tipos, con
el naming nuevo:

| Archivo | `type` | `slot` | Medida |
|---|---|---|---|
| `00-mockup.jpg` | `mockup` | `hero` | `2560×1097` (21:9), a sangre. **Rehecho sin perspectiva** junto con el cover |
| `01-tira.jpg` | `long-strip` | `intro` | `2400×1350` (16:9), a sangre — home desktop y mobile en columnas, sobre hormigón de valor medio |
| `02-cluster.jpg` | `screen-cluster` | `decisions` | `2400×1600`, sobre el verde marca `#8EB943` |
| `03-paleta.jpg` | `palette` | `decisions` | `2400×1350` (16:9), formato sin tarjeta sobre fondo de valor medio |
| `04-diagrama.jpg` | `diagram` | `delivered` | `2400×1600`, sobre charcoal |

El slot `challenge` queda **sin imagen a propósito**: el desafío era texto denso
y conflictos de plantillas de WordPress, y no hay nada visual honesto que
mostrar. Control 1.1 hecho al 100% sobre el mockup, la tira y el cover: el
texto es real.

**Pendientes que dejó Pulso:**

1. ✅ ~~La tira se fundía con el tema oscuro~~ (71,5% del borde en `#111110`).
   Rehecha sobre hormigón de valor medio: 0% cerca de los dos fondos.
2. ✅ ~~La paleta era 3:2 y `palette` recorta a 16:9~~. Re-exportada a 16:9.
   De ahí salió la tabla de proporciones por tipo, con la **zona segura de 80px**
   que impone el parallax (`.claude/rules/imagenes.md` §2).
3. ✅ ~~§4.2 de las rules se contradecía~~ (eximía a las imágenes del shell de
   la regla de luminancia, con un motivo falso en el código). **Decisión de
   Tiago: una sola regla, sin excepción.** Toda imagen necesita un borde
   claramente distinto de los dos fondos, vaya a sangre o no. Reescrita en
   `.claude/rules/imagenes.md` §4.2, con el porqué.

**Siguen abiertos** (no entraron en la tanda de Paseo; se hacen cuando Tiago
rehaga las de Pulso):

4. **`01-tira` — las columnas son chicas.** Ocupan ~60% del ancho y queda
   demasiado gris alrededor: a sangre se ven como capturas chiquitas flotando,
   y una imagen a sangre tiene que tener presencia. Se agrandan **con el
   criterio de la tira de Paseo**, que llena el encuadre de borde a borde.
5. **`04-diagrama` — dos cosas en la misma pasada.** ⏸ **En suspenso hasta
   decidir el punto 8**: si el diagrama se reemplaza, este arreglo no hace falta.
   - **El borde no se lee.** El charcoal da los números (0% cerca de
     `#111110`) pero en la página real el contorno casi no se ve. Sube un
     escalón. Es el caso que demostró que el número de §4.2 es un piso y no
     una prueba.
   - **El título está dentro de la zona segura**: arranca a 61px del borde
     superior del frame 1×, y la zona pide 80. Se baja.
6. ✅ ~~`03-paleta` con el mismo borde que el diagrama~~. Rehecha con el formato
   sin tarjeta y fondo de valor medio (73, 0% cerca de los dos fondos), igual
   que la de Paseo.

> ⚠️ Con la paleta ya en valor medio y el diagrama todavía en charcoal (42), las
> dos piezas de documentación de Pulso quedaron **desparejas**. Es un argumento
> más para el punto 5: cuando se rehaga el diagrama, va al mismo fondo.

Queda aparte, no bloquea nada:

7. **`priority` está deprecado en Next 16** (reemplazado por `preload`). Sigue
   funcionando —el HTML emite el `<link rel="preload">` del mockup—, pero
   `CaseStudyImage` usa la prop vieja. Venía de antes.

⏳ **Para DESPUÉS de FutbolTalent, dentro de esta versión — no en V2:**

> Decía *"después de los siete case studies"*. Con el alcance nuevo (arriba)
> Tiago lo fijó así (2026-09-22): Pulso ya está publicado y el diagrama se ve,
> así que es de esta versión.

8. **`04-diagrama` — ¿reemplazarlo por el producto real?** A Tiago no le
   cierra (2026-09-21). Es la única imagen de los sets publicados que muestra
   una decisión **en abstracto** en vez del sitio, y al final de la página
   rompe el registro: todo lo anterior es producto, y el cierre es un esquema.
   - **Candidato**: una captura de la página de contacto de Pulso con el
     formulario y el botón de WhatsApp **en el mismo encuadre**. Muestra la
     misma decisión (dos vías de contacto), pero en el producto real.
   - **Si se reemplaza, el `type` pasa de `diagram` a `screen-cluster` o
     `detail`.** Ojo con §1.2 de las rules: la página de contacto entera tiene
     labels y texto chico, así que como `detail` va recortada a formulario +
     botón. Y el botón de WhatsApp es el flotante de Joinchat (`position:
     fixed`): verificar que aparezca en la captura y al lado del formulario,
     porque un elemento fijo no siempre queda donde se lo ve al scrollear.
   - **Arrastra docs**: `.claude/rules/imagenes.md` cita este diagrama como
     *"el estándar a igualar"* en §1.2 y lo lista en §2, §4.1, §4.2 y §5. Si se
     reemplaza, esas menciones se actualizan en la misma pasada.
   - **Mata el punto 5** si se reemplaza, y con él la nota de las dos piezas de
     documentación desparejas.

✅ **Paseo — cerrado.** Cuatro imágenes de cuatro tipos, y el cover limpio. Se
borraron las 4 provisorias (`01-hero` · `02-challenge` · `03-decisions` ·
`04-delivered`).

| Archivo | `type` | `slot` | Medida |
|---|---|---|---|
| `00-mockup.jpg` | `mockup` | `hero` | `2560×1097` (21:9), a sangre |
| `01-tira.jpg` | `long-strip` | `intro` | `2400×1350` (16:9), a sangre — home desktop en 2 columnas y mobile en 3, sobre hormigón |
| `02-cluster.jpg` | `screen-cluster` | `decisions` | `2400×1600`, sobre el marrón marca `#6A442E` |
| `03-paleta.jpg` | `palette` | `delivered` | `2400×1350` (16:9), formato sin tarjeta sobre fondo de valor medio |
| cover | — | — | `2400×1800` (4:3, la forma de su card) |

**Sin diagrama, a propósito**: sus decisiones (reserva directa sobre las OTAs,
stack editable por el cliente, jerarquía del hero, CTAs por recorrido) no
tienen estructura que valga dibujar. `challenge` tampoco lleva imagen.

Verificado: control 1.1 al 100% en el mockup y el cover (las dos pantallas
dicen el texto real, y los bordes de cada pantalla están limpios) · build de 21
páginas · en el HTML de los dos idiomas, las 4 imágenes en orden, con el ancho
correcto y los alts nuevos · luminancia de borde de las 5 piezas contra los dos
temas.

**La lección de la tanda: el método, no el parche.** La primera corrección del
mockup y el cover deformaba una captura para meterla en una pantalla en ángulo,
y dejaba tres defectos (fleco punteado, captura montada sobre el marco, última
línea cortada). **Se resolvió cambiando el método**: un mockup de celular que ya
viene con la captura adentro, y el desktop como captura plana con esquinas
redondeadas y sombra. Sin perspectiva, esa clase de defectos no existe. Está
escrito en `.claude/rules/imagenes.md` §1.1 como orden de preferencia.

**Detalles menores, sin bloquear:**

- **Las bandas de `03-paleta` quedan ~71px del borde**, con la zona segura en 80
  (§2). En el desktop más angosto, en el extremo del parallax, se les shavea
  3-4px de la esquina redondeada. A 1280 no pasa nada. Si se rehace, entran 10px.
- **Mirar `02-cluster` en la página, en tema oscuro.** El marrón da 58 de
  distancia al fondo: es la más cercana al oscuro de la serie. Probablemente se
  lea —además cambia el tono— pero no está visto.

✅ **Ritual — publicado y verificado en `d6e50eb` (2026-09-21)**, con la tanda **abierta** por el cover. Verificado contra el deploy: las 5 imágenes idénticas byte a byte a las del repo · en los dos idiomas, el copy nuevo completo y ninguna de las afirmaciones viejas · el desafío en dos párrafos · las 5 imágenes en orden y con alt · Pulso y Paseo sin cambios (el `split` del desafío no los tocó).

| Archivo | `type` | `slot` | Medida | Estado |
|---|---|---|---|---|
| `00-mockup.jpg` | `mockup` | `hero` | `2560×1097` (21:9), a sangre — **composición plana nueva**: home en desktop y en celular sobre hormigón, centrada (205 / 207px a 2×) | ✅ Cableada. El carrito dice 3 en el celular y 0 en el desktop: **es real y no se edita** (§1.1 de las rules) |
| `01-tira.jpg` | `long-strip` | `intro` | `2400×1350` (16:9), a sangre — **cuatro páginas distintas** (home, artista, catálogo, producto en mobile) sobre hormigón | ✅ Cableada |
| `02-cluster.jpg` | `screen-cluster` | `decisions` | `2400×1600`, sobre el cobre del logo `#C47D58` — el flujo real del botón: setup de *Comfortably Numb* → carrito con esos tres → checkout | ✅ Cableada |
| `03-diagrama.jpg` | `diagram` | `decisions` | `2400×1600` — la Stratocaster '60s, 1 documento, 11 canciones de 7 artistas | ✅ Cableada. Re-exportada: la tarjeta quedaba a 48px del borde y ahora está a 103 / 83 (zona segura 80). Se achicó **la tarjeta, no el contenido**: escalar todo al 90% bajaba los nombres de 70 a 63px |
| `04-paleta.jpg` | `palette` | `delivered` | `2400×1350` (16:9), formato sin tarjeta, fondo de valor medio (73) | ✅ Cableada |
| cover | — | — | `2400×1800` | ❌ **Texto inventado. Se queda por decisión de Tiago**, así que el hero se hizo aparte |

🚨 **La tanda NO está cerrada.** Por la regla de la propia tanda (arriba, punto 3), no cierra mientras el cover tenga texto inventado: *"los tonos legendarios de los **guionnates** más icónicos"*. **Queda como pendiente, no como resuelto.** Y en Ritual **el cover y el hero divergen**: el hero no pudo salir de la escena del cover sin heredar ese texto, que a sangre se lee sin zoom. La excepción está escrita en `.claude/rules/imagenes.md` §3.

Verificado en las cinco: texto real al 100% (la descripción de *Comfortably Numb* coincide palabra por palabra con la API; los precios del clúster, con el catálogo) · luminancia de borde (§4.2 de las rules) · build de 21 páginas, con las cinco en orden en los dos idiomas.

**El copy tenía afirmaciones falsas, y no se desactualizaron: nunca fueron ciertas.** Las escribió Claude chat al armar el caso, rellenando un hueco: Tiago había dicho que no recordaba cómo había resuelto el carrito, y en vez de preguntar se completó con una explicación técnica plausible. Es el mismo patrón que el ruteo de WhatsApp de Pulso. Contrastado contra la API en vivo, el frontend publicado y los dos repos:

| Dice | Es |
|---|---|
| `intro`: *"motor de búsqueda inversa… buscás por artista y canción"* | No hay buscador: se navega artista → canción |
| `challenge`: *"5–8 productos"* | Los setups tienen 2 o 3 |
| `challenge`: *"respetando stock"* | El stock no se valida en ningún lado, ni al agregar ni al comprar |
| `challenge`: *"sincronizando estado entre backend y Context API"* | El carrito vive solo en el Context; el backend se entera recién en el checkout |
| `decision_1`: endpoint que recibe un array de IDs y valida disponibilidad | No existe. El botón hace un `forEach` en el cliente |
| `decision_2`: *"David Gilmour y John Mayer"* | John Mayer no está en la demo |
| `closing`: *"el 90% de las queries"* | Inventado |
| `decision_3`: *"en vez de 50 artistas × 10 tonos"* · *"en vez de integrar Stripe"* | Inventado. El alcance fue 13 × 2 desde el principio; lo que se recortó fue el catálogo de equipos |
| `decision_3`: *"demostrar la transaccionalidad"* | Era la palabra del requisito de la materia y no describe el código: el backend guarda la orden tal como llega |

**Lo que sí es cierto**: 13 artistas con 2 canciones cada uno · canciones como subdocumentos del artista · el setup apunta por `ObjectId` a equipos compartidos · checkout simulado · 3 colecciones · todo en Vercel.

✅ **Copy reescrito y aplicado (2026-09-21)**, con dos fuentes: el código del botón y de los modelos, y lo que Tiago recuerda. Cada afirmación dice de cuál sale.
- **challenge** en dos párrafos: el benchmark real (Equipboard, YouTube, foros → *"la tienda tenía que ordenar el equipo por canción"*) y después el One-Click Setup.
- **decision_1**: por qué funcionan las llamadas seguidas (`setCart(prev => …)`). Que fue lo que más le costó es su recuerdo; el porqué lo prueba el código. Sin inventar cómo lo descubrió.
- **decision_2**: el Tube Screamer de Cerati y Stevie Ray Vaughan, y 26 canciones → 18 equipos.
- **closing**: las tres limitaciones reales, sin suavizar, y cómo las resolvería (como propuesta, no como algo hecho).
- **delivered_2**: sus decisiones de UI (interfaz oscura, naranja como color de acción). El logo lo generó con IA y **no se presenta como identidad diseñada por él**.
- Tagline a *"guitarrista"* en los dos idiomas (los 13 lo son) · `description` sin *"buscá artistas"* · la materia con su nombre original en los dos idiomas.

> 📌 **Lección**: cuando falta el dato, se pregunta. Un hueco en el copy se ve; una explicación técnica plausible y falsa no, y en una entrevista es lo primero que se repregunta.

**Pendiente que dejó P-4** — el link a un prototipo de Figma **no se renderea**. El campo `links.figma` está declarado en `types/index.ts` y documentado ahí, pero hoy ningún proyecto tiene uno y Tiago decidió no cablearlo por ahora. Si alguna vez se agrega, hacen falta **tres** cosas y ninguna avisa si falta:

1. el `push` a `linkItems` en `CaseStudyMetaBar.tsx` (hoy solo empuja `live`, `github` y `githubBack`),
2. la key `view_prototype` en los **dos** JSON — sugerido: *"Interactuar con el prototipo"* / *"Explore the prototype"*,
3. la URL real en el `links` del proyecto.

> Los `figma: undefined` que había en tres proyectos se borraron: eran idénticos a no tener la key.

### Marca
| ID | Tarea | Notas |
|---|---|---|

### Diseño
| ID | Tarea | Esfuerzo | Notas |
|---|---|---|---|
| **F3** | Tipografía principal nueva | 30 min | Reemplazar Space Grotesk + Geist. Opciones: Inter, Manrope, Satoshi, General Sans, Aeonik, Cabinet Grotesk. **Charlar el combo antes de codear.** Descartar de entrada las combinaciones que hoy se leen como default
de época: serif de alto contraste en display, mono en mayúscula para eyebrows, cursiva serif de acento en otro color. La paleta terracota
ya está decidida y no se toca, así que la tipografía es el eje donde diferenciarse. Toca `layout.tsx` + `@theme`. ✅ **Ya no arrastra la OG image**: al quedar sin texto dejó de depender de la tipografía (§6). Antes había que rehacerla o la miniatura quedaba con la fuente vieja. |
| **F4** | Unificar easing en cards | 15 min | Ocho transiciones usan `ease-out` (default de Tailwind) en vez de `ease-expo-out`, que es el token de marca y ya está en `globals.css:19`. `ProjectCard.tsx`: líneas 108, 140, 163, 168, 186, 196, 215 (la flecha, l. 228, sí usa el token). `CaseStudyNextNav.tsx`: línea 95. |

### Técnico
| ID | Tarea | Notas |
|---|---|---|
| **T4** 🔴 | **Proteger los endpoints de escritura de la API de El Ritual del Tono** — **es lo próximo que se hace** (decisión de Tiago, 2026-09-23) | Va **antes que los pendientes de imagen**: es el único problema que puede romperse solo, sin que nadie toque el portfolio. Plan completo abajo. |
| **T2** | Lighthouse audit real | Manual en DevTools. No hay números del bundle post-rework. |

#### 🔴 T4 — cómo arrancar la sesión

**Es en otro repo** (el backend de El Ritual del Tono), así que la sesión
empieza abriendo ese proyecto, no este.

**El problema, verificado el 2026-09-23**: `GET /products` responde 200 y una
ruta inexistente sigue devolviendo **500 con `"createError is not defined"`**,
o sea que el backend no se tocó desde que se documentó. `routes/products.js`
expone `POST`, `PUT` y `DELETE` **sin autenticación**. La demo está linkeada
desde el case study publicado: si alguien vacía el catálogo, el reclutador que
hace clic en "ver demo" encuentra una tienda vacía — y es lo mismo que se
captura para las imágenes del caso.

**El orden:**

1. **Mirar qué usa el frontend antes de tocar nada.** Hasta donde está
   documentado, solo hace `GET` de artistas y productos y `POST /orders`. Si
   es así, **las rutas de escritura de `/products` se pueden sacar del deploy**
   y no hace falta autenticar nada: es la solución más simple y la que no deja
   una API key que administrar.
2. **Si algo del front sí escribe**, entonces va una API key en un header,
   leída de una variable de entorno en Vercel, y el front la manda solo en esa
   llamada. Nunca hardcodeada en el repo, que es público.
3. **Arreglar el 500 de la ruta inexistente.** `createError` no está definido:
   o se importa, o se reemplaza por un `res.status(404).json(...)`. Hoy
   cualquier URL mal escrita devuelve un error de servidor con el nombre de una
   función adentro.
4. **Verificar sin romper nada**: `GET` a `/products` (tiene que seguir dando
   200), una ruta inexistente (tiene que dar 404 y no 500), y el flujo de la
   demo de punta a punta — artista → canción → carrito → checkout.
5. **Volver acá y cerrar T4**, con la fecha y qué se eligió de los dos caminos.

> ⚠️ **No probar la escritura contra la API en producción para "confirmar" que
> está abierta.** Un `POST` o un `DELETE` de prueba modifica el catálogo real
> que usa la demo publicada. La evidencia ya está en el código de
> `routes/products.js`; alcanza con leerlo.
| **T3** | ¿Mover `CLAUDE.md` y `AGENTS.md` a un `.docs/` privado? | Sigue abierta, y ahora con más motivo: el repo se queda público (abajo), así que estos archivos se leen desde afuera. Revisar también el `.gitignore`. |
| **E** | Easter egg · Vercel Analytics · dominio NIC.ar | Cuando haya ganas. |

---

## 9. ⚠️ Errores y aprendizajes — no repetir

### HTML, layout y accesibilidad
30. **No traces un logo a ojo: pedí el vector.** Se perdieron dos intentos dibujando la G a mano desde un PNG — uno como path relleno (las anchuras se iban solas y la mitad inferior quedaba como una mancha) y otro como `stroke` monolineal. Ninguno daba con la forma. El export de Illustrator la resolvió en un paso. **Si no hay vector, pedilo antes de empezar**; un logo "parecido pero mal" es peor que no cambiarlo.
31. **Para ver un SVG sin buildear, rasterizalo a ASCII.** Un scanline fill de 40 líneas en Python imprime la silueta en la terminal. Sirvió para descubrir que el remate en flecha estaba mal, algo que leyendo el `d` no se ve y que el build no reporta. **Corolario**: nunca edites coordenadas de un path a ciegas.
32. **Un export de Illustrator no entra tal cual al repo.** El de la G traía: un `<metadata>` con un manifiesto **C2PA de procedencia que puede pesar decenas de KB** — mucho más que el dibujo, que es un path de ~1 KB; un `<rect>` de 98.76×0.3 px en un tercer color (`#b77455`), una astilla para tapar una costura; el fill en `#c4663b` en vez del token `#C96A3A`; y el `<style>` con clases, que conviene pasar a atributo porque este SVG lo rendea satori. **Y el artboard tenía 50% de margen**: la marca salía al 36% del recorte de WhatsApp en vez del 50%. Se arregla con el `viewBox`, sin tocar coordenadas.

### Imágenes y mockups
33. **El texto adentro de un mockup tiene que ser una captura REAL, nunca generado.**
    Los dos primeros covers buenos (Pulso y Paseo) tenían el copy de la pantalla
    inventado: `SERVICIOS` salía `REMITIOOS`, `UBICACIÓN` salía `IWESCIÓN`, y el
    párrafo decía *"a paseo del cueʟeo Intóniico y la zona de bosar"*. Es la firma
    inconfundible de una imagen generada, y es **exactamente** el motivo por el que
    se dieron de baja las 31 imágenes anteriores (§10): en un portfolio de UX/UI,
    una interfaz con el copy inventado contradice el argumento del portfolio.

    **El proceso correcto**: capturar el sitio real (DevTools → *Capture full size
    screenshot*) y **componer** esa captura dentro de la pantalla del mockup en
    Figma. El marco del dispositivo, el fondo y la luz pueden ser generados; el
    contenido de la pantalla, no.

    ⚠️ **Y la parte que más cuesta**: esto pasó desapercibido en DOS revisiones
    mientras se medían rango tonal, contraste y proporciones con tres decimales.
    Un número verde no dice nada del contenido. **El control es abrir el export al
    100% y leer el texto más chico en voz alta**; si alguna palabra no existe, la
    imagen no sirve. Hacerlo ANTES de medir nada.

34. **`sr-only` es invisible pero SIGUE siendo seleccionable, así que duplica el
    copiado.** `SplitText` deja el texto dos veces en el DOM: una copia `sr-only`
    para lectores de pantalla y los chars visibles animados. Al seleccionar y
    copiar el lema del Hero, el portapapeles traía **cada línea repetida**:
    *"Diseñar experiencias con empatía.Diseñar experiencias con empatía."*.

    Se arregla con **`select-none` en la copia `sr-only`**: `user-select: none`
    la saca de la selección sin sacarla del árbol de accesibilidad, así que el
    lector de pantalla la sigue leyendo y el portapapeles no. Vale para cualquier
    patrón que duplique texto por accesibilidad, no solo para SplitText.

    ⚠️ **Ningún build, linter ni auditoría de a11y lo detecta**: el HTML es
    correcto y el texto accesible también. Solo se ve copiando y pegando.

35. **Una imagen se juzga al 100% Y al tamaño en que se muestra.**
    **Las dos revisiones hacen falta y son distintas**: al 100% se controla el
    CONTENIDO (que el texto exista, que no haya artefactos); al tamaño de render
    se controla el IMPACTO (qué se lee de verdad, si algo molesta).

    ⚠️ **Esta lección estaba mal escrita y produjo el incidente de los covers.**
    Decía que el texto generado de los covers se había "declarado bloqueante"
    por error, porque a 628px mide 3-4px y no se ve, y que *"un problema real al
    100% puede ser irrelevante a 628px"*. Con eso se publicaron. Fue el error:
    **el texto inventado se lee con zoom, y el mismo mockup va a sangre en el
    hero**. El tamaño de render sirve para decidir si algo molesta, nunca para
    habilitar un texto que no existe (`.claude/rules/imagenes.md` §1.1).

    Para renderizar al tamaño real, `sharp` alcanza:
    `sharp(f).resize(628, 471)` para una card ancha, `resize(330)` para simular
    una imagen de case study en celular.

### Proceso de trabajo
19. **Una tarea por sesión.** Si aparece algo nuevo en el medio: "lo apunto para después, ¿seguimos con esto?".
20. **No modificar data unilateralmente** por lo que diga este archivo. Si hay contradicción entre CLAUDE.md y el código, **flagearla y pedir decisión**.
21. **Mirar todas las referencias visuales antes de proponer un plan.** Son targets explícitos, no decoración.

---

## 10. Stack y estructura

**Next.js 16 (App Router + Turbopack) · React 19 · TypeScript · Tailwind v4 (sin config, `@theme` en globals.css) · Framer Motion · next-intl · next-themes · Lenis · lucide-react · simple-icons**

```
src/
├── app/
│   ├── icon.svg                        # favicon: la "G" de Gotya (file convention)
│   └── [locale]/
│       ├── layout.tsx                  # fonts, providers, metadata + OG
│       ├── page.tsx                    # ensambla el home
│       ├── globals.css                 # @theme + CSS vars + keyframes
│       ├── opengraph-image.tsx         # PNG de marca 1200x630
│       └── projects/[slug]/page.tsx    # case study (server component)
├── components/
│   ├── case-study/   # Header · MetaBar · Section · Image · ImageRun · NextNav
│   │                 # + imageSpec.ts (type -> ancho/recorte/sizes)
│   ├── sections/     # Hero · ServicesMarquee · Projects · ProjectCard ·
│   │                 # About · Stack · Contact
│   └── ui/           # Navbar · NameLogo · NavLogo · MarqueeLink · Footer ·
│                     # CustomCursor · SplitText · MagneticLink · StackIcon ·
│                     # InteractiveDotGrid · LanguageToggle · SmoothScrollProvider ·
│                     # SkipLink
├── data/             # projects.ts · stack.ts
├── hooks/            # useCursor · useMagneticHover
├── i18n/request.ts   # config de next-intl
├── messages/         # es.json · en.json
├── proxy.ts          # ⚠️ el "middleware" de Next 16 — locale detection
└── types/index.ts    # Project · StackItem · Locale ·
                      # CaseStudyImageBrief/Type/Slot
```

**Imágenes**: `public/images/covers/{slug}-cover.*` (cards del home) · `public/images/case-study/{slug}/{nn}-{nombre}.*` — el número es el orden, el nombre es el tipo de pieza (`mockup`, `tira`, `cluster`…), nunca la sección. 📋 **Las medidas, el vocabulario de tipos y la dirección de arte están en `.claude/rules/imagenes.md`** — no improvisar tamaños acá. Nada más va en `public/`: **todo lo que está ahí se sirve en producción** (ver §11).

> **Hoy hay 21 imágenes en el repo**: los 4 covers del home (solo el de Ritual con texto inventado) + las 5 de Pulso + las 4 de Paseo + las 5 de Ritual + las 3 de FutbolTalent. Ya no queda ninguna provisoria. Los 3 covers restantes y las imágenes de los otros case studies todavía no existen: su `coverImage` es `null` y sus `imageBriefs` no tienen `src`.

> ⚠️ **Antes de estas hubo 31 que se dieron de baja de una sola vez** (7 covers + 24 de case study). Eran provisorias y se leían como generadas con IA: en un portfolio de UX/UI una imagen que parece IA contradice el argumento del portfolio más fuerte de lo que un hueco lo debilita. Es el motivo por el que existe la regla de la captura real (`.claude/rules/imagenes.md` §1.1).

> **Cómo volver a ponerlas, de a una**: subís el archivo a la ruta que corresponde y le agregás el `src` al brief (o el `coverImage` al proyecto). **No hace falta tocar ningún componente** — `ProjectCard` envuelve el cover en `{project.coverImage && …}` y la page rendea cada `CaseStudyImage` solo si el brief tiene `src`.
>
> ```ts
> // Cover — en el entry del proyecto:
> coverImage: '/images/covers/pulso-creativo-cover.jpg',
>
> // Case study — un brief nuevo en imageBriefs. No hay cantidad fija:
> // agregás los que hagan falta y `type` + `slot` deciden todo lo demás.
> {
>   type: 'long-strip',                     // que es -> ancho y recorte
>   slot: 'intro',                          // donde cae en la pagina
>   frame: { width: 1440, height: 810 },    // solo tipos sin recorte: su proporcion real
>   alt: { es: '…', en: '…' },
>   src: '/images/case-study/pulso-creativo/01-tira.jpg',
> },
> ```
>
> ⚠️ La extensión tiene que ser la **real** del archivo (`.jpg` / `.png`), no `.webp`: el WebP lo genera Next al vuelo y no existe en el repo.
>
> 📋 La **dirección de arte**, las medidas y qué significa cada `type` están en `.claude/rules/imagenes.md`; el orden de prioridad, en §8.

> **Por qué no quedaron los placeholders "BUILDING"**: sin las imágenes, esas cajas punteadas aparecían **28 veces** (con la cuota vieja de 4 × 7 case studies) y convertían el sitio en una obra en construcción — otra señal negativa, y encima el texto está hardcodeado en inglés también en la versión ES. El componente sigue soportando el modo placeholder; simplemente no se usa mientras falten las imágenes.
Los covers **no llevan texto propio** (la card superpone el nombre y la categoría en hover) y **en reposo se ven a color y al 100%** — ya no van desaturados. Las reglas completas están en `.claude/rules/imagenes.md`.

> **Todas las imágenes pasan por `next/image`** (D3, hecho). Los tres puntos donde se rendean son `ProjectCard` (cover, modo `fill`), `CaseStudyNextNav` (thumb, modo `fill`) y `CaseStudyImage` (modo `width`/`height`, porque en mobile la imagen va en flujo normal y `fill` la pondría absolute siempre; el `long-strip` además no tiene un alto que `fill` pudiera llenar). La **única** excepción es el `<img>` de `opengraph-image.tsx`, que rendea satori y no el browser — tiene su `eslint-disable` con el porqué al lado.

**Íconos**: `lucide-react` para UI · `simple-icons` para marcas del Stack · Adobe como cuadrados con iniciales. El Footer ya no usa SVGs de marca: sus links son mono + glifo (↗ navega, ↓ descarga). Para sumar uno nuevo, editar `SIMPLE_ICONS`, `LUCIDE_ICONS` o `ADOBE_INITIALS` en `StackIcon.tsx`. Todo monocromo con `currentColor`.

---

## 11. Referencias visuales

**Regla**: identificar la idea concreta a replicar (un patrón, una proporción, una micro-interacción), **no copiar pixel-perfect**.

**Portfolios premium**: [isadeburgh](https://isadeburgh.com/) (el "Get in touch" que rota y frena en hover — ya replicado en `MarqueeLink`; y su footer, de donde salió el bloque de cierre unificado: micro-label sobre el mail, botón copiar y barra de tres zonas. **No** se copió el estilo dibujado a mano, ni el serif del mail — sin serif en el stack, el contraste lo da Geist Mono —, ni el wordmark gigante de remate, que se probó y se descartó) · [artemiilebedev](https://artemiilebedev.com/) · [louispaquet](https://louispaquet.com/)

**Case studies Awwwards** (copy super corta en todos, sidebar de metadata, tipografía protagonista): [mikekus](https://mikekus.com/) · [joonassandell](https://joonassandell.com/) · [henriheymans](https://henriheymans.com/) · [silviasguotti](https://silviasguotti.design/) · [alejandromejias](https://www.alejandromejias.com.au/) · [yaremenko](https://yaremenko.design/) · (https://abhishekjha.me/?ref=lapaninja)

**Ya no hay screenshots de referencia en el repo.** Los últimos cuatro (`navbarshrink_reference` y variantes) se borraron: describían el navbar que se achica con el scroll, algo ya resuelto con el handoff sticky NameLogo → NavLogo. Antes de eso, esta sección listaba otras nueve (`hero_reference`, `about_reference2`, `casestudy_reference`, etc.) que hacía rato no existían.

> ⚠️ **Si volvés a sumar refs visuales, NO las pongas en `public/`.** Ahí Next las sirve en producción: las cuatro anteriores eran navegables en `tiagocollado.vercel.app/images/references/*.png` (verificado, HTTP 200) y sumaban 2,6 MB al deploy sin que las usara ningún código. Van fuera de `public/` y, si no aportan al portfolio, directamente fuera del repo.

> Las decisiones de diseño que salieron de esas referencias ya están escritas en §6 y en `.claude/rules/imagenes.md`, así que no hay nada que recuperar. Si alguna hiciera falta, sigue en el historial: `git show <sha>:public/images/references/<archivo>`.

---

## 12. Workflow y comunicación

- **Dev**: `npm run dev` (localhost:3000) · **Build**: `npm run build` · **Deploy**: automático en push a `main`.
- **Proyecto nuevo**: entry en `src/data/projects.ts` + bloque `case_study_{slug}` en **ambos** JSON.
- **Commits**: los hace Tiago desde su terminal para mantener la autoría. Claude prepara los cambios y le pasa los comandos.

**Estilo de comunicación esperado**:
- Directo, sin condescendencia. Honesto cuando algo está mal, incluido señalar decisiones dudosas de copy o de diseño.
- Explicar el *por qué*, no solo el *qué*. Paso a paso cuando el código es complejo.
- Preguntar antes de asumir cuando falta info sobre un proyecto, un rol o una decisión.
- Claridad de código por encima de cleverness.

@.claude/rules/imagenes.md
@.claude/rules/design-tokens.md
@.claude/rules/stack-traps.md
