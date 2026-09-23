@AGENTS.md
# Portfolio Tiago Collado — marca **Gotya**

> **Cómo usar este archivo**: las reglas de diseño, la ley UX y el NDA
> son obligatorias. El resto es contexto del proyecto. Lo que falta hacer
> está en la sección "Qué falta hacer". El historial vive en `git log`.
> Las trampas del stack y los tokens de diseño están importados al final.
>
> **Qué va acá y qué no**: se queda la regla y el ejemplo que la hace
> entender. El relato de cómo se llegó a ella va al mensaje del commit. Una
> tarea cerrada se borra de §8: `git log` ya la tiene.

---

## 2. 🎨 Reglas de diseño

### Imágenes

📋 **Todas las reglas de imagen viven en `.claude/rules/imagenes.md`**, que se
importa al final de este archivo: vocabulario de tipos, medidas de cada frame,
dirección de arte de los covers, la regla de comprensión a 330px, exportación y
naming. **No dupliques medidas ni reglas de arte acá.**

Lo único que se queda en este archivo, porque es estructura y no arte:

| | |
|---|---|
| Forma de la card del home | `cardShape` en `src/data/projects.ts` (`wide` 4:3 · `square` 1:1). La grilla es masonry, así que la card tiene el aspect exacto de su imagen y no recorta nada |
| Qué imágenes tiene un case study | `imageBriefs` en `src/data/projects.ts`. **Sin cantidad fija**: cada brief declara su `type` (qué es) y su `slot` (dónde cae) |
| Traducción de `type` a layout | `src/components/case-study/imageSpec.ts` |


## 4. 🔒 Confidencialidad y NDA — FutbolTalent

**REGLA ESTRICTA. Leer antes de tocar texto, imagen o metadata de `futbol-talent-pro`.**

- **Qué no se cuenta del producto**, en ningún lugar del repo —`case_study_futbol-talent-pro` en los dos JSON, el entry en `projects.ts` (tagline, description, metadata, alts), los comentarios del código y esta documentación—: cómo genera ingresos, quién lo financia o lo dirige, con qué tecnología está construido, qué flujos restringen el acceso o buscan retener usuarios, ni métricas internas, incluidos números que impliquen escala del producto.
- **La prueba, antes de escribir o commitear**: ¿esta frase le cuenta a alguien de afuera algo del negocio, de la empresa o de la tecnología del producto que no se ve en un wireframe? Si sí, no va, use las palabras que use. Por eso la regla es un criterio y no una lista de palabras: una lista ataja esas palabras y deja pasar sus sinónimos, y publicada en un repo público revela justo lo que protege.
- **Tampoco se explica lo que se sacó.** Describir qué se recortó de una imagen o de un texto por el NDA es contarlo igual. Se dice *"se recortaron nodos que §4 deja afuera"*, nunca cuáles ni qué hacían.
- **Framing obligatorio**: siempre **MVP validado técnicamente**, con eje en **arquitectura de información** y **reducción de carga cognitiva**.
- **NO ocultar** `metadata.client` (`FutbolTalent.Pro`), el `title` ni el `slug`: el vínculo laboral ya es público y el NDA no lo restringe.
- **Material permitido**: wireframes de baja/media, flujos, design system, user personas. **Nunca** pantallas finales del producto. Vale igual para cualquier imagen nueva, incluidas las versiones "Marca Blanca".

> ⚠️ Los `alt` de los `imageBriefs` también cuentan: son el brief con el que se diseña la imagen. El de `01` decía *"Pantalla de plataforma móvil"* — o sea, pedía justo el material prohibido. **Al escribir un brief nuevo para FTP, revisar que el alt no prometa producto real.**

**Tono general del copy**: directo, sin narrativas forzadas de Silicon Valley. La confidencialidad se menciona solo dentro del case study de FTP, nunca en el About.

---

## 5. Sobre Tiago y la marca

**Tiago Collado** · Estudiante avanzado de Lic. en Tecnología Multimedial (Universidad Maimónides) · perfil híbrido UX/UI Designer + Frontend Developer, más fuerte en diseño que en programación.
**Target**: reclutadores de equipos de producto, de pymes a corporaciones, donde se valore diseño y ejecución técnica.
**Contacto**: tiago.collado@gmail.com · [LinkedIn](https://www.linkedin.com/in/tiagocollado/) · [GitHub](https://github.com/tiagocollado)

### Marca: Gotya by Tiago Collado
- Wordmark **GOTYA** en mayúscula (Hero gigante + navbar). "by Tiago Collado" solo en footer, firma del About y metadata.
- Lema — ES: *"Diseñar experiencias con empatía. / Crearlas con precisión."* · EN: *"Designing experiences with empathy. / Building them with precision."*
- **Voz: primera persona en todo el sitio.** Gotya es el nombre comercial, no un "nosotros". Sin excepciones: el label de la grilla es `PROYECTOS` / `PROJECTS` (mismo nombre que el nav y que el ancla `#projects`), nunca *"nuestros clientes"*.

### ⚠️ Nivel técnico
Tiago sigue estudiando y la programación no es su fuerte. **El código tiene que ser lo más entendible posible**: claridad sobre abstracciones avanzadas, y siempre explicar el *por qué* de las decisiones técnicas.

### Identidad visual
- **Accent**: terracota `#C96A3A` (hover `#B05A2E`)
- **Light**: bg `#EDE2CD` · surface `#F4EAD5` · ink `#111110`
- **Dark**: bg `#111110` · ink `#F0EDE8` — **es el tema por defecto**
- **Símbolo**: la "G" de Gotya en `src/app/icon.svg` — **vector real exportado de Illustrator**, un único path relleno. Chaflán hexagonal a la izquierda, esquina superior derecha redondeada y una diagonal que sube apuntando al codo de la transversal: esa es la flecha. Su `viewBox` está recortado respecto del artboard original (§6).
- **Radius** 12px cards / 999px pills · **Easing** `cubic-bezier(0.16, 1, 0.3, 1)`
- **Tipografía**: Space Grotesk (display) + Geist (body) + Geist Mono (labels) → *pendiente de reemplazo, ver F3*
- Concepto: "minimalismo técnico pero cálido".

---

## 6. Estado actual — qué existe hoy

**Deploy**: https://tiagocollado.vercel.app/ · cada push a `main` redeploya. Build de referencia: **15 páginas SSG** (los 3 proyectos no publicados no se buildean, §8), TS limpio, sin warnings.

**Defaults**: tema **dark**, locale **`en`** (`/` redirige a `/en`; las URLs `/es/...` siguen vivas).

**Capa "frontend creativo"**: Lenis smooth scroll (con reset de scroll en cambio de ruta) · custom cursor dot+ring con variants `default | link | view | drag` · SplitText char reveal · magnetic hover + `<MagneticLink>` · grain SVG global · scrollbar custom terracota · `<MotionConfig reducedMotion="user">` global.

**Home**: Navbar `h-16` fijo (NavLogo izq · links centrados · LanguageToggle + tema der · hamburger en `<lg`) · Hero con NameLogo GOTYA sticky que achica con el scroll y hace handoff al navbar, lema en dos líneas, CTA magnético con chevrons e `InteractiveDotGrid` · ServicesMarquee con fondo invertido · grilla masonry de proyectos (2 columnas, 4 cards, covers a sangre sin texto) · About 4.0 (micro-labels, claim con bold, copy a la derecha, firma) · Stack con carrusel infinito · **bloque de cierre unificado** (ver abajo).

**Bloque de cierre** (Contact + Footer): se leen como una sola pieza. Contact no cierra su padding inferior y el Footer arranca pegado, sin `border-t` entre medio. Contact lleva el micro-label, una **pregunta corta sin párrafo de body** (quien llega acá ya hizo click en "Hablemos": viene con intención, no hay que volver a venderle), el mail en **mono grande** con botón de copiar al portapapeles, y los 4 canales (LinkedIn / GitHub / WhatsApp / CV). El Footer es una única barra de tres zonas: copyright · back-to-top · crédito. **En mobile (`<sm`) esa barra pasa a 2 columnas**: copyright y crédito apilados a la izquierda, back-to-top a la derecha abarcando las dos filas (`row-span-2`) y centrado contra ellas — la mitad derecha es la zona de menor costo motor para el pulgar (Fitts). Las posiciones van explícitas (`col-start`/`row-start`) y se resetean con `sm:*-auto`, porque el orden del DOM es copyright → botón → crédito y el auto-placement pondría el crédito en el lugar equivocado.

> El bloque va dentro de un `<div className="min-h-screen flex flex-col justify-between">` en `page.tsx`: al entrar por el ancla `#contact` ocupa exactamente una pantalla, con la barra del footer pegada abajo.

> ⚠️ **`role="contentinfo"` en el `<footer>` no es redundante.** `layout.tsx` envuelve todo en `<main className="pt-16">`, y un `<footer>` descendiente de `<main>` pierde el landmark por spec. Si se saca el atributo, el landmark desaparece y no lo avisa ni el build ni el linter (`.claude/rules/stack-traps.md`).

**Cards de proyecto**: en reposo son SOLO la imagen del cover, a sangre y sin una
palabra encima. En hover el lavado terracota **barre de izquierda a derecha**
(`scale-x` con `origin-left`, no un fade) y después entran nombre, "VER PROYECTO",
categoría y las escuadras de las 4 esquinas.

> ⚠️ **En táctil no hay hover, así que no hay lavado**: el nombre y la categoría
> van DEBAJO de la card como texto normal. Se decide por `(hover: none)` y no por
> ancho de pantalla, porque una tablet en horizontal es ancha y tampoco tiene hover.

**El `<Footer />` cierra el home Y los cuatro case studies publicados.** El cierre del case study es `CaseStudyNextNav` + `Footer`: al pie de un case study largo hace falta el camino de vuelta arriba.

> ⚠️ **`id="top"` es requisito, no detalle.** El back-to-top es un `<a href="#top">`; toda página que renderee el `<Footer />` necesita ese id o el botón queda **muerto sin dar ningún error** — el build pasa, no hay warning, simplemente no scrollea. Hoy vive en el `<section>` del Hero (home) y en el `<div>` raíz del case study.

**Cierre del case study**: el "Próximo proyecto" **cicla solo entre los publicados**, en el orden del home (`order`), y el último vuelve al primero: hoy Paseo → Pulso → FutbolTalent → Ritual → Paseo. Sale de `publishedProjects`, la misma lista que la grilla, así que no pueden divergir. El pill "Ver todos los proyectos" lleva a `/{locale}#projects`, la grilla del home, hasta que exista la página de V2. Los dos paths van en **una sola fila** desde `md+` — pill ghost "Ver todos los proyectos" en columna `auto` a la izquierda, card "Próximo proyecto" en `1fr` a la derecha. La card es el CTA primario inequívoco (tamaño, fondo, thumbnail, glow en hover); la pill no compite (Hick). La card va **primero en el DOM** y las columnas se cruzan con `md:order-*`: así el apilado en mobile sale correcto sin `order`, y el primario encabeza el orden de tabulación.

**Back-to-top**: `<a href="#top">` con el `id="top"` en el `<section>` del Hero. Lenis monta con `anchors: true`, así que lo intercepta y hace el scroll suave él. Nunca `window.scrollTo`: pelearía contra su animación. Las dos flechas apiladas suben en loop mientras hay hover.

**Case studies** (los 4 publicados; los otros 3 siguen en el repo con `published: false`, §7): **secuencia vertical de bloques hermanos**, cada uno declarando su propio ancho — barra de metadata (Cliente / Año / Rol / Duración / Equipo / Stack / NDA / Links; **en mobile va debajo del intro**, para que la primera pantalla sea la frase que explica el proyecto y no su duración) + hero a sangre + 5 secciones editoriales — **Intro → El desafío → Cómo lo resolví → Lo entregado → Cierre** — con tiradas de imágenes entre medio. Componentes en `src/components/case-study/`.

> **Por qué bloques hermanos y no una grilla con sidebar.** Una imagen solo puede ir a sangre si su bloque elige su propio ancho: dentro de una columna compartida queda atada a ella. Hoy el texto vive en un shell de 1280 y **solo `mockup` y `long-strip` salen del shell**.

**El ancho de una imagen lo decide su `type`, no el componente ni el `slot`.** `mockup` (el hero) y `long-strip` van a sangre (viewport completo, sin recorte, sin parallax, radio 0); el resto va al shell de 1280. La traducción de tipo a layout está en `src/components/case-study/imageSpec.ts` y el arte en `.claude/rules/imagenes.md`.

> ⚠️ **`sizes` sale del ancho real y hay que moverlo con él.** Si el shell cambia de ancho, el `sizes` de `imageSpec.ts` se mueve en la misma pasada. Sin `sizes` correcto, `next/image` no sirve de nada.

**Convención de contenido**: un case study real necesita 12 keys de TEXTO en ambos JSON (`intro`, `challenge`, `decision_1-3_title/body`, `delivered_1-3`, `closing`). La key **`process`** es opcional (bajada de "Cómo lo resolví") y se carga con `t.has()`. Si falta una obligatoria, el catch deja `hasCaseStudy: false` y el cuerpo no se renderea.

> **`challenge` admite varios párrafos**, separados por una línea en blanco (`\n\n` en el JSON). La page lo parte y rendea un `<p>` por párrafo con `space-y-6`; sin línea en blanco sale un solo párrafo. Hace falta porque HTML colapsa los saltos de línea: un `\n\n` adentro de un único `<p>` se ve como un espacio. Hoy solo lo usa Ritual (problema de producto + problema técnico). **Las demás keys siguen siendo de un solo párrafo**: si otra lo necesita, se le agrega el mismo `split`.

**Imágenes de case study**: **no hay cantidad fija** — cada proyecto usa los tipos que necesita, pueden ser 2 o 6. Cada brief declara `type` (qué es: `mockup` · `long-strip` · `screen-cluster` · `palette` · `diagram` · `detail`) y `slot` (dónde cae: `hero` · `intro` · `challenge` · `decisions` · `delivered` · `end`). La page recorre el array por `slot`. **Varias imágenes pueden compartir `slot`**: eso es lo que da los grupos de 2-3 seguidas sin texto entre medio.

En mobile se ven completas y quietas (sin crop ni parallax); el recorte y el parallax arrancan en `md+`, y `mockup` y `long-strip` no llevan ninguno de los dos en ningún breakpoint. No tienen hover ni cursor custom porque no abren nada — **por eso la regla de rango tonal ≥120 no les aplica**: existe para que se perciba el duotono del hover de las cards.

**Open Graph**: `src/app/[locale]/opengraph-image.tsx` genera un PNG 1200×630 en build time: **solo la marca G centrada** sobre el fondo oscuro, **sin texto**. Al vivir en el segmento `[locale]` aplica también a `/projects/[slug]`: compartir cualquier link muestra la marca, no una captura del proyecto.

> **Por qué sin texto.** WhatsApp (y varios clientes de chat) no muestran la card ancha: **recortan un cuadrado del centro**, y un texto alineado a la izquierda queda cortado e ilegible. Una marca centrada sobrevive cualquier recorte. Sin texto, además, la imagen no depende de la tipografía (F3 no la toca) ni duplica el lema, que vive solo en los JSON.

> El SVG se lee de `src/app/icon.svg` — **el mismo archivo que el favicon**, no una copia. Cambiar el logotipo actualiza las dos cosas a la vez. Va como data URI en un `<img>` porque es lo que satori soporta de forma confiable.

> ⚠️ Las dos imágenes (`es` / `en`) son **idénticas byte a byte, a propósito**: sin texto no hay nada que localizar. En `stack-traps.md` eso figura como síntoma de bug; acá no lo es.

> Medidas reales, verificadas decodificando el PNG: el `<img>` es de 460px pero la **tinta** mide 315×314 (el `icon.svg` tiene su propio encuadre interno), o sea **~50% del cuadro que recorta WhatsApp**, que es el objetivo. El centro de la tinta cae a 2px del centro del lienzo. **Si se toca el path de `icon.svg`, volver a medir**: el encuadre se ajusta con el `viewBox`, no moviendo coordenadas.

**i18n**: next-intl con paridad total ES/EN (17 namespaces). **Regla**: toda key nueva va en los dos archivos.

**Accesibilidad** (auditado sobre el HTML generado, no sobre el código):
- Un solo `<main>`, `<nav>`, `<header>` y `<footer>` por página · `lang` correcto por locale · **cero imágenes sin `alt`** · `aria-label` en todos los controles de solo ícono.

> **Lo que hay que sostener es el cero sin `alt`, no una cifra**: los conteos cambian con cada tanda. **El `alt` vacío de los covers y del thumbnail de "próximo proyecto" es deliberado**: son decorativos y el texto que los nombra ya está en el DOM, así que un alt descriptivo los haría anunciar dos veces.
- **Nada suprime el focus ring del browser**, así que el foco de teclado se ve en todo. La única excepción es `<main>`, que lo suprime a propósito: recibe foco solo por script desde el skip link, y un contorno alrededor de toda la página se lee como un bug. **No agregar más excepciones.**
- El cursor custom **no** oculta el nativo (no hay ninguna regla `cursor: none`), así que no interfiere con el foco.
- **Skip link** (`SkipLink.tsx`): primer elemento focusable, invisible hasta recibir foco. Es un client component con `onClick` + `preventDefault` en vez de un `<a href="#main">` pelado, porque Lenis intercepta las anclas y puede comerse el movimiento de foco nativo — que acá es lo único que importa, ya que `<main>` arranca al tope y no hay nada que scrollear.
- **Jerarquía de headings**: el case study da `h1 → h2 → h3` sin saltos. Ojo: el label de `CaseStudySection` es un **`<h2>` que se ve como micro-label**. El tamaño chico es decisión visual, no jerárquica — **no lo devuelvas a `<p>`**: el outline quedaría `h1 → h3`.

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

**Los 4 del home son los que mejor muestran rango.** Ritual es universitario y **se queda en el home porque es el único full-stack con demo en vivo** (decisión de Tiago, 2026-09-21).

La grilla es **masonry**: `Projects.tsx` rendea dos columnas `flex-col`
independientes y reparte los proyectos **alternando** — el 1 y el 3 a la
izquierda, el 2 y el 4 a la derecha.

| Columna | Proyectos | Alto |
|---|---|---|
| izquierda | Paseo Güemes (ancha) · FutbolTalent.Pro (ancha) | 966px |
| derecha | Pulso Creativo (**cuadrada**) · El Ritual del Tono (ancha) | 1123px |

**Las columnas terminan a distinta altura a propósito.** Eso es lo que la hace
masonry: una grilla con `grid-auto-rows` + `row-span` alinea las filas y se lee
como una grilla común.

**Orden de lectura en mobile**: alternar deja 1·3·2·4 al apilarse, porque ese es
el orden del DOM. Se arregla con `display: contents` en las columnas abajo de
`md`: los `<div>` desaparecen del layout, las 4 cards pasan a ser hijas directas
del grid y el `order` de cada una las ordena 1·2·3·4. En desktop las columnas
vuelven a `flex` y el `order` no molesta.

**Fuera del portfolio**: Retro Kicks, Govah, SoundCloud Redesign, Rick & Morty Explorer.

**Regla**: salvo que se diga "académico" o "universitario", se asume que el proyecto es real. Hoy hay **dos** flageados como universitarios, con el mismo formato en `metadata.client` (`Proyecto universitario · Maimónides`): **Recuérdalo** y **El Ritual del Tono**.

> ⚠️ **Antes de rotular un proyecto, mirar si el sitio publicado dice de dónde salió.** Ritual figuró como "Proyecto personal" hasta que se vio que la página About de su propia demo lo presenta como trabajo de la materia.

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

1. **`services` lleva CATEGORÍAS, nunca roles.** "Diseño Web", "Aplicaciones Móviles", "Design System", "Branding" — jamás "Diseño UX/UI", "Full-stack" ni "WordPress". Eso describe *cómo* se hizo y vive en `role` y en `stack`.
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

> **Herramientas propias**: no nombrar los temas de WordPress que usa (decisión de Tiago). En la copy va "un tema liviano" y el porqué de la elección. Elementor, WPForms, Rank Math y LiteSpeed sí se pueden nombrar **en el cuerpo del case study**, pero **no van en `metadata.stack`**: ese campo queda en lo core (`Figma · WordPress`), porque una lista de plugins en la barra de metadata tapa la herramienta que importa.

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

> ⚠️ **Despublicar tiene dos trampas que no avisan nada**, las dos en
> `.claude/rules/stack-traps.md`: sacar un slug de `generateStaticParams` no da
> 404 (hace falta `dynamicParams = false`), y ocultar una página no saca su
> copy ni sus datos del código fuente (el layout filtra los bloques
> `case_study_*` y el home le pasa los proyectos a `Projects.tsx` como prop).

| ID | Tarea | Notas |
|---|---|---|
| **V2** ⏳ | **Versión siguiente: página de todos los proyectos + Multibrand, Recuérdalo y Cabify** | **Recuérdalo primero**, porque es el que más prueba investigación UX. Cada uno vuelve con una tanda completa (vocabulario de imágenes, cover, pasada de hechos del copy) y recién ahí pasa a `published: true`. La página `/projects`: ⚠️ **`id="top"` obligatorio** en el div raíz (renderea el `<Footer />`), y al crearla hay que apuntar ahí el pill "Ver todos los proyectos" de `CaseStudyNextNav` (hoy va a `/{locale}#projects`, la grilla del home) y volver a poner el link del header de `Projects.tsx` (la key `projects.view_all` sigue en los dos JSON, y en el componente quedó un comentario en el lugar exacto donde iba). El conteo del build cambia con cada uno: hoy son **15 páginas**; cada proyecto publicado suma 2 y la página de proyectos suma 2 |

### 🔓 El repositorio es público — decisión tomada, no un pendiente

**Decisión de Tiago (2026-09-22): el repo se queda público.** No vuelve a
aparecer como tarea ni se trata como un descuido. Lo que sigue es el riesgo
asumido, escrito para que nadie lo redescubra y lo abra de nuevo:

- **El historial conserva el material de FutbolTalent que se purgó de HEAD.**
  La purga (`f9ba5af`) y el borrado de las imágenes limpiaron el sitio, no
  `git log`. Siguen accesibles sin autenticarse: el copy original con todo lo
  que §4 prohíbe (`d742a14`), y **las 4 imágenes con UI real del producto** en
  `196e39c`, descargables por `raw.githubusercontent.com`.
- **Esta misma documentación es pública**, así que §4 rige para ella igual que
  para el copy: lo que no se puede decir en el sitio tampoco se escribe acá, ni
  en un comentario del código. Las versiones anteriores de este archivo, que
  sí lo decían, siguen en el historial por el mismo motivo que el punto de
  arriba.
- **Sacarlo después no alcanza**: GitHub sirve los commits viejos por SHA
  aunque se reescriba el historial, y reescribir necesita `git-filter-repo`,
  que no está instalado, más un push forzado.

> ⚠️ **Lo que esto implica para el trabajo diario**: todo lo que se commitea es
> público desde el primer push, así que el control de NDA se hace **antes** de
> commitear, no después. Un archivo en `public/` se sirve en producción y
> además queda en el historial para siempre.

### 🎸 El cover de Ritual se queda — decisión tomada, no un pendiente

**Decisión de Tiago (2026-09-23): el cover de El Ritual del Tono se publica
con el texto inventado que tiene en la pantalla** (*"los tonos legendarios de
los **guionnates** más icónicos"*). No vuelve a aparecer como tarea, y **la
tanda de Ritual está cerrada**. Es la única excepción a la regla de la tanda
(abajo) y a `.claude/rules/imagenes.md` §1.1.

Lo que sigue es el riesgo asumido, escrito para que nadie lo redescubra y lo
abra de nuevo:

- **El motivo**: el texto es tan chico que al tamaño de la card no se lee ni
  se detecta.
- **Lo que la regla advierte y se acepta**: con zoom sí se lee. Pellizcar en
  el celular amplía la variante 2× que sirve `next/image`.
- **Lo que no aplica acá**: el otro riesgo de §1.1, que el mismo mockup vaya a
  sangre en el hero. En Ritual el hero es una composición nueva, con captura
  real (`.claude/rules/imagenes.md` §3), así que el texto inventado vive solo
  en la card.

> ⚠️ **No sienta precedente.** Para cualquier otro cover —incluidos los de
> V2— la regla de §1.1 sigue entera: texto real o no se publica.

### 🚦 Orden para cerrar esta versión (decisión de Tiago, 2026-09-23)

Los 4 case studies están publicados con sus imágenes. Lo que queda son
arreglos sobre lo ya publicado, en este orden:

| | Tarea | Dónde está el detalle |
|---|---|---|
| 2 | **El diagrama de Pulso** — reemplazarlo por una captura de su página de contacto | *"Pulso"*, punto 8. Arrastra el punto 5 y menciones en §1.2, §2, §4.1, §4.2 y §5 de las rules |
| 3 | **La tira de Pulso** — columnas más grandes, con el criterio de la de Paseo | *"Pulso"*, punto 4 |
| 4 | **Las etiquetas del `02-cluster` de FutbolTalent** | *"FutbolTalent"*, abajo. Cosmético |

Con esos cuatro, la versión queda cerrada; la página de todos los proyectos
pasa a V2 (arriba). Y sigue pendiente una decisión que la estructura nueva
habilita pero nadie tomó: qué otros tipos además del hero merecen ir a sangre
(hoy `palette` y `screen-cluster` van al shell de 1280, que fue decisión
explícita de Tiago).

### Qué es una tanda

Vale para los arreglos de arriba y para cada proyecto de V2. Una tanda de un
proyecto incluye **siempre**:

- las imágenes de case study con el vocabulario,
- **el cover corregido**, con la captura real en pantalla. No es opcional:
  cover y hero son el mismo mockup, así que salen de la misma escena. **La
  tanda no está cerrada mientras el cover siga con texto inventado.** La
  única excepción es el cover de Ritual, por decisión de Tiago (arriba).
- **y las dos cosas pasan el control al 100%** (`.claude/rules/imagenes.md`
  §6): texto real **y sin artefactos**.

📋 **Antes de producir**: la tabla de proporciones por tipo y la zona segura
(`.claude/rules/imagenes.md` §2), la regla de luminancia (§4.2), y el
`cardShape` del proyecto para el encuadre del cover (§3).

⚠️ **Un proyecto bajo NDA no lleva mockup con UI ni tira**: su hero sale del
material permitido (§4) y su cover lleva solo el logo en pantalla. El modelo es
FutbolTalent (`.claude/rules/imagenes.md` §1.1).

### Pulso

**Siguen abiertos:**

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

> ⚠️ Con la paleta ya en valor medio y el diagrama todavía en charcoal (42), las
> dos piezas de documentación de Pulso quedaron **desparejas**. Es un argumento
> más para el punto 5: cuando se rehaga el diagrama, va al mismo fondo.

Queda aparte, no bloquea nada:

7. **`priority` está deprecado en Next 16** (reemplazado por `preload`). Sigue
   funcionando —el HTML emite el `<link rel="preload">` del mockup—, pero
   `CaseStudyImage` usa la prop vieja.

⏳ **Dentro de esta versión, no en V2** (decisión de Tiago, 2026-09-22):

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

**Decisiones de Tiago que siguen abiertas sobre el copy de Pulso:**
- ¿El sitio está dado de alta en Search Console? En el HTML no hay meta de verificación, pero puede estar verificado por DNS.
- El cierre dice *"hoy no tengo números de consultas para mostrar"*. Es honesto y se puede suavizar.
- La negociación con el cliente está contada en abstracto. Con un ejemplo concreto (qué querían contar, qué se cortó) es la mejor parte del caso.

### Paseo — detalles menores, sin bloquear

- **Las bandas de `03-paleta` quedan ~71px del borde**, con la zona segura en 80
  (§2). En el desktop más angosto, en el extremo del parallax, se les shavea
  3-4px de la esquina redondeada. A 1280 no pasa nada. Si se rehace, entran 10px.
- **Mirar `02-cluster` en la página, en tema oscuro.** El marrón da 58 de
  distancia al fondo: es la más cercana al oscuro de la serie. Probablemente se
  lea —además cambia el tono— pero no está visto.

### FutbolTalent — las etiquetas del `02-cluster`

**Detalle cosmético, sin bloquear**: en `02-cluster` dos de las tres secciones
dicen *"ON BOARDING + REGISTR…"*, cortado por el ancho de la sección en Figma. A
1280 se lee truncado, y son justo las que prueban la decisión 1. Se arregla
ensanchando esas secciones y volviendo a capturar.

### Link al prototipo de Figma — declarado, sin renderear

El campo `links.figma` está declarado en `types/index.ts`, pero hoy ningún proyecto tiene uno y Tiago decidió no cablearlo por ahora. Si alguna vez se agrega, hacen falta **tres** cosas y ninguna avisa si falta:

1. el `push` a `linkItems` en `CaseStudyMetaBar.tsx` (hoy solo empuja `live`, `github` y `githubBack`),
2. la key `view_prototype` en los **dos** JSON — sugerido: *"Interactuar con el prototipo"* / *"Explore the prototype"*,
3. la URL real en el `links` del proyecto.

### El campo `tags` — sin lectores

Ningún componente lo muestra. Lo leía una rama del header del case study que no
se ejecutaba en ningún proyecto (dependía de un flag que valía `true` en los
7), y se borró con ella. Los datos siguen en `projects.ts`. **Decisión de
Tiago pendiente**: si los tags se muestran en algún lado o se borran.

### Diseño
| ID | Tarea | Esfuerzo | Notas |
|---|---|---|---|
| **F3** | Tipografía principal nueva | 30 min | Reemplazar Space Grotesk + Geist. Opciones: Inter, Manrope, Satoshi, General Sans, Aeonik, Cabinet Grotesk. **Charlar el combo antes de codear.** Descartar de entrada las combinaciones que hoy se leen como default de época: serif de alto contraste en display, mono en mayúscula para eyebrows, cursiva serif de acento en otro color. La paleta terracota ya está decidida y no se toca, así que la tipografía es el eje donde diferenciarse. Toca `layout.tsx` + `@theme`. La OG image no se toca: no lleva texto (§6). |
| **F4** | Unificar easing en cards | 15 min | Ocho transiciones usan `ease-out` (default de Tailwind) en vez de `ease-expo-out`, que es el token de marca y ya está en `globals.css:19`. `ProjectCard.tsx`: líneas 108, 140, 163, 168, 186, 196, 215 (la flecha, l. 228, sí usa el token). `CaseStudyNextNav.tsx`: línea 95. |

### Técnico
| ID | Tarea | Notas |
|---|---|---|
| **T2** | Lighthouse audit real | Manual en DevTools. No hay números del bundle post-rework. |
| **T3** | ¿Mover `CLAUDE.md` y `AGENTS.md` a un `.docs/` privado? | Sigue abierta, y ahora con más motivo: el repo se queda público (arriba), así que estos archivos se leen desde afuera. Revisar también el `.gitignore`. |
| **E** | Easter egg · Vercel Analytics · dominio NIC.ar | Cuando haya ganas. |

---

## 9. ⚠️ Errores y aprendizajes — no repetir

### HTML, layout y accesibilidad
1. **No traces un logo a ojo: pedí el vector.** Dibujar la G a mano desde un PNG costó dos intentos —un path relleno y un `stroke` monolineal— y ninguno dio con la forma; el export de Illustrator la resolvió en un paso. **Si no hay vector, pedilo antes de empezar**; un logo "parecido pero mal" es peor que no cambiarlo.
2. **Para ver un SVG sin buildear, rasterizalo a ASCII.** Un scanline fill de 40 líneas en Python imprime la silueta en la terminal. Sirvió para descubrir que el remate en flecha estaba mal, algo que leyendo el `d` no se ve y que el build no reporta. **Corolario**: nunca edites coordenadas de un path a ciegas.
3. **Un export de Illustrator no entra tal cual al repo.** El de la G traía: un `<metadata>` con un manifiesto **C2PA de procedencia que puede pesar decenas de KB** — mucho más que el dibujo, que es un path de ~1 KB; un `<rect>` de 98.76×0.3 px en un tercer color (`#b77455`), una astilla para tapar una costura; el fill en `#c4663b` en vez del token `#C96A3A`; y el `<style>` con clases, que conviene pasar a atributo porque este SVG lo rendea satori. **Y el artboard tenía 50% de margen**: la marca salía al 36% del recorte de WhatsApp en vez del 50%. Se arregla con el `viewBox`, sin tocar coordenadas.

### Imágenes y mockups
4. **El texto adentro de un mockup tiene que ser una captura REAL, nunca generado.** El marco, el fondo y la luz pueden ser generados; el contenido de la pantalla, no. **El control es abrir el export al 100% y leer el párrafo más chico en voz alta, ANTES de medir nada**: el texto inventado de los covers pasó dos revisiones que medían proporciones con tres decimales. Un número verde no dice nada del contenido (`.claude/rules/imagenes.md` §1.1).
5. **`sr-only` es invisible pero SIGUE siendo seleccionable, así que duplica el copiado.** Va `select-none` en la copia `sr-only`: la saca de la selección sin sacarla del árbol de accesibilidad. Ningún build, linter ni auditoría de a11y lo detecta (`.claude/rules/stack-traps.md`).
6. **Una imagen se juzga al 100% Y al tamaño en que se muestra.** Al 100% se controla el contenido; al tamaño de render, el impacto. **El tamaño de render nunca habilita un texto que no existe**: se lee con zoom, y el mismo mockup va a sangre en el hero (`.claude/rules/imagenes.md` §6).

### Proceso de trabajo
7. **Una tarea por sesión.** Si aparece algo nuevo en el medio: "lo apunto para después, ¿seguimos con esto?".
8. **No modificar data unilateralmente** por lo que diga este archivo. Si hay contradicción entre CLAUDE.md y el código, **flagearla y pedir decisión**.
9. **Mirar todas las referencias visuales antes de proponer un plan.** Son targets explícitos, no decoración.
10. **Cuando falta un dato, se pregunta.** Nunca se completa con una explicación plausible: el carrito de Ritual y el ruteo de WhatsApp de Pulso se escribieron así, y eran falsos. Un hueco en el copy se nota; una explicación inventada es lo primero que se repregunta en una entrevista. La pasada de hechos completa está en la skill `auditar-copy`.

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

**Imágenes**: `public/images/covers/{slug}-cover.*` (cards del home) · `public/images/case-study/{slug}/{nn}-{nombre}.*` — el número es el orden, el nombre es el tipo de pieza (`mockup`, `tira`, `cluster`…), nunca la sección. 📋 **Las medidas, el vocabulario de tipos, la dirección de arte y cómo cablear una imagen están en `.claude/rules/imagenes.md`** — no improvisar tamaños acá. Nada más va en `public/`: **todo lo que está ahí se sirve en producción** (ver §11).

> **Hoy hay 21 imágenes en el repo**: los 4 covers del home (el de Ritual con texto inventado, por decisión: §8) + las 5 de Pulso + las 4 de Paseo + las 5 de Ritual + las 3 de FutbolTalent. Los proyectos de V2 todavía no tienen: su `coverImage` es `null` y sus `imageBriefs` no tienen `src`. **Cablear una no toca ningún componente** — `ProjectCard` envuelve el cover en `{project.coverImage && …}` y la page rendea cada `CaseStudyImage` solo si el brief tiene `src`.

> **El modo placeholder de `CaseStudyImage` existe pero no se usa.** Sin imágenes, esas cajas punteadas "BUILDING" convertían el sitio en una obra en construcción —otra señal negativa—, y encima el texto está hardcodeado en inglés también en la versión ES.

> **Todas las imágenes pasan por `next/image`**. Los tres puntos donde se rendean son `ProjectCard` (cover, modo `fill`), `CaseStudyNextNav` (thumb, modo `fill`) y `CaseStudyImage` (modo `width`/`height`, porque en mobile la imagen va en flujo normal y `fill` la pondría absolute siempre; el `long-strip` además no tiene un alto que `fill` pudiera llenar). La **única** excepción es el `<img>` de `opengraph-image.tsx`, que rendea satori y no el browser — tiene su `eslint-disable` con el porqué al lado.

**Íconos**: `lucide-react` para UI · `simple-icons` para marcas del Stack · Adobe como cuadrados con iniciales. El Footer no usa SVGs de marca: sus links son mono + glifo (↗ navega, ↓ descarga). Para sumar uno nuevo, editar `SIMPLE_ICONS`, `LUCIDE_ICONS` o `ADOBE_INITIALS` en `StackIcon.tsx`. Todo monocromo con `currentColor`.

---

## 11. Referencias visuales

**Regla**: identificar la idea concreta a replicar (un patrón, una proporción, una micro-interacción), **no copiar pixel-perfect**.

**Portfolios premium**: [isadeburgh](https://isadeburgh.com/) (el "Get in touch" que rota y frena en hover — ya replicado en `MarqueeLink`; y su footer, de donde salió el bloque de cierre unificado: micro-label sobre el mail, botón copiar y barra de tres zonas. **No** se copió el estilo dibujado a mano, ni el serif del mail — sin serif en el stack, el contraste lo da Geist Mono —, ni el wordmark gigante de remate, que se probó y se descartó) · [artemiilebedev](https://artemiilebedev.com/) · [louispaquet](https://louispaquet.com/)

**Case studies Awwwards** (copy super corta en todos, sidebar de metadata, tipografía protagonista): [mikekus](https://mikekus.com/) · [joonassandell](https://joonassandell.com/) · [henriheymans](https://henriheymans.com/) · [silviasguotti](https://silviasguotti.design/) · [alejandromejias](https://www.alejandromejias.com.au/) · [yaremenko](https://yaremenko.design/) · (https://abhishekjha.me/?ref=lapaninja)

> ⚠️ **Si sumás refs visuales, NO las pongas en `public/`.** Ahí Next las sirve en producción: las últimas que hubo eran navegables en `tiagocollado.vercel.app/images/references/*.png` y sumaban 2,6 MB al deploy sin que las usara ningún código. Van fuera de `public/` y, si no aportan al portfolio, directamente fuera del repo.

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
