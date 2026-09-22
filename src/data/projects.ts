import { Project } from '@/types'

export const projects: Project[] = [
  {
    slug: 'paseo-guemes-hotel',
    title: 'Paseo Güemes Hotel',
    tagline: {
      es: 'Sitio mobile-first para un hotel 3 estrellas que necesitaba dejar de depender de las OTAs.',
      en: 'Mobile-first site for a 3-star hotel that needed to stop depending on OTAs.',
    },
    description: {
      es: 'Análisis de mercado, wireframes en Figma e implementación en WordPress, con reserva directa integrada y foco en conversión mobile.',
      en: 'Market analysis, Figma wireframes, and WordPress implementation, with direct booking integrated and a focus on mobile conversion.',
    },
    tags: ['UX Research', 'UI Design', 'WordPress', 'Mobile-first', 'SEO local'],
    services: {
      es: ['Diseño Web', 'Dirección de Arte'],
      en: ['Website Design', 'Art Direction'],
    },
    links: {
      live: 'https://paseoguemeshotel.com.ar',
    },
    cardShape: 'wide',
    // Cover limpio: `2400x1800` (4:3, la forma de esta card) con las dos
    // pantallas en captura real y sin composicion en perspectiva.
    coverImage: '/images/covers/paseo-guemes-hotel-cover.jpg',
    year: 2026,
    showOnHome: true,
    order: 1,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'Paseo Güemes Hotel · Salta',                                en: 'Paseo Güemes Hotel · Salta' },
      role:     { es: 'Dirección de arte, diseño UX/UI e implementación en WordPress', en: 'Art direction, UX/UI design & WordPress implementation' },
      duration: { es: '2 meses',                                                   en: '2 months' },
      team:     { es: 'Diseño y ejecución end-to-end · trato directo con el cliente', en: 'End-to-end design & delivery · direct client relationship' },
      stack:    ['Figma', 'WordPress'],
    },
    /*
     * Cuatro imagenes con el vocabulario. El nombre del archivo dice QUE es;
     * el `slot` decide DONDE cae.
     *
     * - Va SIN diagrama, a proposito. Sus decisiones (reserva directa sobre
     *   las OTAs, un stack que el cliente puede editar, la jerarquia del hero
     *   y los CTAs por recorrido) no tienen una estructura que valga la pena
     *   dibujar. Forzar un diagrama seria volver a la cuota.
     * - `challenge` tampoco lleva imagen.
     * - El cluster va sobre el marron de marca `#6A442E` (§4.1 de las rules).
     */
    imageBriefs: [
      {
        type: 'mockup',
        slot: 'hero',
        alt: {
          es: 'Laptop y celular sobre hormigón con la home de Paseo Güemes Hotel en pantalla',
          en: 'Laptop and phone on concrete showing the Paseo Güemes Hotel home page',
        },
        src: '/images/case-study/paseo-guemes-hotel/00-mockup.jpg',
      },
      {
        type: 'long-strip',
        slot: 'intro',
        // Tira partida en columnas: la home desktop en dos y la mobile en
        // tres, lado a lado. Por eso es 16:9 y no una tira vertical.
        frame: { width: 1440, height: 810 },
        alt: {
          es: 'La home completa, de punta a punta, en desktop y en mobile, partida en columnas',
          en: 'The full home page, top to bottom, on desktop and mobile, split into columns',
        },
        src: '/images/case-study/paseo-guemes-hotel/01-tira.jpg',
      },
      {
        type: 'screen-cluster',
        slot: 'decisions',
        alt: {
          es: 'Tres pantallas mobile sobre el marrón de la marca: la home, Beneficios locales y la página de ubicación',
          en: 'Three mobile screens on the brand brown: the home page, Local Benefits, and the location page',
        },
        src: '/images/case-study/paseo-guemes-hotel/02-cluster.jpg',
      },
      {
        type: 'palette',
        slot: 'delivered',
        alt: {
          es: 'Paleta extraída del logo, con el logo al lado: marrón marca, marrón claro, crema, negro y blanco',
          en: 'Palette taken from the logo, shown next to it: brand brown, light brown, cream, black, and white',
        },
        src: '/images/case-study/paseo-guemes-hotel/03-paleta.jpg',
      },
    ],
  },
  {
    slug: 'pulso-creativo',
    title: 'Pulso Creativo',
    tagline: {
      es: 'Sitio institucional para una consultora B2B con más de 25 años de trayectoria.',
      en: 'Institutional website for a B2B consultancy with over 25 years of experience.',
    },
    description: {
      es: 'Sitio institucional con los clientes a la vista y casos de éxito reescritos para leerse de un vistazo.',
      en: 'Institutional site that puts the clients up front and rewrites the success stories to read at a glance.',
    },
    tags: ['WordPress', 'Elementor', 'UX Writing', 'UI Design', 'B2B'],
    services: {
      es: ['Diseño Web'],
      en: ['Website Design'],
    },
    links: {
      live: 'https://pulsocreativo.com.ar',
    },
    cardShape: 'square',
    coverImage: '/images/covers/pulso-creativo-cover.jpg',
    year: 2026,
    showOnHome: true,
    order: 2,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'Pulso Creativo',                                              en: 'Pulso Creativo' },
      role:     { es: 'Diseño UX/UI e implementación en WordPress',                  en: 'UX/UI design & WordPress implementation' },
      duration: { es: '3 meses',                                                     en: '3 months' },
      team:     { es: 'Diseño y ejecución end-to-end · trato directo con el cliente', en: 'End-to-end design & delivery · direct client relationship' },
      stack:    ['Figma', 'WordPress'],
    },
    /*
     * Primer case study cerrado con el vocabulario: cinco imagenes, cada una
     * de un tipo distinto. El nombre del archivo dice QUE es; el `slot`
     * decide DONDE cae.
     *
     * - `challenge` queda SIN imagen, a proposito: el desafio era texto denso
     *   del cliente y conflictos de plantillas de WordPress, y no hay nada
     *   visual honesto que mostrar. No es un hueco por completar.
     * - 02 y 03 comparten `decisions`: van seguidas, como grupo.
     * - El cluster va sobre el verde de marca y la paleta sobre charcoal. No
     *   son acromaticas y esta bien: eso es regla de los covers, no de las
     *   imagenes de case study (`.claude/rules/imagenes.md` §4.1).
     */
    imageBriefs: [
      {
        type: 'mockup',
        slot: 'hero',
        alt: {
          es: 'Laptop sobre hormigón con la home de Pulso Creativo en pantalla',
          en: 'Laptop on concrete showing the Pulso Creativo home page',
        },
        src: '/images/case-study/pulso-creativo/00-mockup.jpg',
      },
      {
        type: 'long-strip',
        slot: 'intro',
        // Tira partida en columnas: la home desktop en dos y la mobile en
        // dos, lado a lado. Por eso es 16:9 y no una tira vertical.
        frame: { width: 1440, height: 810 },
        alt: {
          es: 'La home completa, de punta a punta, en desktop y en mobile',
          en: 'The full home page, top to bottom, on desktop and mobile',
        },
        src: '/images/case-study/pulso-creativo/01-tira.jpg',
      },
      {
        type: 'screen-cluster',
        slot: 'decisions',
        alt: {
          es: 'Tres pantallas mobile sobre el verde de la marca: el hero, las cards de servicios y la metodología',
          en: 'Three mobile screens on the brand green: the hero, the service cards, and the methodology',
        },
        src: '/images/case-study/pulso-creativo/02-cluster.jpg',
      },
      {
        type: 'palette',
        slot: 'decisions',
        alt: {
          es: 'Paleta extraída del logo: verde acción, verde marca, grafito, negro y blanco',
          en: 'Palette taken from the logo: action green, brand green, graphite, black, and white',
        },
        src: '/images/case-study/pulso-creativo/03-paleta.jpg',
      },
      {
        type: 'diagram',
        slot: 'delivered',
        alt: {
          es: 'Diagrama de las dos vías de contacto: WhatsApp para consultas rápidas y formulario para las detalladas',
          en: 'Diagram of the two contact paths: WhatsApp for quick questions, a form for detailed ones',
        },
        src: '/images/case-study/pulso-creativo/04-diagrama.jpg',
      },
    ],
  },
  {
    slug: 'futbol-talent-pro',
    title: 'FutbolTalent.Pro',
    tagline: {
      es: 'Plataforma mobile-first para scouting deportivo.',
      en: 'Mobile-first platform for sports scouting.',
    },
    description: {
      es: 'Diseño de experiencia e interfaz, arquitectura de información progresiva y Design System atómico para un MVP validado técnicamente.',
      en: 'UX/UI design, progressive information architecture, and atomic Design System for a technically validated MVP.',
    },
    tags: ['UX Research', 'UI Design', 'Design System', 'Figma', 'FigJam'],
    services: {
      es: ['Aplicaciones Móviles', 'Design System'],
      en: ['Mobile Apps', 'Design System'],
    },
    links: {},
    cardShape: 'wide',
    // ❌ TEXTO INVENTADO EN LA PANTALLA (confirmado). Se corrige en la tanda
    // de imagenes de este proyecto. Por el NDA, en pantalla va SOLO el logo
    // real, nunca UI del producto. Ver `.claude/rules/imagenes.md` §1.1.
    coverImage: '/images/covers/futbol-talent-pro-cover.jpg',
    year: 2025,
    showOnHome: true,
    order: 3,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'FutbolTalent.Pro',                    en: 'FutbolTalent.Pro' },
      role:     { es: 'Diseñador UX/UI',                     en: 'UX/UI Designer' },
      duration: { es: '3 meses',                             en: '3 months' },
      team:     { es: 'Equipo multidisciplinario · a cargo de UX/UI y del Design System', en: 'Cross-functional team · owning UX/UI and the Design System' },
      stack:    ['Figma', 'FigJam'],
      nda:      { es: 'Bajo confidencialidad, material no sensible', en: 'Under NDA, non-sensitive material only' },
    },
    imageBriefs: [
      {
        type: 'diagram',
        slot: 'hero',
        alt: {
          es: 'Arquitectura de información de la plataforma',
          en: 'Platform information architecture',
        },
      },
      {
        type: 'screen-cluster',
        slot: 'challenge',
        alt: {
          es: 'Wireframes de baja fidelidad',
          en: 'Low-fidelity wireframes',
        },
      },
      {
        type: 'screen-cluster',
        slot: 'decisions',
        alt: {
          es: 'Sistema de componentes UI',
          en: 'UI component system',
        },
      },
      {
        type: 'diagram',
        slot: 'delivered',
        alt: {
          es: 'Flujos de usuario y documentación de handoff',
          en: 'User flows and handoff documentation',
        },
      },
    ],
  },
  {
    slug: 'el-ritual-del-tono',
    title: 'El Ritual del Tono',
    tagline: {
      es: 'Encontrá el tono exacto de tu guitarrista favorito.',
      en: 'Find the exact tone of your favorite guitarist.',
    },
    description: {
      es: 'Aplicación full-stack para guitarristas: elegí un artista, explorá su equipamiento y descubrí cómo replicar su sonido.',
      en: 'Full-stack app for guitarists: pick an artist, explore their gear and discover how to replicate their sound.',
    },
    tags: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    services: {
      es: ['Diseño Web', 'Desarrollo de Producto'],
      en: ['Website Design', 'Product Development'],
    },
    links: {
      github:     'https://github.com/tiagocollado/el-ritual-del-tono-frontend',
      githubBack: 'https://github.com/tiagocollado/el-ritual-del-tono-backend',
      live:       'https://el-ritual-del-tono.vercel.app',
    },
    cardShape: 'wide',
    // ❌ TEXTO INVENTADO EN LA PANTALLA (confirmado: "los tonos legendarios de
    // los guionnates mas iconicos"). Queda como esta por decision de Tiago, y
    // por eso el hero NO sale de este mockup: es una composicion nueva (§3 de
    // las rules). La tanda de Ritual no cierra mientras el cover siga asi.
    coverImage: '/images/covers/el-ritual-del-tono-cover.jpg',
    year: 2025,
    showOnHome: true,
    order: 4,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'Proyecto universitario · Maimónides', en: 'University project · Maimónides' },
      role:     { es: 'Diseño UI y Desarrollo Full-stack',   en: 'UI Design & Full-stack Development' },
      duration: { es: '2 meses',                             en: '2 months' },
      team:     { es: 'Diseño y desarrollo end-to-end',      en: 'End-to-end design & development' },
      stack:    ['React', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind'],
    },
    /*
     * Cinco imagenes con el vocabulario.
     *
     * - El hero NO es el cover en otro encuadre, como en Pulso y Paseo: el
     *   cover tiene texto inventado y se queda asi por decision de Tiago, asi
     *   que el hero es una composicion plana nueva (§3 de las rules).
     * - `decisions` lleva dos seguidas: el cluster cuenta la decision_1 (el
     *   flujo real del boton) y el diagrama la decision_2 (un equipo, varios
     *   artistas).
     * - El diagrama se justifica porque el modelo de datos no aparece en
     *   ninguna pantalla, y es lo que prueba que el proyecto es full-stack.
     *   Sale de los esquemas reales del backend, no del copy.
     * - `challenge` va sin imagen.
     */
    imageBriefs: [
      {
        type: 'mockup',
        slot: 'hero',
        alt: {
          es: 'La home de El Ritual del Tono en desktop y en celular, sobre hormigón',
          en: 'The El Ritual del Tono home page on desktop and on a phone, on concrete',
        },
        src: '/images/case-study/el-ritual-del-tono/00-mockup.jpg',
      },
      {
        type: 'long-strip',
        slot: 'intro',
        // Variante de la tira: cuatro paginas DISTINTAS lado a lado, en vez
        // de la home partida en columnas. Aca el valor es que el producto
        // tiene varias pantallas (§2 de las rules).
        frame: { width: 1440, height: 810 },
        alt: {
          es: 'Cuatro pantallas de la demo, lado a lado: la home, la página de un artista con el setup de cada canción, el catálogo de equipos y la ficha de un producto en mobile',
          en: 'Four screens of the demo side by side: the home page, an artist page with the setup for each song, the gear catalog, and a product page on mobile',
        },
        src: '/images/case-study/el-ritual-del-tono/01-tira.jpg',
      },
      {
        type: 'screen-cluster',
        slot: 'decisions',
        // Sobre el cobre del logo `#C47D58` (§4.1 de las rules).
        alt: {
          es: 'Tres pantallas mobile sobre el cobre del logo: el setup de Comfortably Numb con el botón Comprar Sonido Completo, el carrito con esos tres equipos y el checkout',
          en: 'Three mobile screens on the logo copper: the Comfortably Numb setup and its one-click buy button, the cart holding those three pieces of gear, and checkout',
        },
        src: '/images/case-study/el-ritual-del-tono/02-cluster.jpg',
      },
      {
        type: 'diagram',
        slot: 'decisions',
        alt: {
          es: 'La Stratocaster de los 60 del catálogo, un solo documento, conectada a los siete artistas que la usan en once canciones',
          en: "The catalog's '60s Stratocaster, a single document, linked to the seven artists who use it across eleven songs",
        },
        src: '/images/case-study/el-ritual-del-tono/03-diagrama.jpg',
      },
      {
        type: 'palette',
        slot: 'delivered',
        alt: {
          es: 'Paleta del sitio y del logo, con el logo de la púa al lado: naranja acción, cobre, azul, negro y blanco',
          en: 'Palette from the site and the logo, shown next to the guitar-pick logo: action orange, copper, blue, black, and white',
        },
        src: '/images/case-study/el-ritual-del-tono/04-paleta.jpg',
      },
    ],
  },
  {
    slug: 'cabify-music-match',
    title: 'Cabify Music Match',
    tagline: {
      es: 'Nueva feature UX/UI para romper el hielo a través de la música.',
      en: 'New UX/UI feature to break the ice through music.',
    },
    description: {
      es: 'Diseño de una funcionalidad para Cabify que fusiona los gustos musicales del conductor y el pasajero en una playlist compartida generada en tiempo real.',
      en: 'Feature design for Cabify that merges driver and passenger music tastes into a real-time shared playlist.',
    },
    tags: ['UX Research', 'UI Design', 'Prototyping', 'Figma'],
    services: {
      es: ['Aplicaciones Móviles'],
      en: ['Mobile Apps'],
    },
    links: {},
    cardShape: 'wide',
    coverImage: null,
    year: 2023,
    showOnHome: false,
    order: 7,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'Concept · Cabify',                    en: 'Concept · Cabify' },
      role:     { es: 'Diseño UX/UI y Prototipado',          en: 'UX/UI Design & Prototyping' },
      duration: { es: '3 meses',                             en: '3 months' },
      team:     { es: 'Proyecto autoiniciado · alcance completo', en: 'Self-initiated · full scope' },
      stack:    ['Figma'],
    },
    imageBriefs: [
      {
        type: 'detail',
        slot: 'hero',
        alt: {
          es: 'Hero shot — prototipo iPhone 14 mostrando la pantalla principal de Music Match con la playlist fusionada',
          en: 'Hero shot — iPhone 14 prototype showing the main Music Match screen with the merged playlist',
        },
      },
      {
        type: 'diagram',
        slot: 'challenge',
        alt: {
          es: 'Diagrama del algoritmo de fusión: dos perfiles Spotify con géneros y artistas convergen en una playlist compartida',
          en: 'Merge algorithm diagram: two Spotify profiles with genres and artists converge into a shared playlist',
        },
      },
      {
        type: 'screen-cluster',
        slot: 'decisions',
        alt: {
          es: 'User flow del onboarding skippable de Spotify, en 3 pantallas mobile',
          en: 'Skippable Spotify onboarding user flow across 3 mobile screens',
        },
      },
      {
        type: 'screen-cluster',
        slot: 'delivered',
        alt: {
          es: 'Tres estados clave de Music Match: fusión, playlist por mood y modo silencio',
          en: 'Three key Music Match states: merge, mood playlist, and silence mode',
        },
      },
    ],
  },
  {
    slug: 'multibrand-design-system',
    title: 'Multibrand Design System',
    tagline: {
      es: 'Sistema de diseño EdTech para equipos multiculturales.',
      en: 'EdTech design system for multicultural teams.',
    },
    description: {
      es: 'Simulación laboral en No Country: construcción de un design system unificado para múltiples productos educativos, con foco en accesibilidad y UX Writing.',
      en: 'No Country work simulation: building a unified design system for multiple educational products, focused on accessibility and UX Writing.',
    },
    tags: ['Design System', 'UX Writing', 'Figma', 'FigJam', 'Accessibility'],
    services: {
      es: ['Design System'],
      en: ['Design System'],
    },
    links: {},
    cardShape: 'wide',
    coverImage: null,
    year: 2025,
    showOnHome: false,
    order: 5,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'Simulación · No Country',             en: 'Simulation · No Country' },
      role:     { es: 'Diseño UX/UI y Design System',        en: 'UX/UI Design & Design System' },
      duration: { es: '5 semanas',                           en: '5 weeks' },
      team:     { es: 'Equipo de 6 · AR / CL / CO · 100% remoto', en: 'Team of 6 · AR / CL / CO · fully remote' },
      stack:    ['Figma', 'FigJam', 'Notion'],
    },
    imageBriefs: [
      {
        type: 'palette',
        slot: 'hero',
        alt: {
          es: 'Hero shot — tablero Figma del Design System con paleta, componentes y tipografía',
          en: 'Hero shot — Figma board of the Design System with palette, components, and typography',
        },
      },
      {
        type: 'diagram',
        slot: 'challenge',
        alt: {
          es: 'Diagrama 70/30 mostrando el core invariante vs los tokens personalizables',
          en: '70/30 diagram showing the invariant core vs customizable tokens',
        },
      },
      {
        type: 'screen-cluster',
        slot: 'decisions',
        alt: {
          es: 'Misma UI aplicada con dos marcas distintas: una formal/académica y una dinámica/innovadora',
          en: 'Same UI applied with two different brands: one formal/academic, one dynamic/innovative',
        },
      },
      {
        type: 'detail',
        slot: 'delivered',
        alt: {
          es: 'Documentación del design system en Notion: guías, checklist de accesibilidad y proceso de creación de submarcas',
          en: 'Design system documentation in Notion: guides, accessibility checklist, and sub-brand creation process',
        },
      },
    ],
  },
  {
    slug: 'recuerdalo',
    title: 'Recuérdalo',
    tagline: {
      es: 'App de recordatorios diseñada para adultos mayores.',
      en: 'Reminder app designed for older adults.',
    },
    description: {
      es: 'Proyecto universitario de diseño UX inclusivo: investigación con entrevistas reales, card sorting, journey map y prototipo funcional en Figma para personas mayores de 70 años.',
      en: 'University project in inclusive UX design: research with real interviews, card sorting, journey map and functional Figma prototype for adults over 70.',
    },
    tags: ['UX Research', 'Inclusive Design', 'Figma', 'Card Sorting', 'Accessibility'],
    services: {
      es: ['Aplicaciones Móviles'],
      en: ['Mobile Apps'],
    },
    links: {},
    cardShape: 'square',
    coverImage: null,
    year: 2025,
    showOnHome: false,
    order: 6,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'Proyecto universitario · Maimónides', en: 'University project · Maimónides' },
      role:     { es: 'Investigación UX y Diseño Inclusivo', en: 'UX Research & Inclusive Design' },
      duration: { es: '3 meses',                             en: '3 months' },
      team:     { es: 'Responsable de la investigación al prototipo', en: 'Owned it from research through prototype' },
      stack:    ['Figma'],
    },
    imageBriefs: [
      {
        type: 'detail',
        slot: 'hero',
        alt: {
          es: 'Hero shot — pantalla principal de Recuérdalo con las 4 categorías emergentes del card sorting',
          en: 'Hero shot — Recuérdalo main screen with the 4 categories that emerged from card sorting',
        },
      },
      {
        type: 'diagram',
        slot: 'challenge',
        alt: {
          es: 'Card sorting documentado: 15 tarjetas de funcionalidades agrupadas por usuarios mayores en 4 categorías emocionales',
          en: 'Documented card sorting: 15 feature cards grouped by older users into 4 emotional categories',
        },
      },
      {
        type: 'screen-cluster',
        slot: 'decisions',
        alt: {
          es: 'Secuencia de pasos reversibles: indicador numérico, botón Volver grande y confirmación visual inmediata',
          en: 'Reversible steps sequence: numeric indicator, large Back button, and immediate visual confirmation',
        },
      },
      {
        type: 'screen-cluster',
        slot: 'delivered',
        alt: {
          es: 'Comparación de accesibilidad: UI estándar versus Recuérdalo con tipografía y touch targets aumentados',
          en: 'Accessibility comparison: standard UI vs Recuérdalo with enlarged typography and touch targets',
        },
      },
    ],
  },
]