@AGENTS.md
# Portfolio Tiago Collado — Contexto del proyecto

---

## ⚠️ TAILWIND V4 + CSS CASCADE LAYERS — LEER ANTES DE EDITAR `globals.css`

**Bug crítico que ya nos comió tiempo: NO escribir reglas universales (`* { ... }`) con `margin` o `padding` fuera de un `@layer`.**

En Tailwind v4 las utilities (`px-*`, `py-*`, `mt-*`, `mb-*`, etc.) viven dentro de `@layer utilities`. En CSS Cascade Layers, las reglas **fuera de cualquier `@layer` ganan SIEMPRE** sobre las que están en layers — sin importar la especificidad. Una regla como `* { padding: 0 }` mata todas las utilities de padding del proyecto.

Reglas:
- ❌ Nunca poner `padding`, `margin` o relacionados en una regla universal `* { ... }` unlayered.
- ✅ El reset de margin/padding ya lo hace el preflight de Tailwind sobre los elementos correctos (h1-h6, p, ul, ol, etc.). No hace falta replicarlo.
- ✅ Si necesitás un reset custom, ponelo dentro de `@layer base { ... }` para que respete el orden de layers.
- ✅ Inline styles (`style={{ padding: '24px' }}`) siempre ganan porque tienen specificity 1,0,0,0 — son el escape hatch si algo se rompe, pero indican un bug abajo.

Si en algún momento las utilities `px-*`/`py-*` no parecen estar tomando efecto, **lo primero a revisar es globals.css** buscando reglas universales.

---

## 🎨 REGLAS DE DISEÑO — LEER ANTES DE TOCAR UI

**Antes de cualquier cambio visual, releer esta sección. Si un cambio no está cubierto acá, preguntar antes de improvisar valores.**

### Spacing scale (usar SIEMPRE múltiplos de 4)
- xs: 4px · sm: 8px · md: 16px · lg: 24px
- xl: 32px · 2xl: 48px · 3xl: 64px · 4xl: 96px · 5xl: 128px

### Padding vertical de secciones
- Mobile: `py-20` (80px)
- Tablet: `md:py-28` (112px)
- Desktop: `lg:py-36` (144px)

### Gap entre elementos (crítico — esto es lo que hoy se ve "pegado")
- H1 → párrafo inmediato: `mt-6` (24px)
- H1 → CTA: `mt-10 md:mt-12` (40–48px mínimo)
- H2 → contenido: `mt-8 md:mt-10`
- Párrafo → CTA: `mt-8` mínimo
- Entre párrafos consecutivos: `space-y-6` (24px) mínimo

### Tipografía
- Display (H1, H2): `leading-tight` (1.15)
- Body: `leading-relaxed` (1.625) — **NUNCA menos que esto**
- Párrafos largos: `max-w-prose` (~65ch) para legibilidad

### Animaciones (Framer Motion)
- Duración estándar: `0.6s`
- Easing: `[0.16, 1, 0.3, 1]` (expo-out, ya definido en globals.css)
- Stagger de hijos: `0.08–0.12s`
- Hover scale en cards: máximo `1.02` (nunca más de 1.05, se ve barato)
- Fade-in en viewport: `y: 24 → 0` (no menos de 24px de desplazamiento)
- Duración mínima de cualquier animación: `0.3s` (menos se siente brusco)

### Hover states obligatorios
- **Project cards**: shadow-lg → shadow-2xl + subtle glow con accent terracota
- **Botones primarios**: bg-accent → bg-accent-hover + `-translate-y-0.5`
- **Links de texto**: underline con offset animado (`underline-offset-4` → `underline-offset-8` en hover)
- **Toggles navbar**: scale 1 → 1.1 + rotate sutil

### Reglas de "NO"
- ❌ NUNCA gap menor a 16px entre un título y su siguiente elemento
- ❌ NUNCA secciones con menos de `py-20` en mobile
- ❌ NUNCA animaciones de menos de 0.3s
- ❌ NUNCA `leading-normal` o menos en párrafos (ilegible en pantallas grandes)
- ❌ NUNCA texto sin `max-w-prose` o `max-w-2xl` en bloques narrativos

### Antes de decir "listo", auditar
Cuando termines un cambio de UI, hacé un check mental (o explícito en el mensaje):
1. ¿Los gaps siguen la scale de múltiplos de 4?
2. ¿Las secciones tienen el padding vertical correcto?
3. ¿Los títulos tienen mínimo `mt-6` al próximo elemento?
4. ¿Hay hover state en todo lo clickeable?
5. ¿Funciona igual de bien en mobile (`sm`), tablet (`md`) y desktop (`lg`)?

Si alguna respuesta es "no", no está listo.

### Animation polish — eje cross-cutting (no negociable)

El portfolio es de un UX/UI Designer profesional, **la página tiene que sentirse viva en todo momento**. Cualquier sección o componente nuevo debería sumar al menos una animación, alineada al concepto premium:

- **Scroll-in en cualquier bloque nuevo**: fade + slide-up 24px, 0.6s, easing expo-out (`[0.16, 1, 0.3, 1]`). Mínimo. No metas un bloque estático.
- **Stagger en grupos repetidos** (cards, lista de stack pills, items numerados): delay 0.08–0.12s entre hijos.
- **Elementos NO interactivos** (cards informativas, badges, marcadores): animación **one-shot al entrar en viewport**, sin hover state, cursor default. La animación señala "vivo y cuidado" sin invitar a clickear.
- **Elementos interactivos**: hover state explícito + transition 0.3s mínimo (CLAUDE.md ya cubre la lista de hover obligatorios).
- **Animaciones decorativas continuas** (background ambient, breathing, parallax) están bienvenidas si no son ruido.
- ❌ **NUNCA** una sección o componente puramente estático. Si no se mueve nada, no terminó.

---

## 🧠 PRINCIPIO UX/UI — el portfolio es la prueba

**El portfolio mismo es el case study principal: cada decisión de copy, layout, jerarquía, agrupación, interacción y animación debe poder defenderse con una ley UX o heurística reconocida.** Si no podés explicar por qué hiciste algo en términos de Miller, Jakob, Estética-Usabilidad, Similitud, Proximidad, Hick, Fitts, Región Común u otra heurística aplicable — no está listo.

Esto NO es decoración intelectual: es la prueba (sin discurso) de que el dueño del portfolio sabe lo que hace. Reclutadores de producto reconocen estos patrones aunque no los citen.

### Aplicaciones recurrentes
- **Miller (7±2)**: chunks de 4-5 items max en listas/grids/secciones. Si tenés que mostrar 9, agrupalos en 3 grupos de 3.
- **Jakob (familiaridad)**: patrones conocidos (CV-style timeline, breadcrumbs, modal dismissal con X arriba-derecha) bajan la carga cognitiva. No reinventar UI básica.
- **Estética-Usabilidad**: lo que se ve cuidado se percibe como funcional. Spacing prolijo y menos cromo > features extra mal terminadas.
- **Similitud**: agrupar visualmente lo que es del mismo tipo (3 cards iguales = grupo cohesivo, 3 cards distintas = caos).
- **Proximidad**: elementos relacionados van juntos (label encima del input, número+título dentro del mismo bloque).
- **Hick**: menos opciones = decisión más rápida. No saturar Hero con 5 CTAs.

### En commits y comentarios
Cuando hagas un cambio de copy/estructura, mencioná cuál ley aplicaste si es relevante. Ejemplo: "About en 4 bloques (Miller — chunks digeribles)". No es para presumir — es para que la justificación quede en el git log y en los comments-cabecera de los componentes.

---

## Sobre mí
- **Nombre**: Tiago Collado
- **Rol**: Estudiante avanzado (último año) de Licenciatura en Tecnología Multimedial, Universidad Maimónides
- **Perfil**: Híbrido UX/UI Designer + Frontend Developer (más fuerte en diseño que en programación)
- **Target del portfolio**: Reclutadores de equipos de producto (pymes a corporaciones), busco roles donde valoren tanto diseño como ejecución técnica
- **Contacto**: tiago.collado@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/tiagocollado/
- **GitHub**: https://github.com/tiagocollado

## ⚠️ Nota importante sobre el nivel técnico
Tiago todavía está estudiando y la programación no es su gran fuerte. **El código que se escriba debe ser lo más entendible posible**. Priorizá claridad sobre abstracciones avanzadas. Explicá el "por qué" de las decisiones técnicas.

---

## Estado actual del proyecto

> **Nota futura**: Tiago quizá decida ocultar `CLAUDE.md` y `AGENTS.md` del repo público (o moverlos a un `.docs/` privado) cuando el proyecto madure. Por ahora se quedan visibles para no romper el flujo. Si llegamos a ese momento, también revisar qué del `.gitignore` cambia.

---

## 📍 Dónde estamos ahora — última sesión: 2026-04-29

### Estado del proyecto
**Polish visual avanzado.** Cards, About 3.0 (75/25 grid + toolkit cards animadas) y favicon (T terracota geométrica) listos. Lo que sigue es contenido (mockups, métricas) o reestructura textual (case studies). Bases técnicas sólidas — i18n con paridad, animaciones decorativas funcionando, Tailwind v4 sin bugs de cascade, sin inline-style workarounds. Pendiente principal: mockups definitivos de 3 covers provisorios + métricas reales para sumar peso a los case studies.

### ✅ Tandas completadas
1. **Saneamiento técnico** — CSS vars rotas, spacing normalizado, dead code removido (CustomCursor, Toggles), Devicon CDN reemplazado. Bump lucide 1.9 → 1.11.
2. **InteractiveDotGrid** — canvas 2D en Hero con repulsión cuadrática del cursor, fallback CSS para touch, theme-aware vía MutationObserver, respeta `prefers-reduced-motion`.
3. **Gallery con Embla** — reemplazó el grid + setTimeout race condition. FM crossfade, prev/next con `lucide`, dots indicator, contador 01/05.
4. **`en.json` completado** — paridad total con `es.json` (74 keys, 5 case studies traducidos).
5. **Tanda A — fundamentos visuales**:
   - 🐛 **Bug crítico encontrado y corregido**: regla `* { padding: 0; margin: 0 }` unlayered en `globals.css` mataba TODAS las utilities `px-*`/`py-*`/`mt-*` del proyecto (Tailwind v4 + CSS Cascade Layers). Ver advertencia al inicio de este archivo.
   - 🐛 **Bug de doble `<main>`** corregido: `layout.tsx` + página de proyecto envolvían cada uno en `<main paddingTop=64>` → 128px de gap duplicado.
   - **Cleanup de inline-style workarounds** en Footer, ProjectCard, Hero (status pill), layout.tsx.
   - **Spacing calibrado**: `py-20 md:py-28 lg:py-36` vertical (con override asimétrico en About+Stack para que se lean como un bloque), `px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32` horizontal.
   - **Hero**: identidad (nombre + role) agrupada visualmente, separada del claim.
   - **Contact**: rediseñado parcialmente — pills compactas en lugar de cajones grandes, sin `min-h-screen`.
   - **Footer**: comprimido (info más cerca entre sí).
   - **About chips**: 40% más chicos.
6. **Tanda D — íconos del Stack**:
   - Componente `<StackIcon>` ([src/components/ui/StackIcon.tsx](src/components/ui/StackIcon.tsx)) con 3 estrategias: simple-icons (SVG monocromo `currentColor`), Adobe (cuadrado bordeado con iniciales `Ps/Ai/Pr`, también monocromo), lucide para conceptos sin marca.
   - `simple-icons ^15.x` instalado como dep — tree-shakeable, solo los imports usados van al bundle.
   - Pills sin lift en hover; única feedback es border que se vuelve terracota.
   - **Stack reordenado por prioridad de reclutador**: los primeros 7 ítems (Figma, UX Research, React, Design Systems, Next.js, Prototyping, Tailwind) son los más probables de ser leídos en los primeros segundos. Mezcla Design + UX + Frontend para mostrar perfil balanceado.
   - **Stack data alineado a CLAUDE.md**: TypeScript / Node.js / MongoDB sacados del carrusel ("lo tocó pero no es fuerte"). Sumados: FigJam, Adobe Premiere, UX Research, Prototyping, Design Systems, Accessibility.
   - Ícono de Accessibility cambiado a `Contrast` (lucide) — semánticamente más tight a a11y (color contrast es criterio core WCAG).
7. **Tanda B — rediseño de ProjectCard** (commit `20b584e`):
   - **Bug del overlay negro fijo en light mode → resuelto**: reemplazado por `color-mix(in srgb, var(--bg-primary) X%, transparent)`. En light el gradiente es claro (texto oscuro legible), en dark oscuro (texto claro legible). Theme-aware sin duplicar reglas.
   - **Tag tipo + año en pills bordeadas top-left** con bg semi-translúcido + `backdrop-filter: blur(4px)` — garantiza legibilidad sobre cualquier cover.
   - **Título display dominante bottom-left**, siempre visible (antes era `text-xl` y se mezclaba con tags+CTA en hover-reveal). Featured: `text-3xl/4xl/5xl`. Normal: `text-2xl/3xl/4xl`.
   - **Tags pills + CTA aparecen solo en hover** (mantengo el patrón opacity-0 → opacity-100).
   - **CTA pill SÓLIDO accent** (antes bordeado transparente) + flecha con micro-translate en hover.
   - **Glow border en hover**: `shadow-2xl shadow-accent/25 + hover:border-accent`.
   - **Coming soon overlay también theme-aware** (no más `rgba(0,0,0,0.5)` fijo).
   - **Type Project**: agregado campo opcional `year?: number`. Cargado en los 6 proyectos.
8. **About 2.0 — copy + estructura semántica** (commit `20b584e`):
   - **Copy reescrito** aplicando Ley de Miller + escaneabilidad en patrón F: 4 bloques cortos en lugar de 3 párrafos densos.
   - **Apertura nueva**: arranca con el rol real en Hotel Real Cafayate (desde cero, posicionamiento, estrategia, presencia activa hasta hoy), no con "soy estudiante". La formación pasa al final como contexto.
   - **Hook diferenciador en bold + display** como focal point: "No solo diseño interfaces. Las prototipo en Figma, las valido con usuarios y las codifico en React."
   - **Mission punchy**: "Busco equipos de producto donde diseño y desarrollo no se hablen por traductor. Mi objetivo: cerrar la brecha entre UX y código — handoffs limpios, decisiones de diseño técnicamente viables desde el día uno."
   - **Claim como h2**: "Diseño y código en una sola cabeza." (distinto al headline del Hero).
   - **Estructura HTML semántica**: `<header>` (eyebrow + h2) + grid (`<aside>` para áreas de práctica) + `<footer>` (ubicación). `aria-labelledby="about-heading"`.
   - **3 chips rediseñados como lista numerada editorial** (Opción A): sin chrome de botón, sin border, sin shadow, sin hover-translate. Solo número en mono accent + label en display ink-primary, divider sutil entre items. Honesto: no son interactivos, no fingen serlo.
   - **i18n**: keys nuevas (`claim`, `background`, `hybrid_path`, `hook`, `mission`, `location_label`, `location`) en es.json y en.json — paridad de 78 keys.
   - **Ubicación pasada a i18n** (antes hardcoded en español).
9. **Favicon — T terracota** (commit pendiente):
   - `src/app/icon.svg` con la "T" como `<path>` geométrico (no `<text>`, evita dependencia de Space Grotesk en el browser tab).
   - viewBox 32×32, padding 3px, barra superior 8px alta, stem 8px ancho, fill `#C96A3A`.
   - Eliminado `src/app/[locale]/favicon.ico` (Next 16 sólo lee `favicon.ico` en root de `app/`, no en segments — el archivo era el default huérfano del scaffold).
   - Next 16 file convention auto-genera `<link rel="icon" href="/icon.svg" sizes="any" type="image/svg+xml"/>`.
10. **About 3.0 — layout 75/25 + toolkit cards animadas** (commit pendiente):
    - **H2 claim removido** ("Diseño y código en una sola cabeza."). Eyebrow `SOBRE MÍ` promovido a `<h2>` semántico (mantiene accesibilidad). La copy entra directo, sin headline protagonista (Estética-Usabilidad: menos cromo, más contenido).
    - **Grid 2 columnas en lg+** (`[3fr_1fr]` = 75/25):
      - Izquierda (75%): 4 bloques copy + ubicación al final (`UBICACIÓN · Buenos Aires, Argentina`, `text-sm font-mono`, usa keys `contact.location_label/location`).
      - Derecha (25%): 3 cards toolkit content-height, `gap-8 md:gap-12` entre ellas.
    - **Toolkit cards** rediseñadas:
      - Background sutil con `var(--color-surface)`.
      - **Línea accent terracota** (32×1px) entre número y título — se "dibuja" de izq a der en scroll-in (`scaleX 0 → 1`, `transformOrigin: left`, delay `0.3s + i * 0.12`).
      - Número `text-xs font-mono accent` + título `text-base md:text-lg font-display`. Sub-copy removida por ahora (keys `toolkit_*_desc` quedan en json como placeholder por si vuelven).
      - **Sin hover state** — cursor default → claro que NO son botones. Animación es one-shot decorativa al entrar en viewport (Estética-Usabilidad + honestidad).
      - **Stagger entrance**: fade + slide-up 24px con delay incremental (0, 0.12, 0.24s), easing expo-out.
    - **Footer site-wide**: ubicación NO va en Footer (queda solo en About). Footer = links + divider + copyright.
    - **i18n**: keys `claim`, `location_label`, `location` removidas del bloque about (location se levanta de `contact.*`). Sumadas keys `toolkit_label`, `toolkit_1_title/2_title/3_title`, `toolkit_1_desc/2_desc/3_desc` (descs como placeholder).
    - **Heurísticas aplicadas**: Miller (4 bloques copy + 3 cards), Estética-Usabilidad (sin H2 claim — copy directa), Similitud + Proximidad (3 cards iguales con número+línea+título agrupados), Jakob (CV-style location al final).

---

### 🚦 Próximos pasos — orden recomendado

**REGLA**: una tarea por sesión. No abrir frentes en paralelo (ya nos pasó factura).

| # | Tarea | Tipo | Esfuerzo | Notas |
|---|---|---|---|---|
| **B1** | **Reemplazar covers provisorios** (FutbolTalentPro / Multibrand / Recuérdalo) | Tarea de Tiago | — | NO es código. Tiago tiene que generar/elegir mockups y reemplazar los archivos en `public/images/projects/{slug}-cover.jpg`. Hasta que lleguen, las cards muestran covers débiles. |
| **B2** | **Reestructurar case studies** (renombrar secciones, viñetas, separar Arquitectura/Interfaz) | Código + copy | 60-90 min | Tiago pidió en brief: renombrar "02 Propuesta de valor" → "Mi Rol y Contexto", "03 Insight" → "Desafíos y Decisiones", convertir prosa de Solución a viñetas, separar "Arquitectura Técnica" / "Decisiones de Interfaz". Toca `es.json` + `en.json` (5 case studies × 2 idiomas). Pesado pero acotado. |
| **B3** | **Sumar métricas + handoff destacado en FutbolTalentPro** | Código + copy | 30 min | **Bloqueado**: Tiago tiene que pasar números reales (% éxito en testing, tiempo ahorrado, etc.) y detalle de qué subió al handoff (tokens, components, doc). Si no hay data real, se puede saltar. |
| **C1** | **Agregar Govah + Pulso Creativo** como proyectos WordPress | Código + data | 45 min | Tiago decidió incluirlos. Links: govah.com.ar / pulsocreativo.com.ar. Necesito de Tiago: tagline, descripción, tags, screenshot/cover, año, qué hizo él específicamente. Ambos son clientes reales. |
| **C2** | **Tanda E — Rediseño de página de caso de estudio** | Código | 60-90 min | **Bloqueado**: Tiago tiene que pasar 1-2 referencias visuales o decidir dirección (editorial / cinematográfica / técnica). Sin eso, no codear. |
| **C3** | **Escalera intencional de `max-w`** | Código | 30-45 min | Tiago quiere diseñarla a propósito. Pendiente: definir el ritmo (ej. Hero angosto → Projects ancho → About angosto). Decisión antes de codear. |
| **D1** | **Botón "back to top" + reorder Footer** | Código | 60-90 min | Idea de Tiago. Implica reorganizar el centro del Footer (hoy ahí están redes + CV). Definir layout antes de codear. |
| **D2** | **Lightbox en Gallery + más imágenes por proyecto** | Código | 30-45 min | Cuando Tiago sume más imágenes en `public/images/gallery/{slug}/`, agregar click-para-expandir con FM. |
| **D3** | **Migración a `next/image`** en Gallery + ProjectCard | Código | 30 min | Mejora LCP. Se hace cuando los covers definitivos estén listos (después de B1). |
| **D4** | **Scroll-driven animations** (parallax, reveals encadenados) | Código | 60-90 min | Capa de polish. `useScroll` + `useTransform` de Framer Motion. |
| **D5** | **Navbar shrink en scroll** | Código | 20-30 min | Detalle premium chico, alto impacto. |
| **D6** | **CustomCursor reimplementación** | Código | 60 min | Si Tiago lo quiere de vuelta — el componente original estaba roto, se eliminó. |
| **D7** | **isadeburgh-style "get in touch" rotativo en Navbar** | Código | 30 min | Inspiración de Tiago: texto que rota in-place, pausa en hover, click va al mail. |
| **E** | Easter egg, Vercel Analytics, dominio NIC.ar custom | Varía | — | Cuando estén ganas / tiempo / decisión. |

**Recomendación de orden**: B1 (Tiago, generar mockups) → B2 (próxima sesión de código — case studies con leyes UX explícitas) → C1 (cuando Tiago pase data de WordPress projects) → D5 / D7 / D4 (animation polish global, ver eje cross-cutting al inicio).

---

### ⚠️ Errores y aprendizajes — leer antes de empezar sesión nueva

Lecciones concretas de equivocaciones que ya nos comieron tiempo:

#### 1. Tailwind v4 + CSS Cascade Layers (**el más caro**)
- **Error**: Ediciones a `globals.css` con reglas universales `* { padding: 0 }` afuera de `@layer` matan TODAS las utilities Tailwind del proyecto. Tardamos 3 iteraciones de Tanda A en darnos cuenta — Tiago veía "no cambió nada" y yo asumía que mis ediciones estaban tomando efecto.
- **Lección**: Antes de pensar "el cambio no se nota", revisar `globals.css` buscando reglas universales. Y NUNCA poner padding/margin en `*` afuera de `@layer base`.
- Detalle completo en la sección al inicio de este archivo.

#### 2. Inline styles `style={{ padding: '...' }}` son señal de bug
- **Error**: Al ver inline styles de spacing en componentes (Footer, ProjectCard, Hero), asumir que era prolijidad rota y quitarlos en bloque. Resultado: como las utilities Tailwind estaban muertas (bug #1), al sacar los inline styles me quedé con CERO padding.
- **Lección**: Si encontrás inline styles de padding/margin/spacing, **primero verificar que las utilities Tailwind funcionen** antes de reemplazar. Probá un `<div className="px-4">` aislado y mirá DevTools si la utility está aplicándose. Si no, hay un bug en `globals.css`.

#### 3. Comentarios CSS multi-línea con `*/` adentro
- **Error**: Escribí `Una regla universal mataría las clases px-*/py-*` dentro de un `/* ... */`. El `*/` en `px-*/py-*` cerró el comentario antes de tiempo y rompió el parser CSS de Turbopack.
- **Lección**: En comentarios CSS, evitar la combinación `*/` en el cuerpo. Reescribir como "px y py" o "px-asterisco" o usar `// `

#### 4. No modificar datos unilateralmente basado en CLAUDE.md
- **Error tendencia**: Quise flipear `showInCarousel: false` en TypeScript/Node/MongoDB porque CLAUDE.md decía que no iban. Pero la decisión final es de Tiago — la regla la escribió él pero el data lo escribió otro yo de antes.
- **Lección**: Cuando hay inconsistencia entre CLAUDE.md y el código, **flagearla y pedir decisión** en lugar de actuar.

#### 5. CSS Cache de Turbopack
- **Lección**: Cuando Tiago dice "no cambia nada" después de un cambio en `globals.css` o utilities Tailwind, sugerirle **Ctrl+Shift+R** (hard refresh) ANTES de buscar bugs. Muchas veces es solo cache.

#### 6. Lucide-react versionado raro
- **Lección**: Esta versión es `1.x` (no `0.x` como la mayoría de la doc en internet). La API es la misma — solo cambia que el package version es alta. No buscar `lucide-react@0.x` en npm cuando algo no funciona.

#### 7. Adobe NO está en simple-icons
- **Lección**: Por temas de licencia. Para Photoshop/Illustrator/Premiere usamos cuadrados bordeados con iniciales (Ps/Ai/Pr). Si alguna vez se necesitan más productos Adobe, mismo patrón en `ADOBE_INITIALS` en [StackIcon.tsx](src/components/ui/StackIcon.tsx).

#### 8. Referencias visuales de Tiago
- **Lección**: Cuando Tiago pasa imágenes en `public/images/references/`, mirarlas todas ANTES de proponer plan. Las referencias son targets visuales explícitos — no decoración.

#### 9. Texto sobre cover image variable → pills semi-translúcidas
- **Error**: En la primera versión de Tanda B puse el tag tipo + año como texto plano sobre el cover. Tiago vio que se leía débil ("UX/UI + 2025 se ve débil en light y dark"). El problema: el cover image tiene zonas claras y oscuras impredecibles, y el texto chico no tiene contraste garantizado.
- **Lección**: Cuando hay **texto chico sobre una imagen** (cover, hero photo, banner), no confiar solo en el color del texto. Usar pills/chips bordeados con bg semi-translúcido (`color-mix(in srgb, var(--bg-primary) 70%, transparent) + backdrop-filter: blur(4px)`). Esto aísla el texto del fondo y garantiza legibilidad sin importar qué hay atrás.

#### 10. `color-mix()` para overlays theme-aware
- **Lección útil**: `color-mix(in srgb, var(--bg-primary) X%, transparent)` es la forma más limpia de hacer overlays que respetan el tema sin duplicar reglas para light/dark. Funciona en navegadores modernos (2023+). Lo usamos en ProjectCard overlay y en pills.
- **Patrón**: cuando necesites un fondo "del color del tema con alpha", evitá `rgba(...)` con valores hardcodeados — usá `color-mix()` con la CSS var del bg/ink que corresponda.

#### 11. No mezclar tareas en la misma sesión
- **Error**: En sesiones anteriores abrimos 5+ frentes en paralelo (Tanda B + brief de leyes UX + "Sobre mí" + reestructura case studies + métricas). Resultado: Tiago dijo "nos estamos mareando".
- **Lección**: **Una tarea por sesión**. Si Tiago pide algo nuevo durante una sesión, ofrecerle: "lo apunto para después, ¿seguimos con lo que estamos?". Solo cambiar de tarea si lo actual está cerrado.

---

## 🎨 Referencias visuales (inspiración)

URLs que Tiago compartió como inspiración premium:
- **https://isadeburgh.com/** — el "Get in touch" de la navbar funciona como un texto que rota in-place tipo carrusel; al hacer hover se frena y al click va al mail. Vale la pena copiar este patrón cuando lleguemos a Navbar refinada.
- **https://artemiilebedev.com/** — referencia general de portfolio premium.
- **https://louispaquet.com/** — ídem.

Imágenes de referencia ya en `public/images/references/`:
- `hero_reference.png` — POSTA agency: tipografía gigante centrada, mucha respiración, glow accent arriba.
- `navbar_reference.png` — Felipe portfolio: logo a la izquierda, nav con `Mail` icon en pill, glow accent.
- `card_reference_active.png` / `card_reference_desactive.png` — UMAIVERSE / VERTEX IDENTITY: cards con tag arriba, título display gigante centrado-abajo, overlay coloreado (no negro fijo), CTA pill con flecha.
- `about_reference.png` / `about_reference2.png` — POSTA / Product Designer: claim gigante con palabras en bold, body text chico desplazado, distribución asimétrica.

**Regla cuando se mire una referencia**: identificar la idea concreta a replicar (un patrón, una proporción, una micro-interacción), no copiar pixel-perfect. El portfolio mantiene su identidad de "minimalismo técnico pero cálido" con accent terracota.

---

### ✅ Lo que YA funciona
- **Deploy en Vercel**: https://tiagocollado.vercel.app/ (CI/CD activo, cada push a main redeploya)
- **Bug de producción resuelto**: las páginas de proyecto ya renderean en Vercel (commit `10aa279`).
- **Secciones activas**:
  - `Navbar` con toggles de idioma (ES/EN) y tema (dark/light), ambos con íconos de `lucide-react`
  - `Hero` con `InteractiveDotGrid` (canvas 2D con repulsión cuadrática del cursor, fallback CSS para touch, theme-aware), identidad agrupada (nombre + role) separada del claim por margins
  - `Projects` con grilla Bento asimétrica + `ProjectCard` rediseñado (overlay theme-aware con `color-mix()`, tag+año en pills bordeadas top-left, título display dominante bottom-left, hover-reveal de tags+CTA pill sólido accent, glow accent en hover)
  - `About` con header (eyebrow + claim "Diseño y código en una sola cabeza."), 4 bloques de copy cortos (background / hybrid_path / hook en bold-display / mission), `<aside>` con áreas de práctica como lista numerada editorial sin chrome de botón, `<footer>` con ubicación
  - `Stack` carrusel infinito pausable en hover, con `<StackIcon>` (simple-icons + lucide + Adobe en cuadrados con iniciales monocromos)
  - `Contact` con CTAs a email y WhatsApp como pills compactas (íconos Lucide)
  - `Footer` con LinkedIn, GitHub y descarga de CV (SVGs inline)
  - `Gallery` para casos de estudio: carrusel Embla + Framer Motion, con prev/next, dots, contador 01/05 y transición de crossfade en el slide activo
- **i18n funcionando**: español default, inglés toggle, archivos en `src/messages/es.json` y `src/messages/en.json`
- **Dark/light mode**: con next-themes, persiste en localStorage
- **Animaciones**: Framer Motion (fade + slide en scroll, hover states)
- **5 casos de estudio completos con contenido real** (FutbolTalentPro, El Ritual del Tono, Cabify Music Match, Multibrand Design System, Recuérdalo)
- **CV descargable** funcionando en footer
- **Retro Kicks** como "Coming soon" con overlay blur

### ✨ Saneamiento realizado (abril 2026)
- Eliminado `CustomCursor.tsx` — estaba montado en layout pero nunca renderizaba (`isVisible` jamás seteado a `true`). Se reimplementará correctamente más adelante si se decide volver a meterlo.
- Eliminado `Toggles.tsx` vacío. Si más adelante Navbar crece, extraer toggles a un componente nuevo; hoy no justifica.
- Arregladas CSS vars inexistentes `--accent` / `--accent-hover` → ahora se usan `--color-accent` / `--color-accent-hover` (los que define `@theme`). El botón Contacto de la Navbar ahora sí renderiza con background.
- Removidos `.cursor-spotlight` y `.navbar-spotlight` de `globals.css` (CSS huérfano).
- Removida la carga del CSS de Devicon por CDN (no cargaba). `Stack.tsx` ahora usa un dot terracota + nombre como marcador minimalista.
- Spacing de secciones normalizado a `py-20 md:py-28 lg:py-36` en Hero, Projects, About, Contact, Stack (antes About tenía `py-64 md:py-80` + 140px de margen, Contact `py-40 md:py-56` + 180/200px — ambos violaban las reglas de arriba).
- Removidos los `style={{ paddingLeft: '24px', paddingRight: '24px' }}` inline duplicados que se pisaban con `px-6 md:px-10` de Tailwind.
- Hero: headline movido de `--ink-muted` (contraste 3.1:1, falla AA) a `--ink-secondary` (8.9:1).
- Hero: opacidad del dot-grid subida de `0.08` → `0.18` para que se vea en light mode.
- `lucide-react` actualizado de 1.9.0 → ^1.11.0.
- Clases con `hover:text-[var(--color-accent)]` refactorizadas a `hover:text-accent` (Tailwind v4 ya genera esos utilities automáticamente desde los tokens `--color-*` del `@theme`).

### 📐 Patrón de "escalera" en max-w (a diseñar intencionalmente)
Cada sección usa un `max-w-*` distinto en su container interno (Hero `max-w-6xl`, Projects `max-w-7xl`, About `max-w-6xl`, Stack header `max-w-7xl` + carrusel full-bleed, Contact `max-w-3xl`, Gallery `max-w-6xl`). Eso crea una "escalera" visual: en pantallas wide, no todo arranca en la misma columna invisible.

**Decisión (2026-04-25)**: Tiago quiere mantener la escalera y diseñarla **intencionalmente con un patrón pensado**, no dejarla accidental. Pendiente: definir el patrón concreto (ej. Hero más angosto → Projects ancho → About vuelve angosto → Stack ancho → Contact muy angosto, generando un ritmo de zoom in/out). Hay que pensar el ritmo antes de tocar `max-w-*` en los componentes. **Esta tarea está en backlog** — no la abordamos en sesiones de spacing/layout normales.

### ⚠️ Lo que falta mejorar (DISEÑO VISUAL — prioridad para llegar a nivel Awwwards)
- **Mockups definitivos** de FutbolTalentPro / Multibrand / Recuérdalo (los 3 covers provisorios siguen). Tarea de Tiago.
- **Case studies reestructurados**: renombrar secciones, viñetas en Solución, separar Arquitectura/Interfaz. Tiago lo pidió en brief — pendiente Tanda B2.
- **Métricas en FutbolTalentPro**: bloqueado en data de Tiago (% de éxito en testing, tiempo ahorrado, etc.).
- **Govah + Pulso Creativo**: agregar como proyectos WordPress (clientes reales). Necesita data de Tiago.
- **Imágenes**: tanto `Gallery.tsx` como `ProjectCard.tsx` usan `<img>` nativo. Migrar a `next/image` cuando los covers definitivos estén listos.
- **Gallery**: falta lightbox on click y más imágenes por proyecto (hoy solo hay 1 por slug).
- **Scroll-driven animations**: solo hay fade-in básico, falta parallax y reveals encadenados.
- **Navbar**: no tiene cambio de estilo al scrollear.

### 📐 Íconos — estado actual
- **`lucide-react` ^1.11.0** instalado y usado en: Navbar (Sun/Moon/Languages), Contact (Mail/MessageCircle), StackIcon (PenLine/Sparkles/Search/Wand2/Blocks/Contrast para skills sin marca).
- **SVGs inline** en Footer (LinkedIn, GitHub, FileText de CV).
- **`simple-icons` ^15.x** para marcas en Stack (Figma, React, Next.js, Tailwind, HTML5, CSS, GitHub).
- **Adobe** (Photoshop, Illustrator, Premiere): cuadrados bordeados con iniciales `Ps`/`Ai`/`Pr` en `currentColor` (Adobe NO está en simple-icons por temas de licencia — esta es la convención visual oficial). Definidos en `ADOBE_INITIALS` de `StackIcon.tsx`.
- **Patrón de StackIcon**: todo monocromo con `currentColor` para que herede del wrapper y respete el tema. Para agregar un ícono nuevo: editar `SIMPLE_ICONS`, `LUCIDE_ICONS` o `ADOBE_INITIALS` en `StackIcon.tsx`.

### 📋 Features pendientes (opcionales pero charladas)
- **Botón "back to top" con animación, centrado abajo del todo**: cuando el usuario llega al final de la página, mostrar un botón circular/pill en el centro que scrollea hacia arriba con animación suave. Implica **reordenar el Footer**: hoy el centro tiene los íconos de redes (LinkedIn / GitHub / CV) y debajo el copyright. La reorganización tiene que mantener accesible esa info pero liberar el centro para el botón. Pensar el reorder antes de codear (¿links a un costado? ¿copyright arriba del divider?). Sin código todavía — esperando definición visual.

- **Fondo interactivo del Hero (InteractiveDotGrid)**: ✅ implementado en [src/components/ui/InteractiveDotGrid.tsx](src/components/ui/InteractiveDotGrid.tsx). Canvas 2D con RAF, repulsión cuadrática, lerp de retorno, fallback CSS para touch, respeta `prefers-reduced-motion`, re-lee color en cambio de tema vía MutationObserver. Props configurables: spacing, dotRadius, influenceRadius, maxDisplacement, lerpFactor, colorVar, opacity.
- **Cursor personalizado (Awwwards-style)**: a reimplementar cuando se quiera. Debe ser sutil (dot + anillo con lag), magnético sobre interactivos, deshabilitado en touch.
- **Easter egg** (konami code o micro-interacción escondida).
- **Mejores covers de imágenes**: actualmente provisorios
  - FutbolTalentPro: screen provisorio que no quedó bien
  - Multibrand: cover con nombres del equipo (mejor usar mockups desktop)
  - Recuérdalo: cover de presentación TP (mejor usar mockups mobile)
  - El Ritual del Tono + Cabify: OK
- **Galerías de imágenes** dentro de cada caso de estudio (Gallery está pero con grid simple, falta migrar a Embla).
- **Dominio custom NIC.ar** (no comprado aún, nunca linkeé DNS de NIC a Vercel, sí de NIC a Hostinger).
- **Analytics** (Vercel Analytics pendiente de decisión).

---

## Stack técnico del proyecto (el que usamos para construir el portfolio)

- **Framework**: Next.js 16 (App Router) con Turbopack
- **Lenguaje**: TypeScript
- **React**: 19
- **Estilos**: Tailwind CSS v4 (sin `tailwind.config.ts`, usa `@theme` en globals.css)
- **Animaciones**: Framer Motion
- **Íconos**: lucide-react (UI) + SVGs inline (marcas en Footer)
- **Carruseles**: embla-carousel-react (Gallery en caso de estudio)
- **i18n**: next-intl (archivos en `src/messages/`)
- **Tema**: next-themes
- **Deploy**: Vercel con CI/CD via GitHub
- **Data**: Static JSON/TS en `src/data/` (projects.ts, stack.ts)

---

## 🎯 Stack tecnológico que se muestra en el carrusel del portfolio

**IMPORTANTE**: lo que aparece en la sección "Stack tecnológico" del portfolio debe reflejar lo que Tiago realmente domina bien y su perfil UX/UI, no lo que tocó superficialmente.

### ✅ Incluir (perfil UX/UI + frontend + creatividad)
- **Diseño**: Figma, FigJam, Adobe Photoshop, Adobe Illustrator, Adobe Premiere
- **Frontend**: HTML5, CSS3, React, Next.js, Tailwind CSS
- **UX**: UX Research, UX Writing, Prototyping, User Testing, Card Sorting, Design Systems, Accessibility
- **Herramientas/AI**: IA Generativa aplicada al diseño, Git / GitHub
- **CMS (mencionar si hay espacio)**: WordPress, Shopify

### ❌ NO incluir (aunque haya trabajado con ellos)
- **MongoDB** — lo tocó pero no es fuerte
- **Node.js** — lo tocó pero no es fuerte
- **TypeScript** — sabe lo básico pero no domina
- **Express** — idem

**Regla**: si en una entrevista le preguntan profundo sobre una tecnología del carrusel, tiene que poder responder con soltura. Si no, no va.

**Nota**: El Ritual del Tono usa MongoDB/Node/Express en el caso de estudio — ahí SÍ se mencionan, porque es el contexto del proyecto específico. Distinto a promocionarlas como habilidad general.

---

## Estructura del proyecto

```
tiago-collado/
├── public/
│   ├── cv-tiago-collado.pdf
│   └── images/
│       └── projects/
│           ├── futboltalentpro-cover.jpg
│           ├── el-ritual-del-tono-cover.jpg
│           ├── cabify-music-match-cover.jpg
│           ├── multibrand-cover.jpg
│           └── recuerdalo-cover.jpg
├── src/
│   ├── i18n/
│   │   └── request.ts      # config de next-intl
│   ├── app/[locale]/
│   │   ├── layout.tsx      # fonts, ThemeProvider, NextIntlClientProvider
│   │   ├── page.tsx        # ensambla todas las secciones
│   │   ├── globals.css     # @theme tokens + CSS variables
│   │   └── projects/[slug]/
│   │       └── page.tsx    # páginas de casos de estudio
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Stack.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── Gallery.tsx    # usado en páginas de caso de estudio
│   │   └── ui/
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       └── FadeInSection.tsx
│   ├── data/
│   │   ├── projects.ts
│   │   └── stack.ts
│   ├── messages/           # i18n — next-intl carga desde acá
│   │   ├── es.json
│   │   └── en.json
│   ├── app/icon.svg        # favicon (T terracota, file convention Next 16)
│   └── types/
│       └── index.ts        # Project, StackItem, Locale types
├── middleware.ts           # locale detection, redirects
├── next.config.ts          # withNextIntl wrapper
└── package.json
```

---

## Decisiones de diseño / Brand identity

- **Concepto**: "Minimalismo técnico pero cálido" (precisión de código + empatía de UX)
- **Personalidad**: ENFJ-A (cálido pero profesional)

### Paleta de colores
- **Accent**: Terracota `#C96A3A` (hover: `#B05A2E`)
- **Light mode**: bg `#F7F4EF` (off-white), ink `#111110`
- **Dark mode**: bg `#111110`, ink `#F0EDE8`
- **Borders**: rgba con alpha 0.10-0.20

### Tipografía
- **Display**: Space Grotesk (headings)
- **Body**: Geist
- **Mono**: Geist Mono (para labels técnicos)

### Otros tokens
- **Radius**: 12px cards, 999px pills
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out)

---

## Proyectos (orden en el portfolio)

1. **FutbolTalentPro** (FEATURED, celda grande) — UX/UI para startup deportiva, trabajé ad honorem 3 meses, bajo NDA con permiso de mostrar material no sensible
2. **El Ritual del Tono** — Full-stack MERN (React, Next.js, Node, MongoDB), live demo disponible
3. **Cabify Music Match** — Concept UX/UI (2023), Behance, prototipo iPhone 14
4. **Multibrand Design System** — Simulación laboral No Country, equipo multicultural de 6
5. **Recuérdalo** — Proyecto universitario, UX inclusivo para adultos 70+
6. **Retro Kicks** (COMING SOON) — En desarrollo, problema con MongoDB Atlas

**A sumar (decidido 2026-04-29)**: Govah (govah.com.ar) y Pulso Creativo (pulsocreativo.com.ar) — clientes reales, ambos hechos con WordPress. Pendiente que Tiago provea: tagline, descripción, tags, screenshot/cover, año, qué hizo él específicamente. **Excluidos del portfolio** (charlado): SoundCloud Redesign incompleto, Rick & Morty Explorer (junior).

**Regla de proyectos** (2026-04-29): a menos que un proyecto se mencione explícitamente como "académico" o "universitario", se asume que es real (cliente, freelance o personal con resultado real). Hoy solo Recuérdalo está flageado como universitario.

---

## Reglas de contenido / NDA

- **FutbolTalentPro**: NDA permite mostrar "material no sensible" para portfolio. NO mostrar pantallas finales del producto. SÍ mostrar wireframes baja/media, flujos, design system, user personas.
- **Sobre el copy**: el tono del About es directo, sin forzar narrativas de "Silicon Valley". Se evita mencionar acuerdo de confidencialidad en el About principal (solo dentro del caso de estudio de FutbolTalentPro).

---

## Workflow actual

- **Desarrollo**: `npm run dev` (levanta en localhost:3000)
- **Deploy**: automático en cada push a `main` en GitHub (Vercel detecta y redeploya)
- **i18n**: para agregar nuevas traducciones, editar `src/messages/es.json` y `src/messages/en.json`
- **Nuevo proyecto**: agregar en `src/data/projects.ts` + opcionalmente crear key `case_study_{slug}` en ambos JSON de mensajes

---

## Prioridades inmediatas (al 2026-04-29)

> Toda la lista vieja de "prioridades inmediatas" fue resuelta o trasladada a "🚦 Próximos pasos" más arriba. Esta sección queda como vista corta de qué bloquea avanzar.

### Bloqueado por contenido de Tiago
1. **Mockups definitivos** de FutbolTalentPro / Multibrand / Recuérdalo → reemplazar archivos en `public/images/projects/`. (Tarea B1)
2. **Métricas de FutbolTalentPro** → para sumar peso al case study. (Tarea B3)
3. **Data de Govah + Pulso Creativo** → tagline, descripción, tags, cover, año, rol específico. (Tarea C1)
4. **Referencia visual para página de caso de estudio** → 1-2 imágenes en `public/images/references/` o decisión de dirección (editorial / cinematográfica / técnica). (Tarea C2)

### Listo para codear (no requiere decisiones nuevas)
- **B2 — Reestructurar case studies** (renombrar secciones, viñetas, separar Arquitectura/Interfaz). Toca `es.json` + `en.json`.

Resto del backlog en "🚦 Próximos pasos" arriba.

---

## Estilo de comunicación preferido

- Directo y sin condescendencia
- Honesto cuando algo está mal (ej: señalar errores de copy o decisiones dudosas)
- Explicar el "por qué" de las decisiones técnicas, no solo el "qué"
- Paso a paso cuando es código complejo
- Preguntar antes de asumir cuando falta info (sobre proyectos, rol exacto, decisiones, etc.)
- **Código entendible por sobre abstracciones avanzadas** — Tiago está aprendiendo, la claridad importa más que el cleverness