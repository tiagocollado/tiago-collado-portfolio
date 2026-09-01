@AGENTS.md
# Portfolio Tiago Collado — marca **Gotya**

> **Cómo usar este archivo**: las secciones 1-4 son reglas que hay que respetar sí o sí. La 5-7 es contexto. La 8 es lo que falta hacer. La 9 son errores ya cometidos, no los repitas. El historial de qué se hizo y cuándo vive en `git log`, no acá.

---

## 1. ⚠️ Trampas del stack — leer antes de tocar código

### Tailwind v4 + CSS Cascade Layers (el bug más caro del proyecto)
Las utilities (`px-*`, `mt-*`, etc.) viven dentro de `@layer utilities`. Una regla **fuera** de cualquier `@layer` gana siempre, sin importar la especificidad. Una sola línea `* { padding: 0 }` unlayered mata todas las utilities de padding del proyecto.

- ❌ Nunca `padding`/`margin` en una regla universal `* { }` sin layer.
- ✅ El preflight de Tailwind ya resetea los elementos correctos (h1-h6, p, ul, ol). No hace falta replicarlo.
- ✅ Reset custom → dentro de `@layer base { }`.
- ✅ Los inline styles siempre ganan (specificity 1,0,0,0): son el escape hatch, pero indican un bug abajo.
- ⚠️ **Corolario que ya mordió 14 veces (T4, ya saneado)**: si una propiedad cambia en `hover:`, su valor base NO puede venir de `style` inline — el hover no se ve nunca, y el build no lo detecta. El valor base va como utility (`text-(--ink-secondary)`, `border-(--border-default)`, `bg-transparent`) para que la variante `hover:` pueda ganarle por especificidad. Las props que NO cambian en hover pueden seguir en `style` sin problema.
- 🔍 Para auditarlo: buscar etiquetas JSX que tengan a la vez una utility `hover:text-*` / `hover:border-*` / `hover:bg-*` y un `style` inline con `color` / `borderColor` / `backgroundColor`. Ojo con parsear la etiqueta hasta el primer `>`: los `=>` de los handlers la cortan al medio y se escapan casos.
- 🔍 Si algo "no cambia nada", **revisar `globals.css` buscando reglas universales antes de seguir debuggeando**.

### Next.js 16 — no es el Next que conocés
- El middleware se llama **`proxy.ts`** (en `src/`), no `middleware.ts`, y exporta `proxy`.
- `params` es una **Promise**: siempre `const { locale } = await params`.
- Ante cualquier duda de API, leer `node_modules/next/dist/docs/` antes de escribir código (regla de AGENTS.md).

### Otras
- **Turbopack cachea**: si un cambio de CSS "no se ve", probar `Ctrl+Shift+R` antes de buscar el bug.
- **Comentarios CSS**: evitar la secuencia `*/` dentro del cuerpo (escribir "px y py", no `px-*/py-*`), rompe el parser.
- **`lucide-react` es 1.x**, no 0.x. Misma API, no busques doc de `0.x`.

---

## 2. 🎨 Reglas de diseño

**Antes de cualquier cambio visual, releer esta sección. Si algo no está cubierto acá, preguntar antes de improvisar valores.**

### Rol y vara de calidad
Trabajás como Senior Frontend Developer + Director de Arte UI/UX. La vara es
producto premium / nivel Awwwards, con la sensibilidad de Linear (precisión),
Vercel (contención) y Apple (terminación). Esta vara NO reemplaza las reglas
de abajo ni las secciones 3 y 5: las interpreta. Ante dos soluciones válidas,
elegí la más restrained y la mejor terminada, nunca la más cargada.

- La calidad vive en el detalle: consistencia de spacing, estados bien
  resueltos, coherencia del conjunto. No en sumar efectos.
- Menos elementos mejor resueltos > más features a medias. Ante la duda,
  sacar antes que agregar.
- Usá los tokens de marca (sección 5) y las escalas de esta sección.
  Prohibido inventar valores sueltos o caer en defaults de Tailwind
  (blue-500, gap-12 arbitrario, etc.).
- Todo lo que entra tiene que poder defenderse con una ley UX (sección 3).

### Spacing — siempre múltiplos de 4
`xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64 · 4xl 96 · 5xl 128`

### Padding vertical de secciones
`py-20` mobile · `md:py-28` tablet · `lg:py-36` desktop

### Gaps mínimos
| De → a | Mínimo |
|---|---|
| H1 → párrafo | `mt-6` |
| H1 → CTA | `mt-10 md:mt-12` |
| H2 → contenido | `mt-8 md:mt-10` |
| Párrafo → CTA | `mt-8` |
| Entre párrafos | `space-y-6` |

### Escalera de anchos (`max-w`) — 3 niveles, no inventar un cuarto
| Nivel | Ancho | Para qué |
|---|---|---|
| **Shell** | `max-w-7xl` (1280px) | **Todo** contenedor de sección, el navbar y el footer. Una sola columna vertical en toda la página. |
| **Editorial** | `max-w-3xl` (768) títulos · `max-w-2xl` (672) body | Medida de lectura. Va **adentro** del Shell, nunca lo reemplaza. |
| **Excepción** | `max-w-xl` (576) | Solo el body desplazado del About (referencia `about_reference2`). Es la única. |

⚠️ **El `max-w` y el gutter NUNCA van en el mismo elemento.** Con `box-sizing: border-box` el padding cuenta *dentro* del `max-w`, así que el contenido termina corrido respecto de las secciones que sí los separan. El patrón correcto es siempre:

```jsx
<section className="px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
  <div className="max-w-7xl mx-auto"> ... </div>
</section>
```

Este bug vivió meses en el Navbar (`max-w-400` + padding juntos) y en el Stack, y daba **seis bordes izquierdos distintos** a 1920px. El gutter es siempre ese string exacto, idéntico en todos lados.

> Ojo al auditar: el error no se ve buscando valores de `max-w` raros. El Stack ya tenía `max-w-7xl` y estaba igual de roto — el problema era *dónde* estaba el padding, no el número.

### Imágenes — medidas para diseñar en Figma
Medido contra el layout real, no estimado. **Diseñar a 1× y exportar @2×.**

**Covers del home** · frame `960 × 600` → export **@2× = 1920 × 1200**

Las cards tienen **altura fija** y ancho variable, así que el mismo archivo cae en recortes muy distintos:

| Slot | Recorte | Aspect |
|---|---|---|
| Featured (2 col) | 845 × 320 | **2,64:1** |
| Normal (1 col) | 411 × 320 | **1,28:1** |
| Mobile 375px | 327 × 280 | 1,17:1 |
| Mobile 320px | 272 × 280 | **0,97:1** (vertical) |

⚠️ Entre el recorte más ancho y el más angosto, lo único que sobrevive siempre es el **60% central**. **Zona segura: rectángulo centrado de `580 × 360`** (en el frame de 960×600). Nada esencial afuera de ahí.
Sin texto (la card superpone tag, año y título) y tiene que funcionar en escala de grises: en reposo van desaturadas.

**Imágenes de case study** · frame `1200 × 800` (3:2) → export **@2× = 2400 × 1600**

Las 4 usan `aspectRatio="wide"`. La columna editorial mide 944px como máximo. Margen de seguridad: **72px en los cuatro lados** (el recorte con parallax se come ~3,5% de cada borde en desktop).

⚠️ **En mobile la imagen se muestra COMPLETA y sin recortar, a ~330px de ancho** — el frame de 1200 se ve al **27%**. Por eso **todo texto adentro de la imagen tiene que medir 36px o más** en el frame de 1200×800; menos que eso es ilegible en celular. Para mostrar pantallas con texto chico va un zoom o un detalle recortado, nunca la pantalla entera.

**Exportación (ambas)**: **PNG o JPG calidad 90+**, sin presupuesto de KB (referencia sana: que ninguno pase de ~1 MB, por el peso del repo).

> ⚠️ Esto **cambió con D3**. La regla vieja era "WebP calidad 80, ≤ 250 KB" porque se usaba `<img>` pelado sin `srcset` y el celular bajaba el archivo completo. Con `next/image`, Next genera 8 anchos (640→3840) y los convierte a WebP en el momento: el archivo del repo es el **master del que Next recorta**, no lo que ve el visitante. Comprimirlo a mano ya no le ahorra nada al usuario y suma pérdida de calidad, porque se re-comprime igual.

### Tipografía
- Display (H1/H2): `leading-tight` (1.15)
- Body: `leading-relaxed` (1.625) — **nunca menos**
- Bloques narrativos: `max-w-prose` (~65ch) o `max-w-2xl`

### Animación
- Duración estándar `0.6s` · mínimo `0.3s` · easing `[0.16, 1, 0.3, 1]` (expo-out, ya en globals.css)
- Stagger entre hijos: `0.08–0.12s`
- Scroll-in: fade + `y: 24 → 0` (no menos de 24px)
- Hover scale en cards: máximo `1.02` (más se ve barato)

### Hover states obligatorios
- Cards: `shadow-lg → shadow-2xl` + glow accent terracota
- Botones primarios: `bg-accent-hover` + `-translate-y-0.5`
- Links de texto: underline con offset animado (`underline-offset-4 → 8`)
- Toggles: `scale 1.1` + rotate sutil

### Animation polish (no negociable)
El portfolio es de un UX/UI Designer: **la página tiene que sentirse viva**. Todo bloque nuevo suma al menos una animación.
- **No interactivo** (cards informativas, badges, marcadores): animación one-shot al entrar en viewport, sin hover, cursor default. No prometas interacción que no existe.
- **Interactivo**: hover explícito + transition ≥ 0.3s.
- Decorativas continuas (ambient, breathing, parallax) bienvenidas si no son ruido.
- ❌ **Nunca** una sección o componente puramente estático. Si no se mueve nada, no terminó.

### Antes de decir "listo", auditar
1. ¿Los gaps siguen la escala de 4? 2. ¿Padding vertical correcto? 3. ¿`mt-6` mínimo bajo los títulos? 4. ¿Hover en todo lo clickeable? 5. ¿Funciona en `sm`, `md` y `lg`?
Si alguna respuesta es "no", no está listo.

---

## 3. 🧠 Principio UX/UI — el portfolio es la prueba

**Cada decisión de copy, layout, jerarquía, agrupación e interacción debe poder defenderse con una ley UX reconocida.** Si no podés explicar el porqué en términos de Miller, Jakob, Estética-Usabilidad, Similitud, Proximidad, Hick o Fitts, no está listo.

No es decoración intelectual: es la prueba, sin discurso, de que el dueño del portfolio sabe lo que hace. Los reclutadores de producto reconocen estos patrones aunque no los citen.

- **Miller (7±2)**: chunks de 4-5 items máximo. Si son 9, agrupar en 3 de 3.
- **Jakob**: patrones conocidos (timeline CV, breadcrumbs, X arriba a la derecha) bajan la carga cognitiva. No reinventar UI básica.
- **Estética-Usabilidad**: lo que se ve cuidado se percibe como funcional. Spacing prolijo y menos cromo > features extra mal terminadas.
- **Similitud / Proximidad**: agrupar visualmente lo del mismo tipo; lo relacionado va junto.
- **Hick**: menos opciones, decisión más rápida. No saturar el Hero de CTAs.

Cuando el cambio sea de copy o estructura, mencionar la ley aplicada en el commit. Así la justificación queda en el git log.

---

## 4. 🔒 Confidencialidad y NDA — FutbolTalent

**REGLA ESTRICTA. Leer antes de tocar texto, imagen o metadata de `futbol-talent-pro`.**

- **Vocabulario prohibido**: *freemium, premium, monetización, inversores, fundadores, Flutter*. Aplica a `case_study_futbol-talent-pro` en ambos JSON y al entry en `projects.ts` (tagline, description, metadata, alts).
- **Nunca revelar** flujos de negocio, estrategias de retención ni métricas internas — incluidos números que impliquen escala del producto.
- **Framing obligatorio**: siempre **MVP validado técnicamente**, con eje en **arquitectura de información** y **reducción de carga cognitiva**.
- **NO ocultar** `metadata.client` (`FutbolTalent.Pro`), el `title` ni el `slug`: el vínculo laboral ya es público y el NDA no lo restringe.
- **Material permitido**: wireframes de baja/media, flujos, design system, user personas. **Nunca** pantallas finales del producto.

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
- **Radius** 12px cards / 999px pills · **Easing** `cubic-bezier(0.16, 1, 0.3, 1)`
- **Tipografía**: Space Grotesk (display) + Geist (body) + Geist Mono (labels) → *pendiente de reemplazo, ver F3*
- Concepto: "minimalismo técnico pero cálido".

---

## 6. Estado actual — qué existe hoy

**Deploy**: https://tiagocollado.vercel.app/ · cada push a `main` redeploya. Build de referencia: **21 páginas SSG**, TS limpio, sin warnings.

**Defaults**: tema **dark**, locale **`en`** (`/` redirige a `/en`; las URLs `/es/...` siguen vivas).

**Capa "frontend creativo"**: Lenis smooth scroll (con reset de scroll en cambio de ruta) · custom cursor dot+ring con variants `default | link | view | drag` · SplitText char reveal · magnetic hover + `<MagneticLink>` · grain SVG global · scrollbar custom terracota · `<MotionConfig reducedMotion="user">` global.

**Home**: Navbar `h-16` fijo (NavLogo izq · links centrados · LanguageToggle + tema der · hamburger en `<lg`) · Hero con NameLogo GOTYA sticky que achica con el scroll y hace handoff al navbar, lema en dos líneas, CTA magnético con chevrons e `InteractiveDotGrid` · ServicesMarquee con fondo invertido · grilla Bento de proyectos · About 4.0 (micro-labels, claim con bold, copy a la derecha, firma) · Stack con carrusel infinito · **bloque de cierre unificado** (ver abajo).

**Bloque de cierre** (Contact + Footer): se leen como una sola pieza. Contact no cierra su padding inferior y el Footer arranca pegado, sin `border-t` entre medio. Contact lleva el micro-label, una **pregunta corta sin párrafo de body** (quien llega acá ya hizo click en "Hablemos": viene con intención, no hay que volver a venderle), el mail en **mono grande** con botón de copiar al portapapeles, y los 4 canales (LinkedIn / GitHub / WhatsApp / CV). El Footer es una única barra de tres zonas: copyright · back-to-top · crédito. **En mobile (`<sm`) esa barra pasa a 2 columnas**: copyright y crédito apilados a la izquierda, back-to-top a la derecha abarcando las dos filas (`row-span-2`) y centrado contra ellas — la mitad derecha es la zona de menor costo motor para el pulgar (Fitts). Las posiciones van explícitas (`col-start`/`row-start`) y se resetean con `sm:*-auto`, porque el orden del DOM es copyright → botón → crédito y el auto-placement pondría el crédito en el lugar equivocado.

> El bloque va dentro de un `<div className="min-h-screen flex flex-col justify-between">` en `page.tsx`: al entrar por el ancla `#contact` ocupa exactamente una pantalla, con la barra del footer pegada abajo. Es un `div` y no un `section`/`main` a propósito — esos scopearían al `<footer>` y le sacarían el landmark.

> ⚠️ **Ese razonamiento estaba anulado un nivel más arriba**: `layout.tsx` envuelve todo en `<main className="pt-16">`, y un `<footer>` descendiente de `<main>` pierde el rol `contentinfo` por spec — cuidar el wrapper del home no alcanzaba. **Se resuelve con `role="contentinfo"` explícito en el `<footer>`**, que le gana al mapeo implícito. Ese atributo **no es redundante: si se saca, el landmark desaparece** y no lo avisa ni el build ni el linter.

**El `<Footer />` cierra el home Y los seis case studies.** Antes era solo del home (la card de "próximo proyecto" oficiaba de cierre), pero al pie de un case study largo faltaba el camino de vuelta arriba. El cierre del case study es entonces `CaseStudyNextNav` + `Footer`.

> ⚠️ **`id="top"` es requisito, no detalle.** El back-to-top es un `<a href="#top">`; toda página que renderee el `<Footer />` necesita ese id o el botón queda **muerto sin dar ningún error** — el build pasa, no hay warning, simplemente no scrollea. Hoy vive en el `<section>` del Hero (home) y en el `<div>` raíz del case study.

**Cierre del case study**: los dos paths van en **una sola fila** desde `md+` — pill ghost "Ver todos los proyectos" en columna `auto` a la izquierda, card "Próximo proyecto" en `1fr` a la derecha. La card es el CTA primario inequívoco (tamaño, fondo, thumbnail, glow en hover); la pill no compite (Hick). La card va **primero en el DOM** y las columnas se cruzan con `md:order-*`: así el apilado en mobile sale correcto sin `order`, y el primario encabeza el orden de tabulación.

**Back-to-top**: `<a href="#top">` con el `id="top"` en el `<section>` del Hero. Lenis monta con `anchors: true`, así que lo intercepta y hace el scroll suave él. Nunca `window.scrollTo`: pelearía contra su animación. Las dos flechas apiladas suben en loop mientras hay hover.

**Case studies** (layout Awwwards, los 7): grid 12-col con sidebar sticky (Cliente / Año / Rol / Duración / Equipo / Stack / NDA / Links) + main editorial con 4 secciones — **Intro → El desafío → Cómo lo resolví → Lo entregado + Cierre**. Componentes en `src/components/case-study/`.

**Convención de contenido**: un case study real necesita `awwwardsLayout: true` + 12 keys en ambos JSON (`intro`, `challenge`, `decision_1-3_title/body`, `delivered_1-3`, `closing`). La key **`process`** es opcional (bajada de "Cómo lo resolví") y se carga con `t.has()`. Si falta una obligatoria, el catch deja `hasCaseStudy: false` y el cuerpo no se renderea.

**Imágenes de case study**: en mobile se ven completas y quietas (sin crop ni parallax); el recorte y el parallax arrancan en `md+`. No tienen hover ni cursor custom porque no abren nada.

**Open Graph**: `src/app/[locale]/opengraph-image.tsx` genera un PNG 1200×630 en build time: **solo la marca G centrada** sobre el fondo oscuro, **sin texto**. Al vivir en el segmento `[locale]` aplica también a `/projects/[slug]`: compartir cualquier link muestra la marca, no una captura del proyecto.

> **Por qué sin texto.** La versión anterior tenía eyebrow + wordmark + lema alineados a la izquierda. WhatsApp (y varios clientes de chat) no muestran la card ancha: **recortan un cuadrado del centro**, que entraba por la mitad del wordmark y dejaba un "ya" con texto ilegible alrededor. Una marca centrada sobrevive cualquier recorte. De yapa, al no haber texto la imagen **ya no depende de la tipografía**, así que F3 dejó de arrastrarla y los TTF de `src/app/[locale]/fonts/` se borraron del repo.

> El SVG se lee de `src/app/icon.svg` — **el mismo archivo que el favicon**, no una copia. Cambiar el logotipo actualiza las dos cosas a la vez. Va como data URI en un `<img>` porque es lo que satori soporta de forma confiable.

> ⚠️ Las dos imágenes (`es` / `en`) ahora son **idénticas byte a byte, a propósito**: sin texto no hay nada que localizar. No confundir con §9.15, que describe exactamente ese síntoma como un bug — ahí la causa era no leer `params`.

> Medidas reales, verificadas decodificando el PNG: el `<img>` es de 460px pero la **tinta** mide 316×344 (el `icon.svg` tiene margen interno y la G está abierta a la derecha), o sea ~50% del cuadro que recorta WhatsApp. Por esa abertura la G no es simétrica y su centro cae ~16px a la izquierda del centro del lienzo. Es intencional, no lo "arregles".

> ✅ El lema **ya no está duplicado**. Vivía hardcodeado en `opengraph-image.tsx` además de en `hero.headline` / `hero.subheadline`, y había que acordarse de tocarlo en los dos lados. Al sacarle el texto a la OG image, la única fuente de verdad volvieron a ser los JSON.

**i18n**: next-intl con paridad total ES/EN (17 namespaces). **Regla**: toda key nueva va en los dos archivos.

**Accesibilidad** (auditado sobre el HTML generado, no sobre el código):
- Un solo `<main>`, `<nav>`, `<header>` y `<footer>` por página · `lang` correcto por locale · 12 imágenes, **cero sin `alt`** · 17 `aria-label` cubriendo los controles de solo ícono.
- **Nada suprime el focus ring del browser**, así que el foco de teclado se ve en todo. La única excepción es `<main>`, que lo suprime a propósito: recibe foco solo por script desde el skip link, y un contorno alrededor de toda la página se lee como un bug. **No agregar más excepciones.**
- El cursor custom **no** oculta el nativo (no hay ninguna regla `cursor: none`), así que no interfiere con el foco.
- **Skip link** (`SkipLink.tsx`): primer elemento focusable, invisible hasta recibir foco. Es un client component con `onClick` + `preventDefault` en vez de un `<a href="#main">` pelado, porque Lenis intercepta las anclas y puede comerse el movimiento de foco nativo — que acá es lo único que importa, ya que `<main>` arranca al tope y no hay nada que scrollear.
- **Jerarquía de headings**: el case study da `h1 → h2 → h3` sin saltos. Ojo: el label de `CaseStudySection` es un **`<h2>` que se ve como micro-label**. Era un `<p>`, y por eso el outline salía `h1 → h3` con el único `h2` siendo la card del pie. El tamaño chico es decisión visual, no jerárquica — **no lo devuelvas a `<p>`**.

---

## 7. Proyectos del portfolio

Orden del grid = campo `order`; el ancho lo define `featured` (grilla de 3 columnas, `featured` ocupa 2).

| # | Proyecto | Año | Grid | Qué es |
|---|---|---|---|---|
| 1 | **Pulso Creativo** | 2026 | 2 col | Consultora B2B 25+ años. Sitio institucional, contacto dual, rediseño UX del contenido. |
| 2 | **Paseo Güemes Hotel** | 2026 | 1 col | Hotel 3★ en Salta. UX/UI + WordPress, reserva directa contra OTAs. |
| 3 | **FutbolTalentPro** | 2025 | 1 col | UX/UI de plataforma de scouting. **Bajo NDA — ver sección 4.** |
| 4 | **El Ritual del Tono** | 2025 | 2 col | Full-stack MERN con demo en vivo. |
| 5 | **Multibrand Design System** | 2025 | 1 col | Simulación laboral No Country, equipo de 6. |
| 6 | **Recuérdalo** | 2025 | 1 col | Proyecto universitario, UX inclusivo para adultos 70+. |
| 7 | **Cabify Music Match** | 2023 | 1 col | Concept UX/UI, prototipo iPhone 14. |

Las tres filas cierran exactas: `[2+1] · [1+2] · [1+1+1]` — el ancho alterna entre filas, no se repite.

**Fuera del portfolio**: Retro Kicks, Govah, SoundCloud Redesign, Rick & Morty Explorer.

**Regla**: salvo que se diga "académico" o "universitario", se asume que el proyecto es real. Hoy solo Recuérdalo está flageado como universitario.

### Stack que se muestra en el carrusel
Solo lo que Tiago pueda defender en una entrevista.
- ✅ **Diseño**: Figma, FigJam, Photoshop, Illustrator, Premiere
- ✅ **Frontend**: HTML5, CSS3, React, Next.js, Tailwind
- ✅ **UX**: Research, Writing, Prototyping, User Testing, Card Sorting, Design Systems, Accessibility
- ✅ **Otros**: IA generativa aplicada al diseño, Git/GitHub, WordPress
- ❌ **No incluir**: MongoDB, Node.js, TypeScript, Express (los tocó, no los domina)

> Excepción: en el case study de El Ritual del Tono sí se nombran Mongo/Node/Express porque son el contexto de ese proyecto. Distinto a promocionarlos como habilidad general.

> **Herramientas propias**: no nombrar los temas de WordPress que usa (decisión de Tiago). En la copy va "un tema liviano" y el porqué de la elección. El resto del stack (Elementor, WPForms, Rank Math, LiteSpeed) sí se nombra.

---

## 8. 🚦 Qué falta hacer

**REGLA: una tarea por sesión.** No abrir frentes en paralelo (ya pasó factura). Excepción válida: un plan en fases acordado de antemano, con check-in entre fases.

### Bloqueado por contenido de Tiago
| ID | Tarea | Notas |
|---|---|---|
| **IMG-1** | **Rehacer las 35 imágenes** — 7 covers + 28 de case study | Reemplaza a NDA-img, WP-img y B1, que quedaron sin objeto al darse de baja todas las provisorias (§10). 📋 **La hoja de ruta completa está en `BRIEF-IMAGENES.md`** (raíz del repo): formatos, naming, dirección de arte por proyecto, la lista de las 35 con checkbox y cómo cablear cada una. **Ese archivo se borra cuando estén todas.** Las medidas permanentes están en §2. ✅ **D3 ya está hecho**, así que el cableado es solo agregar el `src`: no hay que optimizar nada a mano ni pensar en `srcset`. |
| **B3** | Métricas reales de FutbolTalentPro | Sin data el caso cierra sin impacto duro. |

### Marca
| ID | Tarea | Notas |
|---|---|---|

### Diseño
| ID | Tarea | Esfuerzo | Notas |
|---|---|---|---|
| **F3** | Tipografía principal nueva | 30 min | Reemplazar Space Grotesk + Geist. Opciones: Inter, Manrope, Satoshi, General Sans, Aeonik, Cabinet Grotesk. **Charlar el combo antes de codear.** Toca `layout.tsx` + `@theme`. ✅ **Ya no arrastra la OG image**: al quedar sin texto dejó de depender de la tipografía (§6). Antes había que rehacerla o la miniatura quedaba con la fuente vieja. |

### Técnico
| ID | Tarea | Notas |
|---|---|---|
| **T2** | Lighthouse audit real | Manual en DevTools. No hay números del bundle post-rework. |
| **T3** | ¿Mover `CLAUDE.md` y `AGENTS.md` a un `.docs/` privado? | Decisión pendiente de Tiago para cuando el repo público madure. Revisar también el `.gitignore`. |
| **E** | Easter egg · Vercel Analytics · dominio NIC.ar | Cuando haya ganas. |

---

## 9. ⚠️ Errores y aprendizajes — no repetir

### CSS y Tailwind
1. **Regla universal unlayered mata las utilities** → ver sección 1. Costó 3 iteraciones descubrirlo: Tiago veía "no cambió nada" y yo asumía que mis ediciones se aplicaban.
2. **Inline styles de spacing son síntoma, no prolijidad rota.** Antes de sacarlos, verificar que las utilities funcionen: si están muertas por el error #1, al sacarlos quedás con cero padding.
3. **Chrome ≥ 121**: `scrollbar-width` toma precedencia y anula `::-webkit-scrollbar`. Aislar `scrollbar-width`/`scrollbar-color` en `@supports (-moz-appearance: none)` para Firefox.
4. **`color-mix(in srgb, var(--bg-primary) X%, transparent)`** es la forma limpia de hacer overlays theme-aware sin duplicar reglas light/dark. Evitar `rgba()` hardcodeado.
5. **Texto chico sobre imagen** (covers, hero): nunca confiar solo en el color del texto. Pills bordeadas con bg semi-translúcido + `backdrop-filter: blur(4px)`.

### Framer Motion y animación
6. **SplitText**: los chars con `display: inline-block` permiten line break entre cualquier par de letras y parten palabras al medio. El patrón correcto es **wrapper por palabra con `whitespace-nowrap`**.
7. **`staggerChildren` solo llega a hijos motion DIRECTOS.** Con wrappers intermedios no propaga: calcular el delay a mano (`base + i * stagger`).
8. **Framer ignora la regla CSS de `prefers-reduced-motion`** porque anima por JS. Lo que lo arregla es `<MotionConfig reducedMotion="user">` global.
9. **`mix-blend-difference` falla con fondos tema-mid** (sobre el beige daba un cursor invisible). Usar colores sólidos theme-aware.

### Next.js y librerías
10. **Lenis pelea con `scroll-behavior: smooth`** → sacar la regla CSS del `html`.
11. **Lenis no resetea el scroll entre rutas**: forzar `lenis.scrollTo(0, { immediate: true })` en cada cambio de `pathname`.
12. **Contextos "sticky" tras navegar**: si un componente setea estado en `mouseEnter` y confía en `mouseLeave` para limpiarlo, al navegar nunca se limpia. Resetear en el provider por `pathname`.
13. **`ImageResponse` (satori) exige `display: flex` explícito** en todo `div` con más de un hijo, y conviene prerenderear la imagen con `generateStaticParams`: mientras la ruta es dinámica el error no aparece en build y explota recién en producción.
14. **Satori NO soporta WOFF2** — que es justo lo único que baja `next/font/google`. Para embeber una fuente en `ImageResponse` hace falta **TTF/OTF/WOFF**, commiteado en el repo y leído con `fs`. Los TTF de Google se consiguen pidiéndole a la API de fonts con un user-agent viejo: `curl -A "Mozilla/4.0" ".../css2?family=..."` devuelve URLs `.ttf` en vez de `.woff2`. *(Hoy la OG image no lleva texto, así que esto no aplica al repo — vale si alguna vez se le vuelve a poner.)*
15. **`params` también es Promise en `opengraph-image.tsx`**, no solo en las pages. Si no lo leés, la imagen sale igual para todos los locales y **nadie se entera**: el build pasa y las dos imágenes quedan idénticas byte a byte. Se detecta comparando los hashes de `.next/server/app/{es,en}/opengraph-image.body`. *(Hoy las dos SON idénticas a propósito, ver §6: sin texto no hay nada que localizar.)*
16. **Adobe no está en simple-icons** (licencia). Para Ps/Ai/Pr usamos cuadrados bordeados con iniciales.
26. **Un `<img>` que satori no puede resolver NO rompe el build**: la imagen sale igual, con ese elemento vacío. Un build verde no prueba que el gráfico se haya dibujado. Para verificarlo hay que **decodificar el PNG generado** y contar píxeles del color esperado — `.next/server/app/{es,en}/opengraph-image.body` es un PNG común y se parsea con `struct` + `zlib`, sin PIL. Así se descubrió que la tinta real de la marca ocupa solo ~69% del box del `<img>` (el `icon.svg` tiene margen interno), dato que ningún build iba a avisar.

### HTML, layout y accesibilidad
22. **`max-w` + padding en el mismo elemento desalinea** — ver §2. El síntoma no es un `max-w` raro: el Stack tenía el valor correcto (`7xl`) y estaba igual de roto. Auditar *dónde* vive el padding, no qué número tiene el `max-w`.
23. **Un `<footer>` dentro de `<main>` NO es landmark `contentinfo`.** El rol se pierde si es descendiente de `article`, `aside`, `main`, `nav` o `section` — y no hay warning de build ni de linter. Cuidado con "arreglarlo" un nivel y darlo por hecho: el wrapper del home ya era un `div` a propósito, pero el `<main>` de `layout.tsx` lo anulaba igual. **Un `role` explícito le gana siempre al mapeo implícito**, así que `role="contentinfo"` lo resuelve sin reestructurar el DOM. Vale para todos los landmarks, no solo este.
24. **Un ancla rota es silenciosa.** `<a href="#top">` sin un `id="top"` en la página no tira error, no rompe el build, no loguea nada: simplemente no pasa nada al clickear. Al reusar un componente con anclas internas en una página nueva, verificar el destino en el HTML generado (`grep -o 'id="top"' .next/server/app/**/*.html`).
25. **Con `grid-cols` de 2 columnas y 3 hijos, el auto-placement miente.** Si el orden del DOM no coincide con el visual, hay que poner `col-start`/`row-start` explícitos y resetearlos en el breakpoint de arriba (`sm:col-start-auto`). Preferir siempre dejar el elemento primario **primero en el DOM** y cruzar con `order` en desktop: así el apilado mobile sale gratis y el orden de tabulación arranca por el CTA principal.

27. **`next/image` emite el atributo como `srcSet` (camelCase) en el HTML estático**, no `srcset`. Un `grep srcset` case-sensitive sobre `.next/server/app/*.html` da cero resultados y parece que la migración no funcionó. Buscar con `grep -i`. El browser no se entera: los atributos HTML son case-insensitive.
28. **`motion.create(Image)` va a nivel de módulo, nunca adentro del componente.** `motion.img` no sirve una vez que el `<img>` lo rendea Next, así que el parallax de `CaseStudyImage` necesita envolver el componente. Si esa llamada quedara dentro del render, React vería un tipo de componente distinto en cada pasada, desmontaría el `<img>` y la imagen se recargaría entera en cada re-render.
29. **Sin `sizes`, migrar a `next/image` no sirve de nada.** El browser asume `100vw` y baja del `srcset` la variante más grande — exactamente el problema que la migración venía a resolver. Es obligatorio en todo `fill` y en toda imagen que CSS haga responsive; el valor sale del layout real (§2), no a ojo.

### Git y edición de archivos
17. **`npm run build` compila el árbol de trabajo, no el commit.** Un build verde local no prueba que un commit parcial sea auto-consistente. Antes de pushear un commit acotado: `git show --stat <sha>` y comparar contra `git show origin/main:<archivo>`.
18. **Nunca parsear bloques de `projects.ts` buscando el próximo `},`**: esa línea es el cierre de `tagline`, no el del proyecto. Hay que **contar llaves** desde la apertura. Un parser ingenuo ya corrompió el archivo dos veces; la recuperación limpia es `git show HEAD:<archivo>` a un temporal y reconstruir encima.

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
│   ├── case-study/   # Header · Sidebar · Section · Image · NextNav
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
└── types/index.ts    # Project · StackItem · Locale
```

**Imágenes**: `public/images/covers/{slug}-cover.*` (cards del home) · `public/images/case-study/{slug}/0[1-4]-*.*` (contextuales). **Las medidas para diseñarlas están en §2 ("Imágenes — medidas para diseñar en Figma")** — no improvisar tamaños acá. Nada más va en `public/`: **todo lo que está ahí se sirve en producción** (ver §11).

> ⚠️ **Hoy NO hay ninguna imagen en el repo.** Las 31 que había (7 covers + 24 de case study) eran provisorias, se leían como generadas con IA y se dieron de baja: en un portfolio de UX/UI una imagen que parece IA contradice el argumento del portfolio más fuerte de lo que un hueco lo debilita. Se borraron los archivos **y** las referencias (`coverImage: null` y sin `src` en los `imageBriefs`).

> **Cómo volver a ponerlas, de a una**: subís el archivo a la ruta que corresponde y le agregás el `src` al brief (o el `coverImage` al proyecto). No hace falta tocar ningún componente — `ProjectCard` envuelve el cover en `{project.coverImage && …}` y la page rendea cada `CaseStudyImage` solo si el brief tiene `src`. 📋 **Hoja de ruta completa en `BRIEF-IMAGENES.md`** (documento temporal, se borra al terminar).

> **Por qué no quedaron los placeholders "BUILDING"**: sin las imágenes, esas cajas punteadas aparecían **28 veces** (4 × 7 case studies) y convertían el sitio en una obra en construcción — otra señal negativa, y encima el texto está hardcodeado en inglés también en la versión ES. El componente sigue soportando el modo placeholder; simplemente no se usa mientras falten las imágenes.
Los covers **no deben tener texto** (la card ya superpone tag, año y título) y tienen que funcionar en escala de grises, porque en idle van desaturados.

> **Todas las imágenes pasan por `next/image`** (D3, hecho). Los tres puntos donde se rendean son `ProjectCard` (cover, modo `fill`), `CaseStudyNextNav` (thumb, modo `fill`) y `CaseStudyImage` (modo `width`/`height`, porque en mobile la imagen va en flujo normal y `fill` la pondría absolute siempre). La **única** excepción es el `<img>` de `opengraph-image.tsx`, que rendea satori y no el browser — tiene su `eslint-disable` con el porqué al lado.

**Íconos**: `lucide-react` para UI · `simple-icons` para marcas del Stack · Adobe como cuadrados con iniciales. El Footer ya no usa SVGs de marca: sus links son mono + glifo (↗ navega, ↓ descarga). Para sumar uno nuevo, editar `SIMPLE_ICONS`, `LUCIDE_ICONS` o `ADOBE_INITIALS` en `StackIcon.tsx`. Todo monocromo con `currentColor`.

---

## 11. Referencias visuales

**Regla**: identificar la idea concreta a replicar (un patrón, una proporción, una micro-interacción), **no copiar pixel-perfect**.

**Portfolios premium**: [isadeburgh](https://isadeburgh.com/) (el "Get in touch" que rota y frena en hover — ya replicado en `MarqueeLink`; y su footer, de donde salió el bloque de cierre unificado: micro-label sobre el mail, botón copiar y barra de tres zonas. **No** se copió el estilo dibujado a mano, ni el serif del mail — sin serif en el stack, el contraste lo da Geist Mono —, ni el wordmark gigante de remate, que se probó y se descartó) · [artemiilebedev](https://artemiilebedev.com/) · [louispaquet](https://louispaquet.com/)

**Case studies Awwwards** (copy super corta en todos, sidebar de metadata, tipografía protagonista): [mikekus](https://mikekus.com/) · [joonassandell](https://joonassandell.com/) · [henriheymans](https://henriheymans.com/) · [silviasguotti](https://silviasguotti.design/) · [alejandromejias](https://www.alejandromejias.com.au/) · [yaremenko](https://yaremenko.design/) · (https://abhishekjha.me/?ref=lapaninja)

**Ya no hay screenshots de referencia en el repo.** Los últimos cuatro (`navbarshrink_reference` y variantes) se borraron: describían el navbar que se achica con el scroll, algo ya resuelto con el handoff sticky NameLogo → NavLogo. Antes de eso, esta sección listaba otras nueve (`hero_reference`, `about_reference2`, `casestudy_reference`, etc.) que hacía rato no existían.

> ⚠️ **Si volvés a sumar refs visuales, NO las pongas en `public/`.** Ahí Next las sirve en producción: las cuatro anteriores eran navegables en `tiagocollado.vercel.app/images/references/*.png` (verificado, HTTP 200) y sumaban 2,6 MB al deploy sin que las usara ningún código. Van fuera de `public/` y, si no aportan al portfolio, directamente fuera del repo.

> Las decisiones de diseño que salieron de esas referencias ya están escritas en §2 y §6, así que no hay nada que recuperar. Si alguna hiciera falta, sigue en el historial: `git show <sha>:public/images/references/<archivo>`.

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
