# Portfolio Tiago Collado — marca **Gotya**

> **Cómo usar este archivo**: las reglas de diseño y la ley UX son
> obligatorias. El resto es contexto del proyecto. El plan de la migración a
> Astro y sus fases están en `.claude/privado/plan.md` (§8). El historial vive
> en `git log` y en `docs/proceso/bitacora.md`. Los requisitos, el plan, las
> trampas del stack y las reglas de imagen y de tokens están importados al final.
>
> **Qué va acá y qué no**: se queda la regla y el ejemplo que la hace
> entender. El relato de cómo se llegó a ella va al mensaje del commit o a la
> bitácora.

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
| Forma de la card del home | `cardShape` en `src/data/projects.js` (`wide` 4:3 · `square` 1:1). La card recorta el cover a su forma, centrado: con la misma proporción no se pierde nada. Una sola card cuadrada (§7) |
| Qué imágenes tiene un case study | `imageBriefs` en `src/data/projects.js`. **Sin cantidad fija**: cada brief declara su `type` (qué es) y su `slot` (dónde cae) |
| Traducción de `type` a layout | `src/components/case-study/imageSpec.js` |

---

## 5. Sobre Tiago y la marca

**Tiago Collado** · Estudiante avanzado de Lic. en Tecnología Multimedial (Maimónides) · perfil híbrido UX/UI Designer + Frontend Developer, más fuerte en diseño que en programación.
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
- **Símbolo**: la "G" de Gotya en `icon.svg` (en la versión Next, `src/app/icon.svg`; su lugar en Astro, §10) — **vector real exportado de Illustrator**, un único path relleno. Chaflán hexagonal a la izquierda, esquina superior derecha redondeada y una diagonal que sube apuntando al codo de la transversal: esa es la flecha. Su `viewBox` está recortado respecto del artboard original (§6).
- **Radius** 12px cards / 999px pills · **Easing** `cubic-bezier(0.16, 1, 0.3, 1)`
- **Tipografía**: Space Grotesk (display) + Geist (body) + Geist Mono (labels) → *en revisión: fase "Identidad" del plan (§8)*
- Concepto: "minimalismo técnico pero cálido".

---

## 6. Qué hace hoy el sitio publicado — la referencia de paridad

Describe el comportamiento del sitio publicado. **Desde el 8/11/2026,
producción sirve la versión en Astro, construida desde este repo**; los
deployments de la versión Next quedan en el proyecto de Vercel como rollback
hasta la limpieza (plan, "Limpieza del sitio viejo"). La migración fue 1:1:
**cualquier diferencia contra esto es un bug**. Los nombres de componente son
los de la versión Next; dónde cae cada uno en Astro está en §10.

**Deploy**: https://tiagocollado.vercel.app/ · proyecto `tiagocollado` de
Vercel, conectado a este repo. La URL no cambió con la migración.

**URLs que tienen que seguir iguales**: `/` (redirige a `/en`), `/en`, `/es`,
`/{en,es}/projects/cabify-playlist-del-viaje`,
`/{en,es}/projects/paseo-guemes-hotel`, `/{en,es}/projects/pulso-creativo`,
`/{en,es}/projects/el-ritual-del-tono` y `/tiago-collado-cv.pdf`.

> ⚠️ **El PDF del CV no entra al repo, ni ahora ni después.** Vive afuera, y
> `/tiago-collado-cv.pdf` redirige ahí con una **redirección temporal (307)**,
> para que la URL que ya tienen los recruiters siga funcionando. Está en los
> `redirects` de `astro.config.mjs` con `status: 307`; el adapter de Vercel la
> escribe en la configuración de rutas del deploy.

**Defaults**: tema **dark**, locale **`en`** (`/` redirige a `/en`; las URLs `/es/...` siguen vivas).

**Capa "frontend creativo"**: Lenis smooth scroll (con reset de scroll en cambio de ruta) · custom cursor dot+ring con variants `default | link | view | drag` · SplitText char reveal · magnetic hover + `<MagneticLink>` · grain SVG global · scrollbar custom terracota · `<MotionConfig reducedMotion="user">` (en Astro va en cada isla que anima: `.claude/rules/stack-traps.md`).

**Home**: Navbar `h-16` fijo (NavLogo izq · links centrados · LanguageToggle + tema der · hamburger en `<lg`) · Hero con NameLogo GOTYA sticky que achica con el scroll y hace handoff al navbar, lema en dos líneas, CTA magnético con chevrons e `InteractiveDotGrid` · ServicesMarquee con fondo invertido · grilla masonry de proyectos (2 columnas, 4 cards, covers a sangre sin texto) · About 4.0 (micro-labels, claim con bold, copy a la derecha, firma) · Stack con carrusel infinito · **bloque de cierre unificado** (ver abajo).

**Bloque de cierre** (Contact + Footer): se leen como una sola pieza. Contact no cierra su padding inferior y el Footer arranca pegado, sin `border-t` entre medio. Contact lleva el micro-label, una **pregunta corta sin párrafo de body** (quien llega acá ya hizo click en "Hablemos": viene con intención, no hay que volver a venderle), el mail en **mono grande** con botón de copiar al portapapeles, y los 4 canales (LinkedIn / GitHub / WhatsApp / CV). El Footer es una única barra de tres zonas: copyright · back-to-top · crédito. **En mobile (`<sm`) esa barra pasa a 2 columnas**: copyright y crédito apilados a la izquierda, back-to-top a la derecha abarcando las dos filas (`row-span-2`) y centrado contra ellas — la mitad derecha es la zona de menor costo motor para el pulgar (Fitts). Las posiciones van explícitas (`col-start`/`row-start`) y se resetean con `sm:*-auto`, porque el orden del DOM es copyright → botón → crédito y el auto-placement pondría el crédito en el lugar equivocado.

> El bloque va dentro de un `<div class="min-h-screen flex flex-col justify-between">` en la página del home: al entrar por el ancla `#contact` ocupa exactamente una pantalla, con la barra del footer pegada abajo.

> ⚠️ **`role="contentinfo"` en el `<footer>` no es redundante.** El layout envuelve todo en `<main class="pt-16">`, y un `<footer>` descendiente de `<main>` pierde el landmark por spec. Si se saca el atributo, el landmark desaparece y no lo avisa ni el build ni el linter (`.claude/rules/stack-traps.md`).

**Cards de proyecto**: en reposo son SOLO la imagen del cover, a sangre y sin una
palabra encima. En hover el lavado terracota **barre de izquierda a derecha**
(`scale-x` con `origin-left`, no un fade) y después entran nombre, "VER PROYECTO",
categoría y las escuadras de las 4 esquinas.

> ⚠️ **En táctil no hay hover, así que no hay lavado**: el nombre y la categoría
> van DEBAJO de la card como texto normal. Se decide por `(hover: none)` y no por
> ancho de pantalla, porque una tablet en horizontal es ancha y tampoco tiene hover.

**El `<Footer />` cierra el home Y los cuatro case studies publicados.** El cierre del case study es `CaseStudyNextNav` + `Footer`: al pie de un case study largo hace falta el camino de vuelta arriba.

> ⚠️ **`id="top"` es requisito, no detalle.** El back-to-top es un `<a href="#top">`; toda página que renderee el `<Footer />` necesita ese id o el botón queda **muerto sin dar ningún error** — el build pasa, no hay warning, simplemente no scrollea. Hoy vive en el `<section>` del Hero (home) y en el `<div>` raíz del case study.

**Cierre del case study**: el "Próximo proyecto" **cicla solo entre los publicados**, en el orden del home (`order`), y el último vuelve al primero: Cabify → Paseo → Pulso → Ritual → Cabify. Sale de `publishedProjects`, la misma lista que la grilla, así que no pueden divergir. El pill "Ver todos los proyectos" lleva a `/{locale}#projects`, la grilla del home, hasta que exista la página de V2. Los dos paths van en **una sola fila** desde `md+` — pill ghost "Ver todos los proyectos" en columna `auto` a la izquierda, card "Próximo proyecto" en `1fr` a la derecha. La card es el CTA primario inequívoco (tamaño, fondo, thumbnail, glow en hover); la pill no compite (Hick). La card va **primero en el DOM** y las columnas se cruzan con `md:order-*`: así el apilado en mobile sale correcto sin `order`, y el primario encabeza el orden de tabulación.

**Back-to-top**: `<a href="#top">` con el `id="top"` en el `<section>` del Hero. Lenis monta con `anchors: true`, así que lo intercepta y hace el scroll suave él. Nunca `window.scrollTo`: pelearía contra su animación. Las dos flechas apiladas suben en loop mientras hay hover.

**Case studies** (los 4 publicados; los 2 de V2 siguen sin publicar, §7): **secuencia vertical de bloques hermanos**, cada uno declarando su propio ancho — barra de metadata (Cliente / Año / Rol / Duración / Equipo / Stack / Links; **en mobile va debajo del intro**, para que la primera pantalla sea la frase que explica el proyecto y no su duración) + hero a sangre + 5 secciones editoriales — **Intro → El desafío → Cómo lo resolví → Lo entregado → Cierre** — con tiradas de imágenes entre medio. Componentes en `src/components/case-study/`.

> **Por qué bloques hermanos y no una grilla con sidebar.** Una imagen solo puede ir a sangre si su bloque elige su propio ancho: dentro de una columna compartida queda atada a ella. Hoy el texto vive en un shell de 1280 y **solo `mockup` y `long-strip` salen del shell**.

**El ancho de una imagen lo decide su `type`, no el componente ni el `slot`.** `mockup` (el hero) y `long-strip` van a sangre (viewport completo, sin recorte, sin parallax, radio 0); el resto va al shell de 1280. La traducción de tipo a layout está en `src/components/case-study/imageSpec.js` y el arte en `.claude/rules/imagenes.md`.

> ⚠️ **`sizes` sale del ancho real y hay que moverlo con él.** Si el shell cambia de ancho, el `sizes` de `imageSpec.js` se mueve en la misma pasada. Sin `sizes` correcto, `astro:assets` no sirve de nada (`.claude/rules/stack-traps.md`).

**Convención de contenido**: un case study real necesita 12 keys de TEXTO en ambos JSON (`intro`, `challenge`, `decision_1-3_title/body`, `delivered_1-3`, `closing`). La key **`process`** es opcional (bajada de "Cómo lo resolví"): en Next se chequeaba con `t.has()`, y la `t()` propia necesita el mismo chequeo. Si falta una obligatoria, el cuerpo del caso no se renderea.

> **`challenge` admite varios párrafos**, separados por una línea en blanco (`\n\n` en el JSON). La página lo parte y rendea un `<p>` por párrafo con `space-y-6`; sin línea en blanco sale un solo párrafo. Hace falta porque HTML colapsa los saltos de línea: un `\n\n` adentro de un único `<p>` se ve como un espacio. Hoy solo lo usa Ritual (problema de producto + problema técnico). **Las demás keys siguen siendo de un solo párrafo**: si otra lo necesita, se le agrega el mismo `split`.

**Imágenes de case study**: **no hay cantidad fija** — cada proyecto usa los tipos que necesita, pueden ser 2 o 6. Cada brief declara `type` (qué es: `mockup` · `long-strip` · `screen-cluster` · `palette` · `diagram` · `detail`) y `slot` (dónde cae: `hero` · `intro` · `challenge` · `decisions` · `delivered` · `end`). La página recorre el array por `slot`. **Varias imágenes pueden compartir `slot`**: eso es lo que da los grupos de 2-3 seguidas sin texto entre medio.

En mobile se ven completas y quietas (sin crop ni parallax); el recorte y el parallax arrancan en `md+`, y `mockup` y `long-strip` no llevan ninguno de los dos en ningún breakpoint. No tienen hover ni cursor custom porque no abren nada — **por eso la regla de rango tonal ≥120 no les aplica**: existe para que se perciba el duotono del hover de las cards.

**Open Graph**: un PNG 1200×630 con **solo la marca G centrada** sobre el fondo oscuro, **sin texto**. Aplica a todas las páginas, también a `/projects/[slug]`: compartir cualquier link muestra la marca, no una captura del proyecto. En Next se generaba en build; en Astro pasa a ser un **PNG estático** (plan, §8).

> **Por qué sin texto.** WhatsApp (y varios clientes de chat) no muestran la card ancha: **recortan un cuadrado del centro**, y un texto alineado a la izquierda queda cortado e ilegible. Una marca centrada sobrevive cualquier recorte. Sin texto, además, la imagen no depende de la tipografía (el cambio de identidad no la toca) ni duplica el lema, que vive solo en los JSON.

> **Medida objetivo**: la **tinta** de la G ocupa **~50% del cuadro que recorta WhatsApp** (315×314 en la versión Next, medido decodificando el PNG), con su centro en el centro del lienzo. ⚠️ **Al ser un PNG estático, ya no sale del mismo `icon.svg` que el favicon**: si cambia la G, el PNG se regenera a mano y se vuelve a medir. El encuadre se ajusta con el `viewBox`, no moviendo coordenadas.

**i18n**: paridad total ES/EN en `es.json` y `en.json`. **Regla**: toda key nueva va en los dos archivos.

**Accesibilidad** (auditado sobre el HTML generado, no sobre el código):
- Un solo `<main>`, `<nav>`, `<header>` y `<footer>` por página · `lang` correcto por locale · **cero imágenes sin `alt`** · `aria-label` en todos los controles de solo ícono.

> **Lo que hay que sostener es el cero sin `alt`, no una cifra**: los conteos cambian con cada tanda. **El `alt` vacío de los covers y del thumbnail de "próximo proyecto" es deliberado**: son decorativos y el texto que los nombra ya está en el DOM, así que un alt descriptivo los haría anunciar dos veces.
- **Nada suprime el focus ring del browser**, así que el foco de teclado se ve en todo. La única excepción es `<main>`, que lo suprime a propósito: recibe foco solo por script desde el skip link, y un contorno alrededor de toda la página se lee como un bug. **No agregar más excepciones.**
- El cursor custom **no** oculta el nativo (no hay ninguna regla `cursor: none`), así que no interfiere con el foco.
- **Skip link**: primer elemento focusable, invisible hasta recibir foco. Mueve el foco por script (`click` + `preventDefault`) en vez de ser un `<a href="#main">` pelado, porque Lenis intercepta las anclas y puede comerse el movimiento de foco nativo — que acá es lo único que importa, ya que `<main>` arranca al tope y no hay nada que scrollear. En Astro es un `SkipLink.astro` con un `<script>` chico que mueve el foco, no una isla.
- **Jerarquía de headings**: el case study da `h1 → h2 → h3` sin saltos. Ojo: el label de `CaseStudySection` es un **`<h2>` que se ve como micro-label**. El tamaño chico es decisión visual, no jerárquica — **no lo devuelvas a `<p>`**: el outline quedaría `h1 → h3`.

---

## 7. Proyectos del portfolio

Orden = campo `order`. Si la página existe lo decide **`published`**; qué se muestra en el home, `showOnHome`; la forma de la card, `cardShape` (`wide` 4:3 · `square` 1:1). La grilla es masonry de dos columnas.

| # | Proyecto | Año | Publicado | Home | Forma | Qué es |
|---|---|---|---|---|---|---|
| 1 | **Cabify · Playlist del viaje** (`cabify-playlist-del-viaje`) | 2023 | ✅ | ✅ | **cuadrada** | Propuesta de rediseño de la app de Cabify: elegir la música del viaje. 15 pantallas y prototipo navegable en Figma. |
| 2 | **Paseo Güemes Hotel** | 2026 | ✅ | ✅ | ancha | Hotel 3★ en Salta. UX/UI + WordPress, reserva directa contra OTAs. |
| 3 | **Pulso Creativo** | 2026 | ✅ | ✅ | ancha (cover 1:1, recortado al centro) | Consultora B2B 25+ años. Sitio institucional, contacto dual, rediseño UX del contenido. |
| 4 | **El Ritual del Tono** | 2025 | ✅ | ✅ | ancha | **Proyecto universitario** (Programación Multimedial III, Maimónides). Full-stack MERN con demo en vivo. |
| 5 | **Multibrand Design System** | 2025 | — V2 | — | ancha | Simulación laboral No Country, equipo de 6. |
| 6 | **Recuérdalo** | 2025 | — V2 (primero) | — | **cuadrada** | Proyecto universitario, UX inclusivo para adultos 70+. |

> **Multibrand y Recuérdalo no están publicados**: su página da 404 y no aparecen en ningún lado del sitio. **Volver a publicar uno es cambiar `published` a `true`**, después de su tanda (abajo). Todo lo que se ve en el sitio lee de **`publishedProjects`**, así que un proyecto oculto no puede colarse aunque un componente nuevo se olvide de filtrar.

**Una sola card cuadrada en el home: la del caso protagonista, que va primero.** El resto va en 4:3. Hoy es Cabify. Cuando se publique Recuérdalo, pasa a ser la cuadrada y primera, y Cabify pasa a 4:3: su cover cuadrado está compuesto para recortarse a 4:3 sin perder el celular central (`.claude/rules/imagenes.md` §3). Al cambiar de protagonista se renumera `order` para que no haya empates: con el mismo valor, el `sort` desempata por la posición en el array de `projects`.

**Los 4 del home son los que mejor muestran rango.** Ritual es universitario y **se queda en el home porque es el único full-stack con demo en vivo** (decisión de Tiago, 2026-09-21).

La grilla es **masonry**: dos columnas `flex-col` independientes que reparten
los proyectos **alternando** — las posiciones impares a la izquierda, las pares
a la derecha. Cuenta la posición en la lista ordenada, no el valor de `order`.

| Columna | Proyectos |
|---|---|
| izquierda | Cabify (**cuadrada**) · Pulso Creativo (ancha) |
| derecha | Paseo Güemes (ancha) · El Ritual del Tono (ancha) |

**Las columnas terminan a distinta altura a propósito.** Eso es lo que la hace
masonry: una grilla con `grid-auto-rows` + `row-span` alinea las filas y se lee
como una grilla común.

**Orden de lectura en mobile**: alternar deja 1·3·2·4 al apilarse, porque ese es
el orden del DOM. Se arregla con `display: contents` en las columnas abajo de
`md`: los `<div>` desaparecen del layout, las cards pasan a ser hijas directas
del grid y el `order` de cada una las ordena 1·2·3·4. En desktop las columnas
vuelven a `flex` y el `order` no molesta.

**Fuera del portfolio**: Retro Kicks, Govah, SoundCloud Redesign, Rick & Morty Explorer.

**Regla**: salvo que se diga "académico" o "universitario", se asume que el proyecto es real. Hoy hay **dos** flageados como universitarios, con el mismo formato en `metadata.client` (`Proyecto universitario · Maimónides`): **Recuérdalo** y **El Ritual del Tono**.

> ⚠️ **Antes de rotular un proyecto, mirar si el sitio publicado dice de dónde salió.** Ritual figuró como "Proyecto personal" hasta que se vio que la página About de su propia demo lo presenta como proyecto universitario.

### Decisiones tomadas que no vuelven como pendientes

- **El cover de El Ritual del Tono se publica con el texto inventado que tiene
  en la pantalla** (Tiago, 2026-09-23). El texto es tan chico que al tamaño de
  la card no se lee; con zoom sí, y es el riesgo asumido. El hero de Ritual es
  una composición nueva con captura real, así que el texto inventado vive solo
  en la card. ⚠️ **No sienta precedente**: para cualquier otro cover la regla
  de `.claude/rules/imagenes.md` §1.1 sigue entera.
- **La tira de Pulso** (`01-tira`) se queda con las columnas al ~60% del ancho
  (Tiago, 2026-09-23). La regla de llenar el encuadre sigue valiendo para las
  tiras nuevas (`.claude/rules/imagenes.md` §2).

### Qué es una tanda

Vale para cada proyecto de V2. Una tanda de un proyecto incluye **siempre**:

- las imágenes de case study con el vocabulario,
- **el cover corregido**, con la captura real en pantalla. No es opcional:
  cover y hero son el mismo mockup, así que salen de la misma escena. **La
  tanda no está cerrada mientras el cover siga con texto inventado.** La
  única excepción es el cover de Ritual (arriba).
- **y las dos cosas pasan el control al 100%** (`.claude/rules/imagenes.md`
  §6): texto real **y sin artefactos**.

📋 **Antes de producir**: la tabla de proporciones por tipo y la zona segura
(`.claude/rules/imagenes.md` §2), la regla de luminancia (§4.2), y el
`cardShape` del proyecto para el encuadre del cover (§3).

### Cómo se rotula cada proyecto — formato de agencia

El título de la card da la marca y el campo **`services`** da la categoría, como hacen las agencias (`Colonial Helados` / `Social Media & Producción Audiovisual`). Se rendea en dos lugares: bajo el título en la card y sobre el título en el header del case study. Separador: ` & `.

| Proyecto | `services` ES | `services` EN | `metadata.role` ES |
|---|---|---|---|
| Pulso Creativo | Diseño Web | Website Design | Diseño UX/UI e implementación en WordPress |
| Paseo Güemes Hotel | Diseño Web & Dirección de Arte | Website Design & Art Direction | Dirección de arte, diseño UX/UI e implementación en WordPress |
| El Ritual del Tono | Diseño Web & Desarrollo de Producto | Website Design & Product Development | Diseño UI y Desarrollo Full-stack |
| Multibrand Design System | Design System | Design System | Diseño UX/UI y Design System |
| Recuérdalo | Aplicaciones Móviles | Mobile Apps | Investigación UX y Diseño Inclusivo |
| Cabify · Playlist del viaje | Aplicaciones Móviles & Design System | Mobile Apps & Design System | Diseño UX/UI |

> **Cabify lleva `metadata.client` = `Propuesta de rediseño · Cabify`** /
> `Redesign proposal · Cabify`. Es el lugar donde se dice de dónde salió un
> proyecto, el mismo donde Ritual y Recuérdalo dicen `Proyecto universitario ·
> Maimónides`; el tagline lo repite.

**Las tres reglas del rótulo:**

1. **`services` lleva CATEGORÍAS, nunca roles.** "Diseño Web", "Aplicaciones Móviles", "Design System", "Branding" — jamás "Diseño UX/UI", "Full-stack" ni "WordPress". Eso describe *cómo* se hizo y vive en `role` y en `stack`.
2. **Máximo 2 categorías.** Con 3 la línea se parte en dos renglones en la card y deja de escanearse.
3. **`role` no lleva "Freelance".** No aporta nada profesional y es lo primero que un reclutador descuenta.

> **Precisión de los títulos, para poder defenderlos en una entrevista.** *UX/UI Designer* diseña pantallas y flujos con el problema ya definido; *Product Designer* participa en decidir **qué** construir (priorización, métricas, definición del problema); *Desarrollo de Producto* incluye ingeniería, así que no aplica si no lo programaste.
>
> Mismo criterio con **Branding vs Dirección de Arte**: en Paseo Güemes el logo se lo dieron y él definió paleta, tipografías y el sistema visual — eso es dirección de arte. Decir "Branding" invita a la repregunta "¿hiciste el logo?", y la respuesta resta.

> **`team` describe alcance, no cantidad de gente.** "Responsable único" y "Trabajo individual" señalan que no había nadie más; "Diseño y ejecución end-to-end · trato directo con el cliente" describe lo mismo como control sobre el proyecto. Misma realidad, lectura opuesta. No hace falta variar la redacción entre proyectos: **el campo solo se ve en la barra de metadata de un case study a la vez**, nunca dos juntos.

> **`stack` lleva solo herramientas core.** UX Research, Card Sorting y Design System son *actividades*, no stack: viven en `role` y en el cuerpo del caso. Varios proyectos quedan en `Figma` a secas y está bien — inflar la lista con actividades le quita credibilidad a la parte que sí es herramienta.

### Stack que se muestra en el carrusel
Solo lo que Tiago pueda defender en una entrevista.
- ✅ **Diseño**: Figma, FigJam, Photoshop, Illustrator, Premiere
- ✅ **Frontend**: HTML5, CSS3, React, Next.js, Astro, Tailwind
- ✅ **UX**: Research, Writing, Prototyping, User Testing, Card Sorting, Design Systems, Accessibility
- ✅ **Otros**: IA generativa aplicada al diseño, Git/GitHub, WordPress
- ❌ **No incluir**: MongoDB, Node.js, TypeScript, Express (los tocó, no los domina)

> Excepción: en el case study de El Ritual del Tono sí se nombran Mongo/Node/Express porque son el contexto de ese proyecto. Distinto a promocionarlos como habilidad general.

> **Herramientas propias**: no nombrar los temas de WordPress que usa (decisión de Tiago). En la copy va "un tema liviano" y el porqué de la elección. Elementor, WPForms, Rank Math y LiteSpeed sí se pueden nombrar **en el cuerpo del case study**, pero **no van en `metadata.stack`**: ese campo queda en lo core (`Figma · WordPress`), porque una lista de plugins en la barra de metadata tapa la herramienta que importa.

---

## 8. 🚦 Qué falta hacer

El plan de la migración a Astro (fases, calendario, decisiones y reglas de trabajo) está en `.claude/privado/plan.md`, importado al final: una fase por vez, con check-in al cerrar cada una.

---

## 9. ⚠️ Errores y aprendizajes — no repetir

### HTML, layout y accesibilidad
1. **No traces un logo a ojo: pedí el vector.** Dibujar la G a mano desde un PNG costó dos intentos —un path relleno y un `stroke` monolineal— y ninguno dio con la forma; el export de Illustrator la resolvió en un paso. **Si no hay vector, pedilo antes de empezar**; un logo "parecido pero mal" es peor que no cambiarlo.
2. **Para ver un SVG sin buildear, rasterizalo a ASCII.** Un scanline fill de 40 líneas en Python imprime la silueta en la terminal. Sirvió para descubrir que el remate en flecha estaba mal, algo que leyendo el `d` no se ve y que el build no reporta. **Corolario**: nunca edites coordenadas de un path a ciegas.
3. **Un export de Illustrator no entra tal cual al repo.** El de la G traía: un `<metadata>` con un manifiesto **C2PA de procedencia que puede pesar decenas de KB** — mucho más que el dibujo, que es un path de ~1 KB; un `<rect>` de 98.76×0.3 px en un tercer color (`#b77455`), una astilla para tapar una costura; el fill en `#c4663b` en vez del token `#C96A3A`; y el `<style>` con clases, que conviene pasar a atributo. **Y el artboard tenía 50% de margen**: la marca salía al 36% del recorte de WhatsApp en vez del 50%. Se arregla con el `viewBox`, sin tocar coordenadas.

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

## 10. Stack y estructura — objetivo

> 🎯 **Es la estructura objetivo que propone el plan.** Lo marcado con ✅ ya
> existe (F3). Lo marcado *(F4)*, *(F5)* o *(F6)* se confirma contra la
> documentación oficial en esa fase.

**Astro 7 · JavaScript (`.astro`, `.js`, `.jsx`), sin TypeScript · React en islas · Tailwind v4 · Framer Motion · Lenis · i18n nativo de Astro · `astro:assets` · adapter `@astrojs/vercel` · Last.fm como fuente dinámica**

Sale de la versión Next: `next-intl` (lo reemplazan los JSON + una `t()` propia), `next-themes` (lo reemplaza un script inline en el `<head>`), `next/image` (lo reemplaza `astro:assets`) y la OG generada con satori (la reemplaza un PNG estático).

```
astro.config.mjs                # ✅ site · adapter de Vercel · trailingSlash
                                # 'always' · redirects (/tiago-collado-cv.pdf →
                                # CV en Drive, 307) · env.schema (LASTFM_API_KEY
                                # server secret, LASTFM_USERNAME server public)
                                # · i18n (defaultLocale "en",
                                # prefixDefaultLocale: true,
                                # redirectToDefaultLocale: false) · fuentes ·
                                # Tailwind (@tailwindcss/vite) · React
                                # Sin vercel.json: el adapter arma la config de
                                # rutas del deploy solo desde astro.config.mjs
tsconfig.json                   # ✅ preset "base" de Astro (sin modo estricto:
                                # el proyecto es JavaScript)
.env.example                    # ✅ LASTFM_API_KEY= y LASTFM_USERNAME= (sin
                                # valor; .env no se versiona)
public/                         # se sirve tal cual, sin optimizar (§11)
├── favicon.svg                 # ✅ la "G" de Gotya
└── og-image.png                # ✅ OG estática de la G, 1200x630
src/
├── assets/                     # ✅ imágenes que optimiza astro:assets
│   ├── covers/                 # {slug}-cover.jpg
│   └── case-study/{slug}/      # {nn}-{nombre}.jpg
├── layouts/
│   └── BaseLayout.astro        # ✅ <head>, script de tema, fuentes, metadata + OG
├── pages/
│   ├── index.astro             # ✅ obligatorio con i18n. La redirección real
│   │                           # de / a /en/ (307) está en `redirects` de
│   │                           # astro.config.mjs; esta página queda de
│   │                           # respaldo con Astro.redirect (ver nota abajo)
│   ├── en/ · es/               # ✅ carpetas por idioma: index.astro y
│   │                           # projects/[slug].astro (getStaticPaths con los
│   │                           # publicados). Cada una usa un componente compartido
│   └── api/
│       └── now-playing.json.js # prerender = false · pide a Last.fm con caché
│                               # en la CDN de Vercel (F6)
├── components/
│   ├── HomePage.astro          # ✅ la home, compartida por /en y /es
│   ├── case-study/             # ✅ CaseStudyPage · Header · MetaBar · Section ·
│   │                           # ImageRun · NextNav (.astro) · CaseStudyImage.jsx
│   │                           # (isla) · imageSpec.js
│   ├── sections/               # ✅ ServicesMarquee · Projects · About · Stack
│   │                           # (.astro) · ProjectCard.jsx (isla)
│   │                           # F5: Hero.jsx · Contact.jsx (islas)
│   └── ui/                     # ✅ .astro: SkipLink (con <script>) · StackIcon
│                               # F5, islas: Navbar · NameLogo · NavLogo ·
│                               # CustomCursor · SplitText · MagneticLink ·
│                               # MarqueeLink · Footer · InteractiveDotGrid
│                               # F6: NowPlaying · cambio de idioma (.astro)
├── data/                       # ✅ projects.js · stack.js
├── utils/
│   └── responsiveImage.js      # ✅ getImage() para las islas (solo servidor)
├── i18n/                       # ✅ es.json · en.json · translate.js
│                               # (createTranslator(locale) devuelve t('a.b'),
│                               # t.list() y t.has())
└── styles/
    └── global.css              # ✅ @theme, tokens, variante dark por clase,
                                # @view-transition, reset en @layer base
```

> ⚠️ **`redirectToDefaultLocale` queda en `false` a propósito.** En el build
> estático, con `true`, `/` sale como meta refresh de **2 segundos** (Astro lo
> trata como 302) y el build tira un warning de rutas en conflicto con
> `src/pages/index.astro`, que es obligatorio. Con la redirección a mano en
> `index.astro` (`Astro.redirect(…, 307)`) sale sin warning y con refresh de 0
> segundos.
>
> ⚠️ **La redirección HTTP real de `/` sale de `redirects` en
> `astro.config.mjs`** (307), que el adapter escribe en
> `.vercel/output/config.json` y que hace que el build no genere `index.html`.
> Contradice la doc de routing (la página debería ganar), así que **después de
> actualizar Astro o el adapter se revisa que la regla `^/$` siga en el
> `config.json` y que no exista `.vercel/output/static/index.html`**. En dev
> responde 301 en vez de 307.

**Fuentes**: API de fuentes de Astro (`fonts` en `astro.config.mjs`, estable en 7.4.7) + `<Font cssVariable preload />` en el layout. Descarga las fuentes de Google en el build y las sirve desde el sitio, con `font-display: swap`, un fallback con métricas ajustadas (para que el cambio de fuente no mueva el layout) y preload: la misma estrategia que usaba `next/font`. Las variables CSS son las de antes (`--font-geist-sans`, `--font-geist-mono`, `--font-space-grotesk`).

**Metadata**: title, description, Open Graph y Twitter salen del bloque `meta` de los JSON. Hoy está en inglés en los dos idiomas, igual que el sitio anterior; traducir el de ES necesita el copy de Tiago. Sin `<link rel="canonical">` y con `og:url` siempre a la raíz, como hoy.

**Tema**: script inline en el `<head>` con la clave `theme` de `localStorage` (la misma que usaba `next-themes`), valores `dark`/`light`, clase en `<html>` y `color-scheme`. El HTML ya sale con `class="dark"`, así que sin JavaScript también queda en oscuro.

**Islas y directivas** (detalle en el plan): `CustomCursor` con `client:only="react"` · `Navbar`, `Hero`, `NameLogo`, `NavLogo` con `client:load` · `InteractiveDotGrid` con `client:idle` · `ProjectCard`, `MagneticLink`, `MarqueeLink`, `Contact`, `Footer`, `CaseStudyImage` y `NowPlaying` con `client:visible`. Las dos trampas de las islas (el contexto no cruza; `MotionConfig` va en cada una) están en `.claude/rules/stack-traps.md`.

**Navegación**: página completa (MPA) + `@view-transition { navigation: auto; }` en CSS. `ClientRouter` se evalúa al cerrar F5, en un commit aparte.

**Imágenes**: covers en `src/assets/covers/` y piezas de case study en `src/assets/case-study/{slug}/{nn}-{nombre}.*` — el número es el orden, el nombre es el tipo de pieza (`mockup`, `tira`, `cluster`…), nunca la sección. 📋 **Las medidas, el vocabulario de tipos, la dirección de arte y cómo cablear una imagen están en `.claude/rules/imagenes.md`.** En `public/` va solo lo que tiene que servirse tal cual: **todo lo que está ahí se sirve en producción** (§11).

**Imágenes dentro de islas**: el `<Image />` de Astro no se puede usar adentro de un `.jsx`. El `.astro` llama a `getResponsiveImageProps()` (`src/utils/responsiveImage.js`, que usa `getImage()`) y le pasa a la isla `src`, `srcset` y `sizes` como props; la isla arma su propio `<img>` (o `motion.img`, para el parallax). Los anchos del `srcset` y la calidad salen de `imageSpec.js`, y son los que usaba `next/image` por defecto. En `.astro` (el thumbnail de `CaseStudyNextNav`) se usa `<Image />` directo, con los mismos anchos.

**Links del caso**: `CaseStudyMetaBar` muestra, en este orden, los campos de `links` que tenga el proyecto: `live` (`case_study.view_live`), `github` (`view_github_frontend`), `githubBack` (`view_github_backend`) y `prototype` (`view_prototype`, *"Ver prototipo"* / *"View prototype"*). Todos abren en pestaña nueva con `rel="noopener noreferrer"`. Un tipo nuevo es una línea en `projectLinks` del componente y su clave en los dos JSON.

**Íconos**: `StackIcon.astro`, sin JavaScript. `simple-icons` para marcas del Stack, `lucide-react` para habilidades sin marca y Adobe como cuadrados con iniciales. Los íconos de `lucide-react` son componentes de React, pero sin directiva `client:*` Astro los renderiza a SVG en el build. El Footer no usa SVGs de marca: sus links son mono + glifo (↗ navega, ↓ descarga). Todo monocromo con `currentColor`.

**Versiones**: `framer-motion` 12.38.0, `lucide-react` 1.11.0 y `simple-icons` 16.17.0 quedan fijadas en el lock con las mismas versiones que el sitio publicado, para que los íconos y las animaciones salgan idénticos.

---

## 11. Referencias visuales

**Regla**: identificar la idea concreta a replicar (un patrón, una proporción, una micro-interacción), **no copiar pixel-perfect**.

**Portfolios premium**: [isadeburgh](https://isadeburgh.com/) (el "Get in touch" que rota y frena en hover — ya replicado en `MarqueeLink`; y su footer, de donde salió el bloque de cierre unificado: micro-label sobre el mail, botón copiar y barra de tres zonas. **No** se copió el estilo dibujado a mano, ni el serif del mail — sin serif en el stack, el contraste lo da Geist Mono —, ni el wordmark gigante de remate, que se probó y se descartó) · [artemiilebedev](https://artemiilebedev.com/) · [louispaquet](https://louispaquet.com/)

**Case studies** (copy super corta en todos, metadata en una barra arriba del caso —de acá sale `CaseStudyMetaBar`—, tipografía protagonista): [mikekus](https://mikekus.com/) · [joonassandell](https://joonassandell.com/) · [henriheymans](https://henriheymans.com/) · [silviasguotti](https://silviasguotti.design/) · [alejandromejias](https://www.alejandromejias.com.au/) · [yaremenko](https://yaremenko.design/) · (https://abhishekjha.me/?ref=lapaninja)

> ⚠️ **Si sumás refs visuales, NO las pongas en `public/`.** Astro copia esa carpeta tal cual al build y se sirve en producción: en la versión Next, las últimas que hubo eran navegables en `tiagocollado.vercel.app/images/references/*.png` y sumaban 2,6 MB al deploy sin que las usara ningún código. Van fuera de `public/` y, si no aportan al portfolio, directamente fuera del repo.

---

## 12. Workflow y comunicación

- **Dev**: `npm run dev` (localhost:4321) · **Build**: `npm run build`.
- **Revisar el build**: `npm run preview` **no funciona**: el adapter de Vercel no soporta el comando. Lo verificado es servir la carpeta `.vercel/output/static` con un servidor estático (se probó con uno mínimo de Node que sirve el `index.html` de cada carpeta). Así se ven las páginas y las imágenes optimizadas, pero no corren el endpoint de Last.fm ni las redirecciones del deploy (`/`, el CV, la barra final): esas se prueban en Vercel.
- **Deploy**: Vercel. Producción (`tiagocollado`) construye desde este repo desde el 8/11/2026; el proyecto de staging se borra en la limpieza del sitio viejo (plan).
- **Proyecto nuevo**: entry en `src/data/projects.js` + bloque `case_study_{slug}` en **ambos** JSON.
- **Todo lo que se versiona es público**: README, `docs/`, comentarios y mensajes de commit se escriben con tono profesional, sin charla interna. El detalle está en el plan.
- **Commits**: los hace Tiago desde su terminal para mantener la autoría. Claude prepara los cambios y le pasa los comandos (git add + git commit con el mensaje), en castellano, con prefijo convencional y **sin trailers `Co-Authored-By`**. Claude sí puede correr los comandos de git que solo leen (status, log, diff, show).

**Estilo de comunicación esperado**:
- Directo, sin condescendencia. Honesto cuando algo está mal, incluido señalar decisiones dudosas de copy o de diseño.
- Explicar el *por qué*, no solo el *qué*. Paso a paso cuando el código es complejo.
- Preguntar antes de asumir cuando falta info sobre un proyecto, un rol o una decisión.
- Claridad de código por encima de cleverness.

@AGENTS.md @.claude/privado/requisitos.md @.claude/privado/plan.md
@.claude/rules/imagenes.md @.claude/rules/design-tokens.md @.claude/rules/stack-traps.md
