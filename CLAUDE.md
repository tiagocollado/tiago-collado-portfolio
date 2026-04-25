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

## 📍 Dónde estamos ahora — última sesión: 2026-04-25

### Estado del proyecto
**Buen momento del trabajo.** Las bases visuales están funcionando, las animaciones premium ya están (canvas dot-grid, Embla gallery), y el saneamiento técnico es sólido (Tailwind v4 funcionando bien, i18n con paridad completa, sin dead code, sin inline-style workarounds). Falta el siguiente nivel de polish visual (cards, página de caso de estudio, escalera intencional).

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

---

### 🚦 Próximos pasos — orden recomendado

| # | Tarea | Esfuerzo | Por qué este orden |
|---|---|---|---|
| 1 | **Tanda B — Rediseño de ProjectCards** | 45-60 min | Bug visible (light mode hover) + alto impacto Awwwards. Las cards son lo más visible de la home. Referencias listas (`card_reference_active/desactive.png`). |
| 2 | **Tanda E — Rediseño de página de caso de estudio** | 60-90 min | **Bloqueado**: Tiago tiene que pasar 1-2 referencias visuales o decidir dirección (editorial / cinematográfica / técnica). Sin eso, no codear. |
| 3 | **Escalera intencional de `max-w`** | 30-45 min | Decisión de Tiago: quiere diseñarla a propósito. Pendiente: definir el ritmo (ej. Hero angosto → Projects ancho → About angosto). |
| 4 | **Botón "back to top" + reorder Footer** | 60-90 min | Idea de Tiago. Implica reorganizar el centro del Footer (hoy ahí están redes + CV). Definir layout antes de codear. |
| 5 | **Reemplazar covers provisorios** (FutbolTalentPro / Multibrand / Recuérdalo) | Tarea de Tiago | Necesita mockups reales de él. No es código. |
| 6 | **Lightbox en Gallery + más imágenes por proyecto** | 30-45 min | Cuando Tiago sume más imágenes en `public/images/gallery/{slug}/`, agregar click-para-expandir. |
| 7 | **Migración a `next/image`** en Gallery + ProjectCard | 30 min | Mejora LCP. Se hace cuando los covers definitivos estén listos. |
| 8 | **Scroll-driven animations** (parallax, reveals encadenados) | 60-90 min | Capa de polish post-cards. `useScroll` + `useTransform` de Framer Motion. |
| 9 | **Navbar shrink en scroll** | 20-30 min | Detalle premium chico, alto impacto. |
| 10 | **CustomCursor reimplementación** | 60 min | Si Tiago lo quiere de vuelta — el componente original estaba roto, se eliminó. |
| 11 | **isadeburgh-style "get in touch" rotativo en Navbar** | 30 min | Inspiración de Tiago: texto que rota in-place, pausa en hover, click va al mail. |
| 12 | Easter egg, Vercel Analytics, dominio NIC.ar custom | varía | Cuando estén ganas / tiempo / decisión. |

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
  - `Hero` con dot-grid estático (pendiente upgrade a canvas interactivo) y CTA único
  - `Projects` con grilla Bento asimétrica
  - `About` con dos párrafos narrativos + columna de chips UX/UI · Frontend · Product Design
  - `Stack` carrusel infinito pausable en hover (usa marcador minimalista, sin Devicon — ver sección de íconos)
  - `Contact` con CTAs a email y WhatsApp (íconos Lucide)
  - `Footer` con LinkedIn, GitHub y descarga de CV (SVGs inline)
  - `Gallery` para casos de estudio: carrusel Embla + Framer Motion, con prev/next, dots, contador 01/05 y transición de crossfade en el slide activo
- **i18n funcionando**: español default, inglés toggle, archivos en `/messages/es.json` y `/messages/en.json`
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
- **Íconos del Stack**: hoy es solo un dot + texto. Decidir si se agregan íconos de marca (opciones: SVGs locales en `public/images/stack/`, el paquete `simple-icons`, o `devicon` instalado como npm en vez de CDN).
- **Project cards**: hover overlay todavía básico; se puede sumar tilt 3D, reveal más rico, parallax del cover.
- **`en.json` completado** (antes solo tenía `nav`, `hero` y `contact` → ahora paridad total con `es.json`, 74 keys incluyendo los 5 case studies completos). Traducción no literal, adaptada al tono profesional de reclutadores angloparlantes.
- **Imágenes**: tanto `Gallery.tsx` como `ProjectCard.tsx` usan `<img>` nativo. Migrar a `next/image` cuando se trabajen los covers definitivos para mejorar LCP.
- **Gallery**: ya usa Embla, pero falta sumar lightbox on click y sumar más imágenes por proyecto (hoy solo hay 1 por slug).
- **Scroll-driven animations**: solo hay fade-in básico, falta parallax y reveals encadenados.
- **Navbar**: no tiene cambio de estilo al scrollear.

### 📐 Íconos — estado actual
- **`lucide-react` ^1.11.0** instalado y usado en: Navbar (Sun/Moon/Languages), Contact (Mail/MessageCircle).
- **SVGs inline** en Footer (LinkedIn, GitHub, FileText de CV).
- **Stack**: sin íconos de marca. Devicon CDN fue removido porque no cargaba.
- **Pendiente de decisión**: qué fuente usar para íconos de marca (Figma, Photoshop, React, etc.) en el Stack. Recomendación: SVGs locales descargados de simpleicons.org — sin deps nuevas, control total.

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
- **i18n**: next-intl (archivos en `/messages/` en la raíz del proyecto, NO en src/)
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
├── messages/               # next-intl busca acá (raíz, no en src/)
│   ├── es.json
│   └── en.json
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

**Excluidos del portfolio** (charlado): WordPress sites (Govah, Pulso Creativo), SoundCloud Redesign incompleto, Rick & Morty Explorer (junior).

---

## Reglas de contenido / NDA

- **FutbolTalentPro**: NDA permite mostrar "material no sensible" para portfolio. NO mostrar pantallas finales del producto. SÍ mostrar wireframes baja/media, flujos, design system, user personas.
- **Sobre el copy**: el tono del About es directo, sin forzar narrativas de "Silicon Valley". Se evita mencionar acuerdo de confidencialidad en el About principal (solo dentro del caso de estudio de FutbolTalentPro).

---

## Workflow actual

- **Desarrollo**: `npm run dev` (levanta en localhost:3000)
- **Deploy**: automático en cada push a `main` en GitHub (Vercel detecta y redeploya)
- **i18n**: para agregar nuevas traducciones, editar `/messages/es.json` y `/messages/en.json`
- **Nuevo proyecto**: agregar en `src/data/projects.ts` + opcionalmente crear key `case_study_{slug}` en ambos JSON de mensajes

---

## Prioridades inmediatas sugeridas

1. **🚨 URGENTE: Resolver el bug de producción** — páginas de proyecto rompen en Vercel pero funcionan en local. Revisar logs de Vercel y probablemente arreglar config de next-intl SSR.
2. **Ajustar el stack tecnológico** del carrusel — quitar MongoDB, Node.js, TypeScript; agregar más herramientas UX/UI y de creatividad (ver sección arriba).
3. **Agregar librería de íconos** — probablemente `lucide-react` para reemplazar emojis en toggles, agregar íconos de LinkedIn/GitHub en footer, flechas en CTAs, etc.
4. **Rediseñar lo visual** — agregar paddings, fondos con textura sutil, mejores hover states en cards, más animaciones de scroll, shadows, borders con gradientes sutiles.
5. **Covers profesionales** — reemplazar los 3 provisorios (FutbolTalentPro, Multibrand, Recuérdalo) con mockups.
6. **Galerías dentro de casos de estudio** — actualmente solo hay un cover, falta mostrar más proceso (wireframes, flujos, pantallas adicionales).
7. **Cursor personalizado + easter egg** — si se confirma que no ralentizan.
8. **Dominio custom** — cuando compre en NIC.ar, linkear a Vercel.

---

## Estilo de comunicación preferido

- Directo y sin condescendencia
- Honesto cuando algo está mal (ej: señalar errores de copy o decisiones dudosas)
- Explicar el "por qué" de las decisiones técnicas, no solo el "qué"
- Paso a paso cuando es código complejo
- Preguntar antes de asumir cuando falta info (sobre proyectos, rol exacto, decisiones, etc.)
- **Código entendible por sobre abstracciones avanzadas** — Tiago está aprendiendo, la claridad importa más que el cleverness