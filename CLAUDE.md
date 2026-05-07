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

## 📍 Dónde estamos ahora — última sesión: 2026-05-07 (PM, rework Fases 1-3 + polish)

### Estado del proyecto
**Rework "frontend creativo" — Fases 1-3 ejecutadas** en una sesión chained con check-ins entre cada fase (sesión 2026-05-07 PM). Se siguió el plan en `C:\Users\tiago\.claude\plans\necesito-que-el-portfolio-glistening-donut.md` al pie de la letra. **Próxima sesión arranca con Fase 4** (resto de las secciones del home: stagger granular en Projects/About/Stack/Contact/Footer + magnetic en ProjectCard CTA + blur-in en Gallery + gradient text en Stack + glow pulse en Contact).

**Resumen ejecutivo de lo nuevo hoy** (detalle completo en Tanda 21 abajo):
- ✅ **Lenis** smooth scroll global (anchors interceptados nativamente). Bypass automático en `prefers-reduced-motion`.
- ✅ **Custom cursor** dot+ring con variants `default | link | view | drag`, `mix-blend-difference` para invertir sobre cualquier fondo. Solo desktop (`pointer: fine`).
- ✅ **SplitText** char reveal con word-level wrappers (no rompe mid-word) + sr-only para a11y.
- ✅ **Magnetic hover** hook reutilizable + **MagneticLink** que combina magnetic + cursor variant.
- ✅ **Body grain** SVG-noise global tiled, opacity 0.03 (textura papel).
- ✅ **Navbar simplificado**: h-16 fijo, sin dual-mode, NavLogo izq + Proyectos/Sobre mí/Hablemos centrados + LanguageToggle/theme der separados, hamburger rota.
- ✅ **NameLogo gigante en Hero**: sticky top-2, shrink scale 1→0.13 en 0–500, fade-out en 405–500, mount con SplitText char reveal blur-in.
- ✅ **Hero**: H1+H2 con SplitText delay 0.6/1.0, CTA en MagneticLink + tracking expand + chevrons aceleran on hover, dotgrid con idle pulse + scroll fade + accent cluster.
- ✅ **MarqueeLink** bug fix: hover ahora frena hacia la izquierda hasta x=-copyWidth (label siempre primero); mouse-out retoma loop hacia la derecha sin reversa intermedia.
- ✅ **Polish**: dotgrid bumpeado a `--ink-secondary` opacity 0.7 (más visible en light), SplitText word-wrap, scrollbar custom theme-aware terracota en hover.

**D5 v3-refine RESUELTO** por la simplificación del navbar en Fase 2: ya no hay dual-mode altura-dinámica; el handoff NameLogo (gigante en Hero) ↔ NavLogo (chico en navbar) es scroll-driven puro y no genera la sensación rara que el usuario flagó.

**Resto del proyecto** (sin cambios desde la sesión anterior): 5 case studies con layout Awwwards completos + folder rename (projects → covers, gallery → case-study) + 20 imágenes case-study con `src` conectados.

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
11. **B2 — Reescritura de case studies con leyes UX** (commit pendiente):
    - **Renderer custom** en `src/app/[locale]/projects/[slug]/page.tsx` parsea sintaxis liviana en strings de i18n: `## Texto` → h3, `- Texto` → bullet (con marker `—` accent), línea vacía → separa bloques. Sin sumar dependencias.
    - **Renames de UX section labels**: `02 Propuesta de valor` → **Mi rol y contexto** (Jakob, match con content), `03 Insight` → **Desafíos y decisiones** (voz activa), `05 Impacto` → **Resultados y aprendizajes** (honestidad — sin métricas reales no exagerar).
    - **Reescritura de los 5 `solution`** (ES + EN): bullets para FutbolTalentPro y Multibrand DS; split `## Arquitectura técnica` + `## Decisiones de interfaz` para El Ritual del Tono; `## Integración en el flujo` + `## Prototipo y sistema visual` para Cabify; `## Arquitectura de información` + `## Decisiones de accesibilidad` para Recuérdalo.
12. **B2.5 — Quick fixes en case studies** (commit pendiente):
    - **Header duplicado resuelto**: Gallery ahora usa `case_study.gallery_title` ("Galería"/"Gallery"); el bottom-section "Demostración del proyecto" se eliminó entera y `demo_title`/`demo_placeholder` se removieron.
    - **CTAs movidos al top** (debajo de tagline): pills compactos con `view_live`, `view_github_frontend`, `view_github_backend`. Cabify queda sin CTAs (decisión: side effect de eliminar Behance).
    - **Bottom navigation nuevo**: card prominente "Próximo proyecto: {nombre}" con flecha animada + link sobrio "Ver todos los proyectos". Helper `getNextProject` con wrap-around (recuérdalo → futbol-talent-pro). Filtra `comingSoon`.
    - **Behance eliminado por completo**: keys `view_behance` (de `case_study` y `projects`) borradas, prosa de Cabify reescrita ("se documentó como caso de estudio" en vez de "publicado en Behance"), field `behance` removido de `Project.links` type y de `projects.ts` (Cabify), CLAUDE.md actualizado.
    - **Back link animado** vía CSS `group-hover` (no Framer — page.tsx es server component). Mismo patrón en CTA "Próximo proyecto" (flecha derecha) y "Ver todos los proyectos" (flecha izquierda).
    - **FutbolTalentPro polish**: emojis `(⚽🏆🔥)` removidos del texto del `process`; "40 pantallas" → "+30 pantallas" en es.json, en.json y projects.ts (3 lugares × 2 idiomas = 6 lugares).
13. **C2 — Plan Awwwards-style acordado (sesión 2026-05-01, sin código aún)**:
    - **Refs revisadas**: 3 screenshots en `public/images/references/` (`casestudy_reference.png` Mediasignal-style, `casestudy(2)_reference.png` y `casestudy(3)_reference.png` LinkBoard-style con micro-labels arriba). 7 URLs Awwwards adicionales (Carolina Levinsky, Mike Kus, Joonas Sandell, Henri Heymans, Silvia Sguotti, Alejandro Mejías, Yaremenko). **Patrón común: copy super corta, sidebar metadata, sin numeración 00/01/02 académica.**
    - **Layout decidido**: grid 12-col con sidebar `col-span-3` sticky en `lg+` (Cliente / Año / Rol / Duración / Equipo / Stack / NDA) + main `col-span-9` editorial. Mobile: sidebar arriba como bloque normal.
    - **Ritmo de secciones nuevo (4, no 5)** en main column:
      - **Intro** (sin label, 2-3 líneas hook) + 1ª imagen.
      - **El desafío** (label) — 1 párrafo corto + 2ª imagen.
      - **Cómo lo resolví** (label) — 3 decisiones clave en bloques cortos, intercaladas con imágenes.
      - **Lo entregado** (label) — grid visual de outputs.
      - **Cierre** (label) — 2-3 líneas: validación + aprendizaje.
    - **"Mi rol y contexto" se evapora como sección**: rol/duración/equipo van al sidebar como metadata estructurada (Mediasignal-style); la narrativa restante se funde con el desafío.
    - **Sin numeración 00/01/02** en sección. Si hace falta numeración, queda solo en contadores de imágenes (01/05).
    - **"Solución" se desdobla en 2** momentos: "Cómo lo resolví" (decisiones, voz activa) + "Lo entregado" (outputs/entregables). Las refs separan razonamiento de entregables.
    - **Imágenes contextuales intercaladas** dentro de las secciones, NO todas al final. Gallery actual al final queda como anexo opcional.
    - **Componentes reusables**: `<CaseStudySidebar />`, `<CaseStudySection />`, `<CaseStudyImage />` — para que los 5 case studies compartan ADN cuando se migren uno por uno.
    - **Server component-friendly**: animaciones que se puedan hacer con CSS (`group-hover`, animate-in) van por CSS; las que requieren `useScroll` se aíslan en client components chiquitos.
    - **Arrancamos por FutbolTalentPro**. Los otros 4 case studies se migran uno por sesión en próximas tandas.
    - **Reglas de imágenes acordadas**: cuando codee, voy a marcar 5-6 placeholders de imagen con descripción específica (qué imagen va, qué promptear en Nano Banana para imagen/video, qué info darle a Gemini Pro). Tiago genera/triajes y reemplaza.
14. **C2 ejecutado completo + refactor + tono refinado** (sesión 2026-05-02, sin commit):
    - **Migrados los 5 case studies al layout Awwwards** (FutbolTalentPro → El Ritual del Tono → Cabify Music Match → Multibrand Design System → Recuérdalo). Cada uno: `awwwardsLayout: true` + `metadata` + `imageBriefs[4]` en `projects.ts` + 12 keys nuevas (`intro`, `challenge`, `decision_1-3_title/body`, `delivered_1-3`, `closing`) en `es.json` y `en.json`.
    - **Refactor `imageBriefs` data-driven**: las descriptions/prompts/alts de las 4 imágenes contextuales por case study viajan en `Project.imageBriefs[]` (en `projects.ts`), no hardcodeadas en `page.tsx`. Esto permitió migrar los 4 case studies restantes sin tocar `page.tsx` una sola vez.
    - **Componentes reusables creados**: `<CaseStudySidebar />` (server, sticky CSS), `<CaseStudySection />` (server, label + slot), `<CaseStudyImage />` (client, `useScroll`/`useTransform` parallax + placeholder mode con border dashed cuando `src` está vacío).
    - **Sidebar Links + ocultar tags/CTAs del header**: cuando `awwwardsLayout: true`, las pills de tags y los CTAs (live + repos) se ocultan del header — viven en el sidebar como **bloque "Links"** al final con flecha `↗` que se mueve diagonal en hover. Sticky en `lg+` mantiene los links siempre accesibles. Arregla la duplicación que el usuario flagó.
    - **Gallery removida en layout Awwwards**: cuando `awwwardsLayout: true`, no se renderea `<Gallery>` al final — las imágenes contextuales ya hacen el trabajo. Layout legacy mantiene Gallery hasta su migración (ya no aplica, los 5 están migrados).
    - **Cleanup keys legacy**: las 5 keys (`context`, `role`, `process`, `solution`, `results`) borradas de cada `case_study_*` en `es.json` y `en.json`. Estaban filtrando contenido viejo (em-dashes, nombres reales) al cliente vía next-intl. Cleanup vía script Node de una línea.
    - **Tono refinado por feedback de Tiago** (sesión 2026-05-02):
      - **Em-dashes (`—`) eliminados** de todos los textos visibles del case study (intros, decisiones, cierres). Reemplazados por paréntesis, comas o frases independientes. Quedan solo en `<title>` del browser tab y dentro de prompts internos de placeholders.
      - **Recuérdalo anonimizado**: nombres "Carlos / Raquel / Laura" reemplazados por "el entrevistado de 80 años", "los 3 entrevistados", "el usuario principal". Decisión del usuario: no exponer nombres reales de personas entrevistadas.
      - **Metadata sidebar simplificada**: rol sin "ad honorem" ni "· solo", duración sin años ni meses repetidos (el año vive en su campo aparte), equipo "Solo" → "Trabajo individual" o "Diseño y desarrollo end-to-end" según case study. FTP equipo → "1 dev Flutter + 2 leads".
      - **Cabify**: `delivered_3` ahora menciona **brand.cabify.com** explícitamente como fuente del manual de marca (suma credibilidad).
    - **`text-balance` y `text-pretty` para palabras viudas**: aplicado a H1 título, tagline, intro hook, H3 títulos de decisiones (`text-balance`); párrafos de desafío, body de decisiones y cierre (`text-pretty`). Tailwind v4 los soporta nativo.
    - **Bug fix bonus**: agregado `relative` al `<figure>` en `CaseStudyImage.tsx` para silenciar warning de Framer Motion `useScroll` ("container needs non-static position").
    - **Doc generada**: [image-briefs.md](image-briefs.md) en raíz del proyecto — los 20 briefs consolidados con prompts Nano Banana + contexto sugerido para Gemini Pro + workflow recomendado de generación. Pendiente: Tiago genera/triajes las 20 imágenes y avisa.
    - **Pendiente para próxima sesión cuando lleguen las imágenes**: subir a `public/images/case-study/{slug}/`, agregar `src` a cada brief en `projects.ts`, commit grande "C2 + imágenes".
15. **D7 — Navbar marquee link estilo isadeburgh** (sesión 2026-05-02, sin commit):
    - **D5 cancelado** (intento de navbar shrink en scroll). El cambio de altura `h-16 → h-12` causaba un "salto" visual perceptible cuando se cruzaba el threshold — Tiago lo flagó como UX issue. Se descartó. Navbar queda **fijo en `h-16` siempre**, con el `backdrop-blur-md` + `color-mix` que ya tenía.
    - **D7 reescrito como `<MarqueeLink>`** ([src/components/ui/MarqueeLink.tsx](src/components/ui/MarqueeLink.tsx)): texto plano con label + flecha ↗ (en accent terracota) que se repite N veces en un track flex con `whitespace-nowrap` y se desplaza horizontalmente en loop infinito hacia la derecha. En hover el track se pausa Y crossfade a un estado estático centrado (label + flecha) — refuerza la intención antes del click. **Sin pill, sin background naranja** (el botón rectangular naranja no le gustaba a Tiago).
    - **Animación**: `@keyframes marquee-right` en `globals.css` (translateX(-50%) → 0 con contenido duplicado para loop seamless). `animation-play-state: paused` cuando hover.
    - **Tipografía**: el marquee usa `text-sm font-medium` con color `var(--ink-primary)` — hereda el feel del navbar, no compite con los otros links.
    - **Click sigue yendo a `#contact`** (ancla a la sección Home, decisión del usuario).
    - **i18n**: 1 key `nav.contact_marquee`. ES: "Hablemos". EN: "Get in touch".
    - **a11y**: `aria-label` fijo en el `<a>` para que screen readers lean siempre el label. Track + estado estático con `aria-hidden="true"` — son decoración visual. `prefers-reduced-motion` ya está cubierto globalmente por la regla en `globals.css`.
    - **Cleanup**: borrado `RotatingText.tsx` (intento previo descartado) y las 4 keys `contact_rotation_*` de los JSON.
16. **C2-cleanup — borrar legacy renderer** (sesión 2026-05-02, sin commit):
    - **`page.tsx` reescrito sin branch legacy**: bajó de 598 → 358 líneas (-40%). Ahora es un solo renderer (Awwwards layout) condicionado a `project.awwwardsLayout && hasCaseStudy`. Para `comingSoon` (Retro Kicks) o cualquier proyecto sin `awwwardsLayout`, el body case study no se renderea — solo header + project navigation abajo.
    - **Helpers borrados**: `parseContent` (~30 líneas), tipo `Block`, `SECTION_KEYS`, `getSectionLabelPrefix`, variables runtime `legacyContent` + `labelPrefix`.
    - **i18n keys legacy borradas** (script Node de una línea): `case_study.ux_s0..4`, `case_study.fs_s0..4`, `case_study.pending_content` — total 11 keys por idioma. Ya no se mandan al cliente vía next-intl.
    - **Convención nueva**: cualquier case study real necesita `awwwardsLayout: true` + las 12 keys awwwards (`intro` / `challenge` / `decision_1-3_title+body` / `delivered_1-3` / `closing`). Si falta alguna, `t()` tira y el catch deja `hasCaseStudy: false` → body simplemente no se renderea (fallback silencioso).
    - **Branches `!project.awwwardsLayout` mantenidos**: tags pills + CTAs en header siguen condicionales. Sirven para Retro Kicks (coming-soon con tags y GitHub link, sin awwwardsLayout).
17. **D4 — Scroll-driven en home** (sesión 2026-05-02, sin commit):
    - **Hero parallax** ([Hero.tsx](src/components/sections/Hero.tsx)): wrapper externo con `useScroll({ target: heroRef, offset: ['start start', 'end start'] })` + `useTransform`. Cuando se scrollea de 0 a `100vh`, el contenido se desplaza `y: 0 → -80px` y `opacity: 1 → 0.4`. El `<InteractiveDotGrid>` queda fijo (sin parallax) — el contraste foreground-móvil / background-fijo crea profundidad layered. Mount animation interna preservada (initial/animate del motion.div hijo).
    - **Stagger en Projects**: `<ProjectCard>` ahora es `motion.article` con `initial / whileInView / transition` y prop `index` para delay incremental (`i * 0.08s`). El grid de 6 cards entra escalonado (0, 80, 160, 240, 320, 400ms), no como bloque. Wrapping previo con `FadeInSection delay={0.15}` removido — el reveal vive en cada card.
    - **Footer reveal**: agregado `motion.footer` con `whileInView` + fade + slide-up 24px. Cumple la regla "ningún componente puramente estático".
    - **Sin cambios en**: About (ya tenía `whileInView` en sus toolkit cards), Stack (carousel infinito ya está vivo), Contact (FadeInSection en su sección).
    - **`prefers-reduced-motion`** ya cubierto globalmente en `globals.css` — todas las nuevas animaciones se neutralizan.
18. **Polish navbar + 20 imágenes en repo + bug fix scroll** (sesión 2026-05-06, sin commit):
    - **Bug fix doble scrollbar**: en `globals.css` el body tenía `overflow-x: hidden` además del html, lo que generaba que el body se vuelva un nuevo scroll context. Resultado: una "2da barra" debajo del navbar agarrando el blur. Fix: dejar `overflow-x: hidden` SOLO en `html`. Documentado como nota en globals.css para no repetir.
    - **MarqueeLink reescrito** (3 iteraciones por feedback de Tiago):
      - v1: track con N copias duplicadas + CSS keyframe `marquee-right` + crossfade a estado estático centrado en hover. Tiago: "no quiero pill rectangular naranja".
      - v2: una sola instancia que cruza el container, hover anima a x=0 (centro). Tiago: "el recorrido es muy largo y la animación lenta".
      - v3 (final, [MarqueeLink.tsx](src/components/ui/MarqueeLink.tsx)): **2 copias idénticas** en `inline-flex`, container = ancho exacto de UNA copia (medido en runtime con `useEffect` + `offsetWidth`). Animación `useMotionValue` + `animate` imperativo: x va de 0 a -copyWidth en loop infinito (linear). Cuando el track salta de -copyWidth a 0, la 2da copia ya está cubriendo desde la derecha — **loop continuo sin huecos visibles**. Hover: anima x a 0 con ease-out (vuelve suave a la posición original). Mouse out: continúa desde donde quedó, fase 1 termina el ciclo actual, después loop normal (sin saltos). Reemplazada flecha unicode `↗` por **2× `<ArrowUpRight size={14}>` de lucide** (color accent terracota). Duración 4s.
    - **20 imágenes contextuales en repo**: Tiago subió las 4 imágenes por case study a `public/images/case-study/{slug}/` con naming `01-hero.jpg` / `02-challenge.jpg` / `03-decisions.jpg` / `04-delivered.jpg`. Los 5 `imageBriefs[]` en `projects.ts` ahora tienen `src` apuntando a esas rutas. Removidos los `description` y `prompt` de cada brief (eran notas internas para generar la imagen, ya no aplican). Los placeholders TODO con border dashed ya no aparecen — todo el case study renderea con foto real.
    - **`image-briefs.md` borrado**: era doc interna para guiar la generación. Las imágenes ya existen, el doc no aplica.
    - **Hero sin identidad** ([Hero.tsx](src/components/sections/Hero.tsx)): quité el `<h1>{nombre}</h1>` y el `<p>{role}</p>`. El headline pasa a ser el `<h1>` (mejor SEO) con tipografía mayor (`text-4xl md:text-6xl lg:text-7xl`) y color principal — protagonista del Hero. **Decisión final acordada con Tiago al final de la sesión**: este approach NO es el correcto. La idea es que el nombre **sea** el protagonista del Hero (estilo isadeburgh.com), arrancando grande, y al scrollear se transforma suavemente hasta convertirse en el logo del navbar. **Pendiente reescribir** — ver D5 v3 abajo.
    - **Navbar adaptativo** ([Navbar.tsx](src/components/ui/Navbar.tsx)): logo "Tiago Collado" condicional según `pathname` + `scrollY`. En home con `scrollY < 80`: oculto (opacity 0 + translateX -8px). En home con `scrollY ≥ 80`: visible con fade-in. En case studies (`pathname` profundo): visible siempre. Sin shrink de altura — navbar mantiene `h-16` constante (el shrink causaba salto visual en intentos anteriores). **Esta solución es transitoria** — se reemplaza con D5 v3.
    - **Carpetas renombradas** (decidido por Tiago, sin Claude): `public/images/projects/` → `public/images/covers/` (covers de las cards en home) y `public/images/gallery/` → `public/images/case-study/{slug}/` (imágenes contextuales). Actualizado `coverImage` y `gallery` en cada entry de `projects.ts`.
19. **D5 v3 + Hero rediseñado + Marquee polish + bug fix imágenes** (sesión 2026-05-06, sin commit, pendiente refinamiento):
    - **Bug fix `<CaseStudyImage>` parallax**: las imágenes mostraban "bandas" arriba/abajo cuando el parallax movía la imagen verticalmente (porque la imagen tenía exactamente el tamaño del container). Fix: la imagen ahora es 48px más alta que el container (`height: calc(100% + 48px)`, `top: -24px`) — el parallax se mueve de `y: +24` a `y: -24` sin exponer el fondo del container.
    - **D5 v3 — Nombre protagonista shrink-on-scroll** (3 iteraciones, terminó con caveat):
      - **v1 (descartado)**: `<NameLogo>` fixed top-left con `useScroll` global, escala con scrollY 0–600. Navbar separado. Nombre por DETRÁS del navbar (con blur en parte) — Tiago lo flagó.
      - **v2 (descartado)**: subido el z-index del nombre encima del navbar. Hamburguesa para items cuando minimal. Hero con `flex items-end`, headlines y CTA pill al bottom. Tiago: "el centro queda muy vacío".
      - **v3 (final, con caveat)**: `<NameLogo>` AHORA VIVE DENTRO del `<Navbar>` ([Navbar.tsx](src/components/ui/Navbar.tsx)). Navbar es `motion.header` con altura dinámica vía `useScroll` + `useTransform`: en home, altura va de 220px (cuando nombre grande) a 64px (cuando achica), rango 0–600px scroll. En case studies: 64px fijo. Backdrop-blur SIEMPRE activo — abarca toda la zona del nombre cuando es grande. **Esto cumple el patrón isadeburgh**: el headline del Hero sube por parallax detrás del navbar grande, y el blur lo funde correctamente. Threshold minimal/full a scrollY=500.
      - **Caveat (importante para próxima sesión)**: Tiago dijo "no me termina de cerrar". Funciona técnicamente pero la sensación visual no es la deseada. **NO arrancar otro intento sin pedirle qué falta exactamente** + revisar las refs `navbarshrink*_reference.png`.
    - **Hero rediseñado** ([Hero.tsx](src/components/sections/Hero.tsx)):
      - **Borrada** la status pill ("Disponible para colaborar").
      - **Borrado** el CTA pill sólido naranja anterior.
      - Layout: `flex flex-col` con wrapper interno `flex-1 grid grid-cols-[1fr_auto]`. Headlines izquierda con `self-center`, scroll indicator derecha con `self-center`. Ambos al centro vertical de la columna grid.
      - Headlines más chicos (`text-2xl md:text-4xl lg:text-5xl` + subheadline `text-xl md:text-2xl lg:text-3xl`) para no competir con el nombre grande.
      - **Scroll indicator nuevo**: texto "VER PROYECTOS" en font-mono semibold + 5 chevrons (`<ChevronDown size={36}>` de lucide, color accent terracota) animados en cascada con stagger 0.15s — efecto de flujo continuo hacia abajo. Reemplaza al CTA pill anterior. **Iteraciones rechazadas**: línea vertical con dot bajando (parecía slider/drag), 3 chevrons (cascada poco fluida).
      - Section extendido con `-mt-16 pt-40 md:pt-48 lg:pt-56` para que el dotgrid del fondo cubra desde el top del viewport (debajo del navbar transparente cuando minimal — ahora siempre con blur, pero la extensión del section sigue siendo necesaria para que los dots arranquen arriba).
      - Hero parallax: `useTransform(scrollY, [0, 400], [0, -80])` para `y`. **Sin opacity fade** — el blur del navbar funde el headline cuando sube por detrás.
    - **MarqueeLink polish**:
      - **Bug fix loop huérfano**: la animación con `repeat: Infinity` creada dentro de `onComplete` no se stoppea al hacer cleanup. Resultado: al hacer hover, el track se quedaba quieto unos segundos y volvía a moverse. Fix: guardar la `loopControls` en variable y stoppearla en cleanup.
      - **Reverse-on-hover-out**: cuando el usuario saca el mouse del marquee, el track ahora anima en REVERSO (hacia la izquierda, a `-copyWidth`) antes de retomar el loop normal (hacia la derecha). `wasHoveredRef` distingue primer mount (loop directo) de mouse-out (reverse + loop). Sensación: el marquee "rebobina" al lado opuesto del que viene girando.
      - **Dirección invertida** del loop: ahora el contenido se desplaza HACIA LA DERECHA (entra por la izquierda, sale por la der), opuesto al primer approach. Velocidad subida (3s en lugar de 4s). Tamaño y íconos: text-sm + 2× `<ArrowUpRight size={14}>`.
    - **20 imágenes case-study con `src` finales**: los 5 `imageBriefs[]` en `projects.ts` ahora tienen `src: '/images/case-study/{slug}/{01..04}-{name}.jpg'`. Removidos los campos `description` y `prompt` (eran notas internas). El layout Awwwards ya no muestra placeholders TODO — todo el caso de estudio se ve con foto real.
20. **F1 — Color fondo light beige + F4 — Toggle idioma segmented pill** (sesión 2026-05-07, sin commit):
    - **F1 — Fondo light cálido**: cambiados los tokens del bloque `:root` en [globals.css](src/app/[locale]/globals.css). Antes era off-white casi blanco (`#F7F4EF`); ahora es beige más cálido (Opción C de las 3 que ofrecí — el más saturado/papel):
      - `--bg-primary: #EDE2CD` (era `#F7F4EF`)
      - `--bg-secondary: #E5DAC4` (era `#EFECE7`)
      - `--bg-tertiary: #DDD2BB` (era `#E8E5E0`)
      - `--color-surface: #F4EAD5` (era `#FFFFFF` puro — un blanco sobre fondo beige se veía frío y desconectado, ahora es 1-step más claro que `--bg-primary`).
      - `--color-surface-hover: #ECE0C7` (era `#F0EDE8`).
      - **Sin cambios en**: ink-primary/secondary/muted (los textos siguen iguales, contraste OK contra el nuevo fondo) ni borders (rgba con alpha bajo del ink, queda OK).
      - Dark mode no cambia.
    - **F4 — Toggle idioma como segmented pill** ([LanguageToggle.tsx](src/components/ui/LanguageToggle.tsx)): componente nuevo reutilizable. Dos pills `EN | ES` lado a lado dentro de un container con border + bg-secondary. El locale activo: bg `--ink-primary` + color `--bg-primary` (sólido oscuro con texto cálido). El inactivo: transparent + color `--ink-muted` (apagado). Click en el inactivo → `router.push(pathname.replace(...))`. `aria-pressed` para a11y. Ref: `public/images/references/toggle_language_reference.png`.
    - **Reemplazo en Navbar**: el botón viejo (con ícono `Languages` + texto "ES"/"EN") fue reemplazado por `<LanguageToggle />` en dos lugares:
      - Modo full (lg+): inline junto al toggle de tema.
      - Modo minimal: dentro del dropdown de la hamburguesa, en una fila junto al toggle de tema (con `flex justify-between`).
    - **Cleanup**: eliminada la función `toggleLanguage` del Navbar (ahora vive dentro del componente). `useRouter` también removido del Navbar (ya no se usa). Import de `Languages` de lucide eliminado del Navbar.
21. **Rework "frontend creativo" — Fases 1-3 + polish post-rework** (sesión 2026-05-07 PM, sin commit):
    - **Fase 1 — Foundations (hooks + providers)**:
      - **Lenis 1.3.23** instalado como dep. Vanilla `new Lenis(...)` dentro de [SmoothScrollProvider.tsx](src/components/ui/SmoothScrollProvider.tsx) (no usé `lenis/react` para no agregar wrapper DOM extra). `anchors: true` para que `<a href="#contact">` haga scroll smooth nativo. Bypass automático cuando `prefers-reduced-motion` está activo (ni siquiera se instancia Lenis).
      - **Custom cursor**: [CustomCursor.tsx](src/components/ui/CustomCursor.tsx) provee `<CursorProvider>` (state) + render del dot 6px (spring rápido stiffness 800) + ring 32px (spring lento stiffness 200, lag visible). Variants: `default` (32px) / `link` (64px) / `view` (80px con pill "VIEW" adentro) / `drag` (dot 14px sin ring). `mix-blend-difference` invierte sobre cualquier fondo. Solo desktop (`pointer: fine`); en touch ni se renderea. Hook consumidor [useCursor.ts](src/hooks/useCursor.ts).
      - **SplitText** ([SplitText.tsx](src/components/ui/SplitText.tsx)): char reveal con stagger configurable. Versión final con **word-level wrappers** (`<span class="inline-block whitespace-nowrap">` por palabra) — fix obligatorio porque sin esto los chars con `display: inline-block` permitían line break entre cualquier dos chars (bug que el usuario flagó: "Diseño experien / cias con empatía"). Texto plano queda accesible vía `sr-only`. `whileInView` opcional con un único `IntersectionObserver` al container (no uno por char, sería caro). `prefers-reduced-motion` neutraliza animación entera.
      - **Magnetic hover** ([useMagneticHover.ts](src/hooks/useMagneticHover.ts)): hook que devuelve `{ ref, x, y }` con `useMotionValue` + `useSpring` (stiffness 150, damping 15, factor configurable). Mide rect del elemento en `mousemove`, calcula delta del centro, aplica factor. Vuelve a 0 en `mouseleave`. `useReducedMotion` desactiva el efecto.
      - **MagneticLink** ([MagneticLink.tsx](src/components/ui/MagneticLink.tsx)): wrapper `<motion.a>` que combina `useMagneticHover` + cursor variant on enter/leave. Reutilizable en CTAs.
      - **Body grain global**: agregado `body::before` en [globals.css](src/app/[locale]/globals.css) con SVG `feTurbulence` inline (data URI), `position: fixed inset-0`, `opacity: 0.03`, `pointer-events: none`. Da textura papel sobre toda la página.
      - **layout.tsx**: wrapeo del árbol con `<SmoothScrollProvider>` → `<CursorProvider>` → Navbar + main.
      - **Cleanup**: removido `scroll-behavior: smooth` del `html` (peleaba con Lenis y disparaba warning en Next 16 sobre `data-scroll-behavior`).
    - **Fase 2 — Navbar simplificado + NameLogo refactor**:
      - **Nuevo** [NavLogo.tsx](src/components/ui/NavLogo.tsx): texto "Tiago Collado" font-mono 14px en navbar. En home, opacity scroll-driven 0 → 1 entre `scrollY 200–400`. En case studies, siempre visible (no hay NameLogo en esas rutas).
      - **Navbar reescrito** ([Navbar.tsx](src/components/ui/Navbar.tsx)): eliminado el dual-mode minimal/full y la altura dinámica 220→64. Ahora `h-16` constante siempre. **Layout final**: NavLogo a la izquierda, **Proyectos / Sobre mí / MarqueeLink centrados absolutamente** (`absolute left-1/2 -translate-x-1/2`), LanguageToggle + theme a la derecha (separados de los links). En `<lg` colapsa a hamburger con dropdown stagger + rotate animation.
      - **NavLink** y **DropdownLink** componentes internos del Navbar para no repetir markup. NavLink usa `after:` utilities para underline draw on hover (scaleX 0 → 1 origin-left, 250ms expo-out). Los links cambian color de `--ink-secondary` → `--ink-primary` cuando `scrollY > 100`.
      - **Hamburguesa**: `<motion.button>` con `animate={{ rotate: menuOpen ? 90 : 0 }}`. Dropdown items entran con `staggerChildren: 0.06`.
      - **NameLogo refactor** ([NameLogo.tsx](src/components/ui/NameLogo.tsx)): sale del Navbar, vive ahora dentro del Hero como primer bloque visual. `position: sticky top-2`, scale `useTransform(scrollY, [0, 500], [1, 0.13])`, opacity `useTransform(scrollY, [0, 405, 500], [1, 1, 0])` — cross-fade con el NavLogo que ya está full opacity para entonces. Mount con `<SplitText>` (stagger 0.04, y 40, blur 8px, 0.8s expo-out, ~1.3s total). Solo se renderea en home. font-size `clamp(56px, 13vw, 144px)` con `letter-spacing -0.04em`.
    - **MarqueeLink fix** ([MarqueeLink.tsx](src/components/ui/MarqueeLink.tsx)): el usuario flagó dos bugs visuales del approach previo (Tanda 19):
      - **Hover frenaba hacia la derecha**: `animate(x, 0, ...)` desde un x negativo = movimiento positivo = derecha. Pero el loop natural ya va a la derecha → la decel se sentía como "continuar el loop". **Fix**: `animate(x, -copyWidth, ...)` desde cualquier x ∈ [-copyWidth, 0] = siempre hacia la izquierda. Bonus: como `-copyWidth` es visualmente idéntico a `0` (las copias son iguales), el reposo siempre queda alineado label-primero / íconos-después. Se eliminó el cap intermedio (`HOVER_LEFT_DELTA = 60`) que dejaba x en posiciones arbitrarias y hacía que tras varios hovers apareciera "ícono primero".
      - **Mouse-out hacía giro reversa innecesario**: el `wasHoveredRef` + branch de "anima a -copyWidth antes de retomar loop" daba la sensación de "rebobinar" al sacar el mouse. **Fix**: borrado entero ese branch. Ahora mouse-out entra directo a la lógica de continuación: animar de la x actual a `0` con duración proporcional + loop linear. Como el hover dejó x en `-copyWidth`, la continuación arranca exactamente como si fuera un ciclo nuevo del loop.
    - **Fase 3 — Hero rework**:
      - **NameLogo**: ya en font-size clamp 144px desde Fase 2. Solo agregado un comment explicativo de la alineación con NavLogo a scale 0.13.
      - **Hero H1 + H2 con SplitText**: reemplazados los `<h1>` / `<p>` plain por `<SplitText as="h1">` / `<SplitText as="p">`. Stagger 0.02, delay 0.6s (H1) y 1.0s (H2 — encadenado), y 16, blur 4, 0.6s expo-out. Borrado el `motion.div` viejo con `initial/animate` de mount del wrapper grid (los hijos animan individualmente ahora).
      - **CTA "VER PROYECTOS"** wrappeado en `<MagneticLink href="#projects" factor={0.2} cursorVariant="link">`. State `ctaHovered` controla:
        - `letterSpacing` del label: `0.25em → 0.3em` con `transition-all duration-300`.
        - Stagger delay de las 5 chevrons: `0.15s → 0.08s` (las flechas aceleran su cascada hacia abajo).
      - **InteractiveDotGrid** ([InteractiveDotGrid.tsx](src/components/ui/InteractiveDotGrid.tsx)) — 3 mejoras dentro del render loop existente:
        - **Idle pulse**: el radio de cada dot oscila 1× → 1.3× × base con período 4s vía `1.15 + 0.15 * Math.sin((now * 2π) / 4000)`. Da sensación de "respiración". Neutralizado en `prefers-reduced-motion` (escala fija en 1).
        - **Scroll fade**: `globalAlpha = opacity * scrollFade` donde `scrollFade = clamp(0, 1, 1 - scrollY/600)`. Lee `window.scrollY` por frame — sin listener extra. El grid se desvanece al scrollear fuera del Hero.
        - **Accent cluster**: dots con `t > 0.5` (mitad interna del radio de influencia del cursor) lerpean linealmente entre `--ink-secondary` (base) y `--color-accent` (terracota) proporcional a `(t - 0.5) * 2`. Parser RGB lee ambas CSS vars en mount + en cambios de tema vía `MutationObserver`.
    - **Polish post-rework** (3 fixes pedidos por el usuario tras probar):
      - **Dotgrid muy sutil en light mode**: el default `--ink-muted` (`#8A8680`) con opacity 0.55 sobre fondo `#EDE2CD` se mimetizaba. Cambiado a `colorVar="--ink-secondary"` (`#4A4845` en light, `#A8A49F` en dark) + opacity 0.7 desde Hero.
      - **SplitText word-wrap fix** (descripto arriba en Fase 1).
      - **Navbar links centrados**: separados visualmente del LanguageToggle / theme con `absolute left-1/2 -translate-x-1/2` para el grupo central. Antes los 3 links + 2 toggles estaban todos a la derecha pegados.
      - **Scrollbar custom** ([globals.css](src/app/[locale]/globals.css)): `::-webkit-scrollbar` ancho 10px, thumb `color-mix(--ink-muted, 50%)` con border transparente 2px (efecto pill 6px visible), hover sólido `--color-accent`, active `--color-accent-hover`, transición 0.2s. Para Firefox: `scrollbar-width: thin` + `scrollbar-color` dentro de `@supports (-moz-appearance: none)` — necesario porque la prop standard `scrollbar-width` IGNORA las reglas `::-webkit-scrollbar` en Chrome ≥ 121, así que la aislamos a Firefox.
    - **Pendiente próxima sesión**: Fase 4 (resto del home — Projects/About/Stack/Contact/Footer/Gallery con stagger granular + magnetic CTA en ProjectCard + blur-in en Gallery + gradient text en Stack heading + glow pulse en Contact CTAs).

---

### 🚦 Próximos pasos — orden recomendado

**REGLA**: una tarea por sesión. No abrir frentes en paralelo (ya nos pasó factura).

| # | Tarea | Tipo | Esfuerzo | Notas |
|---|---|---|---|---|
| **B1** | **Reemplazar covers provisorios** (FutbolTalentPro / Multibrand / Recuérdalo) | Tarea de Tiago | — | NO es código. Tiago tiene que generar/elegir mockups y reemplazar los archivos en `public/images/projects/{slug}-cover.jpg`. Hasta que lleguen, las cards muestran covers débiles. |
| **B3** | **Sumar métricas + handoff destacado en FutbolTalentPro** | Código + copy | 30 min | **Bloqueado**: Tiago tiene que pasar números reales (% éxito en testing, tiempo ahorrado, etc.) y detalle de qué subió al handoff (tokens, components, doc). Si no hay data real, se puede saltar. |
| **C1** | **Agregar Govah + Pulso Creativo** como proyectos WordPress | Código + data | 45 min | Tiago decidió incluirlos. Links: govah.com.ar / pulsocreativo.com.ar. Necesito de Tiago: tagline, descripción, tags, screenshot/cover, año, qué hizo él específicamente. Ambos son clientes reales. |
| **C2** | ~~Rediseño Awwwards-style de case studies~~ | Código | — | ✅ **COMPLETO** (2026-05-02). Los 5 case studies migrados con tono refinado. Detalle en Tanda 14. |
| **C2-img** | **Subir las 20 imágenes contextuales** (4 × 5 case studies) | Tarea de Tiago | — | NO es código. Tiago genera con Nano Banana / Gemini Pro / screenshots reales según [image-briefs.md](image-briefs.md). Subir a `public/images/case-study/{slug}/`. Después yo agrego `src` a cada brief en `projects.ts` y commit. |
| **C2-cleanup** | ~~Borrar branch legacy en `page.tsx` + helpers + i18n labels viejas~~ | Código | — | ✅ **COMPLETO** (2026-05-02). page.tsx bajó de 598 → 358 líneas. Detalle en Tanda 16. |
| **C3** | **Escalera intencional de `max-w`** | Código | 30-45 min | Tiago quiere diseñarla a propósito. Pendiente: definir el ritmo (ej. Hero angosto → Projects ancho → About angosto). Decisión antes de codear. |
| **D1** | **Botón "back to top" + reorder Footer** | Código | 60-90 min | Idea de Tiago. Implica reorganizar el centro del Footer (hoy ahí están redes + CV). Definir layout antes de codear. |
| **D2** | **Lightbox en Gallery + más imágenes por proyecto** | Código | 30-45 min | Cuando Tiago sume más imágenes en `public/images/gallery/{slug}/`, agregar click-para-expandir con FM. |
| **D3** | **Migración a `next/image`** en Gallery + ProjectCard | Código | 30 min | Mejora LCP. Se hace cuando los covers definitivos estén listos (después de B1). |
| **D4** | ~~Scroll-driven animations (parallax, reveals encadenados)~~ | Código | — | ✅ **COMPLETO** (2026-05-02). Hero parallax + Projects stagger + Footer reveal. Detalle en Tanda 17. |
| **D5 v3** | ~~Nombre protagonista shrink-on-scroll~~ | Código | — | ✅ **RESUELTO** por Fase 2 del rework (2026-05-07 PM, Tanda 21). El handoff NameLogo gigante (Hero, sticky, scale shrink) ↔ NavLogo chico (navbar, opacity scroll-driven) elimina el dual-mode altura-dinámica que generaba el "no me cierra". |
| **D5 v3-refine** | ~~Refinar visual de D5 v3~~ | Código | — | ✅ **RESUELTO** (2026-05-07 PM, Tanda 21) — la simplificación del navbar en Fase 2 del rework dejó la handoff limpia. |
| **F1** | ~~Color de fondo light más cálido (beige)~~ | Código | — | ✅ **COMPLETO** (2026-05-07). Opción C aplicada: `#EDE2CD` primary, `#F4EAD5` surface. Detalle en Tanda 20. |
| **F2** | ~~Animación de dots — analizar y aplicar globalmente o cambiar~~ | Código | — | ✅ **RESUELTO** por el plan rework (2026-05-07 PM): el `<InteractiveDotGrid>` queda confinado al Hero (con idle pulse + scroll fade + accent cluster, ver Tanda 21), y el grain global se cubre con `body::before` SVG-noise (opacity 0.03, textura papel sobre toda la página). |
| **F3** | **Tipografía principal nueva** | Código + research | 30 min | Reemplazar Space Grotesk (display) + Geist (body) por combo en tendencia para UX/UI + branding personal. **Pendiente de definir cuáles** — opciones a explorar: Inter, Manrope, Satoshi, General Sans, Söhne, Aeonik, Cabinet Grotesk, NB International. Charlar antes de codear. Toca [layout.tsx](src/app/[locale]/layout.tsx) (`next/font/google`) + `@theme` en globals.css. |
| **F4** | ~~Toggle idioma ES/EN como segmented pill~~ | Código | — | ✅ **COMPLETO** (2026-05-07). `<LanguageToggle />` componente nuevo, reemplaza al botón viejo en navbar inline + dropdown hamburguesa. Detalle en Tanda 20. |
| **D6** | ~~CustomCursor reimplementación~~ | Código | — | ✅ **COMPLETO** (2026-05-07 PM, Tanda 21) — `<CursorProvider>` + `<CustomCursor>` con dot+ring + variants `default | link | view | drag` + `mix-blend-difference`. |
| **D7** | ~~Navbar marquee link estilo isadeburgh~~ | Código | — | ✅ **COMPLETO** (2026-05-02). `<MarqueeLink>` con loop infinito + hover frena hacia la izquierda hasta label-aligned + mouse-out retoma loop derecho directo (sin reversa intermedia). Bug fix final en Tanda 21. |
| **Fase 4** | **Resto del home — Projects/About/Stack/Contact/Footer/Gallery polish** | Código | 90-120 min | Plan en `C:\Users\tiago\.claude\plans\necesito-que-el-portfolio-glistening-donut.md`. Stagger granular en cards/items, magnetic en ProjectCard CTA, blur-in en Gallery, gradient text en Stack heading, glow pulse en Contact CTAs. Próxima sesión. |
| **Fase 5** | **Case Study pages polish** | Código | 60-90 min | Plan en mismo archivo. SplitText H1, sidebar items stagger, blur-in en CaseStudyImage, cascade entrance en header. |
| **Fase 6** | **Polish & QA cross-cutting** | Código | 60 min | Plan en mismo archivo. Cursor variants en todos los links/images, audit `prefers-reduced-motion`, audit Lighthouse, ajustes finales de timings. |
| **E** | Easter egg, Vercel Analytics, dominio NIC.ar custom | Varía | — | Cuando estén ganas / tiempo / decisión. |

**Recomendación de orden** (actualizado 2026-05-07 PM, fin sesión Tanda 21): Fases 1-3 + D4 + D5 v3 + D5 v3-refine + D6 + D7 + F1 + F2 + F4 COMPLETOS. Lo que falta:
1. **Fase 4** (resto del home — Projects/About/Stack/Contact/Footer/Gallery polish) — próxima sesión.
2. **Fase 5** (case study pages polish).
3. **Fase 6** (polish & QA cross-cutting).
4. **F3** (tipografía nueva) — independiente de las fases del rework, charlar combo antes.
5. Backlog menor (D1 / D3 / D6 / C3 / cleanup CLAUDE.md) en sesiones cortas post-commit.
6. C1 / B1 / B3 cuando lleguen data/mockups de Tiago.

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
- **Excepción válida**: rework planificado en fases con check-in del usuario entre cada una (como Tanda 21 — Fases 1-3 chained con aprobación explícita). Eso NO es "abrir frentes paralelos", es ejecutar un plan acordado.

#### 12. SplitText con `display: inline-block` en chars rompe palabras a la mitad
- **Error**: Cuando hicimos el primer SplitText, cada char era `<span style="display: inline-block">`. En viewports estrechos, "Diseño experiencias con empatía" rompía como "Diseño experien / cias" — mid-word.
- **Por qué**: cada inline-block crea un break opportunity entre sí mismo y el siguiente. Sin un wrapper que preserve la unidad de la palabra, el browser puede romper en cualquier char.
- **Lección**: el patrón correcto es **wrap por palabra + `whitespace-nowrap`** dentro del wrap. Entre palabras va un text node `' '` (espacio normal) que es el ÚNICO punto donde se permite line break. Implementación final en [SplitText.tsx](src/components/ui/SplitText.tsx).

#### 13. Framer Motion `staggerChildren` solo aplica a hijos directos
- **Error**: Asumí que `staggerChildren: 0.04` en el parent variant orchestrator se propagaba a TODOS los descendientes motion. No: solo aplica a hijos motion DIRECTOS del orchestrator. Si hay spans intermedios (por ej. word-wrappers para evitar el bug #12), el stagger no llega.
- **Lección**: si necesitás stagger char-by-char con word-wrappers en el medio, no uses variants/`staggerChildren`. **Calculá el delay manualmente por char**: `delay: baseDelay + globalCharIdx * stagger`. Es más código pero predictible y no depende de la estructura DOM.

#### 14. Chrome ≥ 121: `scrollbar-width: thin` mata las reglas `::-webkit-scrollbar`
- **Error**: Estilamos la scrollbar con `::-webkit-scrollbar` (track + thumb + hover). En paralelo, agregué `scrollbar-width: thin` en `html` "para Firefox". Resultado en Chrome: scrollbar default, las reglas webkit ignoradas.
- **Por qué**: Chrome 121+ implementó las props CSS standard `scrollbar-width` y `scrollbar-color`. Cuando están seteadas, **toman precedencia sobre los pseudo-elementos webkit**. Es la implementación de la spec, no un bug de Chrome.
- **Lección**: si querés `::-webkit-scrollbar` rules en Chromium/Safari, **NO setees `scrollbar-width` a nivel global**. Aislá `scrollbar-width` + `scrollbar-color` para Firefox vía `@supports (-moz-appearance: none)` (la prop solo existe en Gecko, así que la regla nunca se activa en otros). Patrón en [globals.css](src/app/[locale]/globals.css).

#### 15. Lenis y `scroll-behavior: smooth` se pelean
- **Lección**: cuando agregás Lenis (smooth scroll lerpeado por JS), **sacá `scroll-behavior: smooth` del `html`**. Las dos animaciones compitiendo se sienten raras y Next 16 además flagea el warning sobre `data-scroll-behavior`. Si en algún momento se quita Lenis y se quiere volver al smooth nativo, agregar `data-scroll-behavior="smooth"` en `<html>` (atributo, no la regla CSS), porque Next lo respeta solo en navegación intra-app.

---

## 🎨 Referencias visuales (inspiración)

URLs que Tiago compartió como inspiración premium:
- **https://isadeburgh.com/** — el "Get in touch" de la navbar funciona como un texto que rota in-place tipo carrusel; al hacer hover se frena y al click va al mail. Vale la pena copiar este patrón cuando lleguemos a Navbar refinada.
- **https://artemiilebedev.com/** — referencia general de portfolio premium.
- **https://louispaquet.com/** — ídem.

URLs Awwwards-style para case study (pasadas 2026-05-01, target visual de C2):
- **https://carolinalevinsky.com/index.html** — copy mínima por proyecto, 2-3 líneas.
- **https://mikekus.com/** — branding-heavy, tagline corto + servicios.
- **https://joonassandell.com/** — case studies con imagen hero gigante + metadata mínima (año, disciplinas).
- **https://henriheymans.com/**
- **https://silviasguotti.design/**
- **https://www.alejandromejias.com.au/** — design systems + UI focused, copy concisa.
- **https://yaremenko.design/**

Patrón común a todas (señalado por Tiago): **copy super corta, ninguna tiene textos extensos**. Sidebar metadata estructurada, tipografía como protagonista, imágenes contextuales (no decorativas).

Imágenes de referencia ya en `public/images/references/`:
- `hero_reference.png` — POSTA agency: tipografía gigante centrada, mucha respiración, glow accent arriba.
- `navbar_reference.png` — Felipe portfolio: logo a la izquierda, nav con `Mail` icon en pill, glow accent.
- `card_reference_desactive.png` — UMAIVERSE / VERTEX IDENTITY: cards con tag arriba, título display gigante centrado-abajo, overlay coloreado, CTA pill con flecha.
- `about_reference.png` / `about_reference2.png` — POSTA / Product Designer: claim gigante con palabras en bold, body text chico desplazado, distribución asimétrica.
- `casestudy_reference.png` — Mediasignal: sidebar metadata izq con columnas (Client / Year / Project type / Role / Tech / Made together with) + intro narrativa grande a la derecha. Tipografía sobria, mucho aire.
- `casestudy(2)_reference.png` — LinkBoard top: header en grid con micro-labels chiquitos arriba (`Client`, `Why`, `Project info`) y copy gigante abajo.
- `casestudy(3)_reference.png` — LinkBoard bottom: bloque "What we did" con sidebar label izq + párrafo der, y grid de chips de disciplinas con flechas (Art Direction →, Graphic Design →).

**Regla cuando se mire una referencia**: identificar la idea concreta a replicar (un patrón, una proporción, una micro-interacción), no copiar pixel-perfect. El portfolio mantiene su identidad de "minimalismo técnico pero cálido" con accent terracota.

---

### ✅ Lo que YA funciona
- **Deploy en Vercel**: https://tiagocollado.vercel.app/ (CI/CD activo, cada push a main redeploya)
- **Bug de producción resuelto**: las páginas de proyecto ya renderean en Vercel (commit `10aa279`).
- **Layer "frontend creativo"** (Tanda 21):
  - **Lenis smooth scroll** global (anchors interceptados nativamente; bypass en `prefers-reduced-motion`)
  - **Custom cursor** dot+ring con variants (`default | link | view | drag`) + `mix-blend-difference`
  - **SplitText** char reveal con word-level wrappers + sr-only para a11y
  - **Magnetic hover** hook + `<MagneticLink>` (combina magnetic + cursor variant)
  - **Body grain** SVG-noise tiled global (opacity 0.03, textura papel)
  - **Scrollbar custom** theme-aware con terracota en hover
- **Secciones activas**:
  - `Navbar` simplificado h-16 fijo: NavLogo izq + Proyectos / Sobre mí / MarqueeLink centrados absolutos + LanguageToggle / theme der. Hamburger en `<lg` con dropdown stagger + rotate.
  - `Hero` con `<NameLogo>` gigante sticky shrink-on-scroll (handoff a NavLogo via cross-fade), H1+H2 con SplitText, CTA en MagneticLink + tracking expand + chevrons aceleran on hover, `InteractiveDotGrid` con idle pulse + scroll fade + accent cluster cerca del cursor.
  - `Projects` con grilla Bento asimétrica + `ProjectCard` rediseñado (overlay theme-aware con `color-mix()`, tag+año en pills bordeadas top-left, título display dominante bottom-left, hover-reveal de tags+CTA pill sólido accent, glow accent en hover)
  - `About` con header (eyebrow + claim "Diseño y código en una sola cabeza."), 4 bloques de copy cortos (background / hybrid_path / hook en bold-display / mission), `<aside>` con áreas de práctica como lista numerada editorial sin chrome de botón, `<footer>` con ubicación
  - `Stack` carrusel infinito pausable en hover, con `<StackIcon>` (simple-icons + lucide + Adobe en cuadrados con iniciales monocromos)
  - `Contact` con CTAs a email y WhatsApp como pills compactas (íconos Lucide)
  - `Footer` con LinkedIn, GitHub y descarga de CV (SVGs inline)
  - **Páginas de case study con layout Awwwards** (los 5: FTP, Ritual, Cabify, Multibrand, Recuérdalo): grid 12-col con sidebar `col-span-3` sticky en `lg+` (Cliente / Año / Rol / Duración / Equipo / Stack / NDA / Links) + main `col-span-9` editorial con 4 secciones (Intro hook → Desafío → Cómo lo resolví con 3 decisiones intercaladas con imagen → Lo entregado + cierre). Componentes: `<CaseStudySidebar />`, `<CaseStudySection />`, `<CaseStudyImage />` (este último con `useScroll`/`useTransform` para parallax + placeholder mode con border dashed cuando `src` está vacío). Ver Tanda 14.
  - `Gallery` para casos de estudio: carrusel Embla + Framer Motion (solo se renderea cuando `awwwardsLayout: false` — en los 5 actuales no aparece, las imágenes contextuales hacen el trabajo)
- **i18n funcionando**: español default, inglés toggle, archivos en `src/messages/es.json` y `src/messages/en.json`
- **Dark/light mode**: con next-themes, persiste en localStorage
- **Animaciones**: Framer Motion (fade + slide en scroll, hover states, magnetic hovers, char reveal con SplitText, parallax)
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
- **Resto del rework** (Fases 4-6): Projects/About/Stack/Contact/Footer/Gallery con stagger granular + magnetic CTAs + blur-in en images + gradient text en Stack heading + glow pulse en Contact. Plan en `C:\Users\tiago\.claude\plans\necesito-que-el-portfolio-glistening-donut.md`.
- **Tipografía principal** (F3): Space Grotesk + Geist están bien pero Tiago quiere algo más en tendencia para UX/UI / branding personal.
- **Mockups definitivos** de covers FutbolTalentPro / Multibrand / Recuérdalo (los 3 provisorios siguen en `public/images/covers/`). Tarea de Tiago.
- **Métricas en FutbolTalentPro**: bloqueado en data de Tiago (% de éxito en testing, tiempo ahorrado, etc.).
- **Govah + Pulso Creativo**: agregar como proyectos WordPress (clientes reales). Necesita data de Tiago.
- **Imágenes**: tanto `Gallery.tsx` como `ProjectCard.tsx` como `CaseStudyImage` usan `<img>` nativo. Migrar a `next/image` para mejorar LCP.

### 📐 Íconos — estado actual
- **`lucide-react` ^1.11.0** instalado y usado en: Navbar (Sun/Moon/Languages), Contact (Mail/MessageCircle), StackIcon (PenLine/Sparkles/Search/Wand2/Blocks/Contrast para skills sin marca).
- **SVGs inline** en Footer (LinkedIn, GitHub, FileText de CV).
- **`simple-icons` ^15.x** para marcas en Stack (Figma, React, Next.js, Tailwind, HTML5, CSS, GitHub).
- **Adobe** (Photoshop, Illustrator, Premiere): cuadrados bordeados con iniciales `Ps`/`Ai`/`Pr` en `currentColor` (Adobe NO está en simple-icons por temas de licencia — esta es la convención visual oficial). Definidos en `ADOBE_INITIALS` de `StackIcon.tsx`.
- **Patrón de StackIcon**: todo monocromo con `currentColor` para que herede del wrapper y respete el tema. Para agregar un ícono nuevo: editar `SIMPLE_ICONS`, `LUCIDE_ICONS` o `ADOBE_INITIALS` en `StackIcon.tsx`.

### 📋 Features pendientes (opcionales pero charladas)
- **Cursor personalizado (Awwwards-style)**: a reimplementar cuando se quiera. Debe ser sutil (dot + anillo con lag), magnético sobre interactivos, deshabilitado en touch.
- **Easter egg** (konami code o micro-interacción escondida).
- **Covers provisorios a reemplazar** (Tarea B1):
  - FutbolTalentPro: screen provisorio que no quedó bien.
  - Multibrand: cover con nombres del equipo (mejor usar mockups desktop).
  - Recuérdalo: cover de presentación TP (mejor usar mockups mobile).
  - El Ritual del Tono + Cabify: OK.
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
3. **Cabify Music Match** — Concept UX/UI (2023), prototipo iPhone 14 (sin CTAs activos: Behance fue removido del portfolio en B2.5)
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

## Prioridades inmediatas (al 2026-05-07 PM, post Tanda 21 + commit)

### Listo para arrancar
1. **Fase 4 — Resto del home** (90-120 min). Próximo en agenda. Plan en `C:\Users\tiago\.claude\plans\necesito-que-el-portfolio-glistening-donut.md`. Stagger granular en Projects/About/Stack/Contact/Footer + magnetic CTA en ProjectCard + blur-in en Gallery + gradient text en Stack + glow pulse en Contact CTAs.
2. **Fase 5 — Case Study pages polish** (60-90 min). SplitText H1, sidebar items stagger, blur-in en CaseStudyImage, cascade entrance en header.
3. **Fase 6 — Polish & QA cross-cutting** (60 min). Cursor variants en todos los links/images, audit `prefers-reduced-motion`, audit Lighthouse, ajustes finales de timings.
4. **F3 — Tipografía nueva** (30 min, independiente del rework). Definir combo antes de codear (Inter / Manrope / Satoshi / General Sans / Söhne / Aeonik / Cabinet Grotesk / NB International). Edit en layout.tsx + @theme.

### Bloqueado por contenido de Tiago
- **Mockups definitivos** de covers FutbolTalentPro / Multibrand / Recuérdalo → reemplazar archivos en `public/images/covers/`. (Tarea B1)
- **Métricas de FutbolTalentPro** → para sumar peso al case study. (Tarea B3)
- **Data de Govah + Pulso Creativo** → tagline, descripción, tags, cover, año, rol específico. (Tarea C1)

### Backlog menor (post-Fase 6)
- **D1 — Botón back-to-top + Footer reorder**: requiere decisión visual previa antes de codear.
- **D3 — Migración a next/image**: optimización de LCP.
- **C3 — Escalera intencional de max-w**: pensar el ritmo antes de tocar componentes.

Resto del backlog en "🚦 Próximos pasos" arriba.

---

## Estilo de comunicación preferido

- Directo y sin condescendencia
- Honesto cuando algo está mal (ej: señalar errores de copy o decisiones dudosas)
- Explicar el "por qué" de las decisiones técnicas, no solo el "qué"
- Paso a paso cuando es código complejo
- Preguntar antes de asumir cuando falta info (sobre proyectos, rol exacto, decisiones, etc.)
- **Código entendible por sobre abstracciones avanzadas** — Tiago está aprendiendo, la claridad importa más que el cleverness