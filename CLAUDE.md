@AGENTS.md
# Portfolio Tiago Collado — Contexto del proyecto

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

### ✅ Lo que YA funciona
- **Deploy en Vercel**: https://tiagocollado.vercel.app/ (CI/CD activo, cada push a main redeploya)
- **Estructura completa**:
  - Navbar con toggles de idioma (ES/EN) y tema (dark/light)
  - Hero con dot-grid y CTA único
  - Projects con grilla Bento asimétrica
  - About con 3 párrafos narrativos
  - Stack con carrusel infinito pausable en hover
  - Footer con CTA de contacto, links sociales y CV descargable
- **i18n funcionando**: español default, inglés toggle, archivos en `/messages/es.json` y `/messages/en.json`
- **Dark/light mode**: con next-themes, persiste en localStorage
- **Animaciones**: Framer Motion (fade + slide en scroll, hover states)
- **4 casos de estudio completos con contenido real** (FutbolTalentPro, El Ritual del Tono, Cabify Music Match, Multibrand Design System, Recuérdalo)
- **CV descargable** funcionando en footer
- **Retro Kicks** como "Coming soon" con overlay blur

### 🚨 BUG CRÍTICO ACTUAL (resolver PRIMERO)
**Las páginas de proyectos funcionan en localhost pero rompen en producción.**
- Error mostrado: "This page couldn't load. A server error occurred."
- Afecta a TODOS los proyectos, no solo uno
- No se identificó la causa aún (faltó revisar logs de Vercel)
- Probable causa: problema con `getTranslations` de next-intl en SSR en Next.js 16, o con la estructura de archivos de mensajes en producción
- **Cómo diagnosticar**: entrar a Vercel → Deployments → último deployment → Runtime Logs, buscar stack traces relacionados con next-intl

### ⚠️ Lo que falta mejorar (DISEÑO VISUAL)
El portfolio funciona pero visualmente está **muy plano** para un diseñador UX/UI:
- **Espaciado**: faltan paddings, respiración entre secciones
- **Fondos**: están muy monótonos, falta textura/gradientes sutiles/noise
- **Dot-grid del Hero**: muy tenue en light mode (se decidió no tocarlo aún)
- **Animaciones**: faltan más interacciones (scroll reveal más dramático, hover states en cards más elaborados, transiciones entre páginas)
- **Project cards**: el hover overlay es muy básico, faltan sombras y detalles
- **Borders**: muy planos, podrían tener gradientes sutiles
- **Micro-interacciones**: faltan en botones y toggles

### 🎨 Decisión pendiente: Íconos
**Actualmente no se usa ninguna librería de íconos.** Hay que agregar para mejorar estética:
- **Recomendación**: `lucide-react` (más moderna, minimalista, cabe con el estilo "minimalismo técnico pero cálido")
- **Alternativa**: `react-icons` (más variedad pero menos consistencia visual)
- **Uso planeado**: íconos en toggles del navbar (sol/luna mejor que ☀/☾ emojis), links sociales del footer (LinkedIn, GitHub), flechas en CTAs, íconos decorativos en secciones
- **Decisión final la toma Claude Code** basándose en consistencia visual con el resto del diseño

### 📋 Features pendientes (opcionales pero charladas)
- **Cursor personalizado** (trazo que sigue al mouse, efecto magnético en botones)
- **Easter egg** (konami code o micro-interacción escondida)
- **Mejores covers de imágenes**: actualmente son provisorios
  - FutbolTalentPro: screen provisorio que no quedó bien
  - Multibrand: cover con nombres del equipo (mejor usar mockups desktop)
  - Recuérdalo: cover de presentación TP (mejor usar mockups mobile)
  - El Ritual del Tono + Cabify: OK
- **Galerías de imágenes dentro de cada caso de estudio** (actualmente solo hay un cover)
- **Dominio custom NIC.ar** (no comprado aún, nunca linkeé DNS de NIC a Vercel, sí de NIC a Hostinger)
- **Analytics** (Vercel Analytics pendiente de decisión)

---

## Stack técnico del proyecto (el que usamos para construir el portfolio)

- **Framework**: Next.js 16 (App Router) con Turbopack
- **Lenguaje**: TypeScript
- **React**: 19
- **Estilos**: Tailwind CSS v4 (sin `tailwind.config.ts`, usa `@theme` en globals.css)
- **Animaciones**: Framer Motion
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
│   │   │   └── Stack.tsx
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