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
    type: 'wordpress',
    links: {
      live: 'https://paseoguemeshotel.com.ar',
    },
    // Cover listo. De las 4 contextuales solo está 01-hero: los imageBriefs
    // sin `src` siguen mostrando el placeholder BUILDING.
    coverImage: null,
    year: 2026,
    featured: false,
    order: 2,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'Paseo Güemes Hotel · Salta',                          en: 'Paseo Güemes Hotel · Salta' },
      role:     { es: 'Diseño UX/UI e implementación web',                   en: 'UX/UI Design & web implementation' },
      duration: { es: '2 meses',                                             en: '2 months' },
      team:     { es: 'Proyecto individual · contacto directo con el dueño', en: 'Solo project · direct contact with the owner' },
      stack:    ['Figma', 'WordPress', 'Elementor', 'Rank Math', 'WPForms', 'LiteSpeed Cache'],
    },
    imageBriefs: [
      {
        alt: {
          es: 'Hero del sitio con video del Monumento a Güemes y el CTA de reserva',
          en: 'Site hero with video of the Güemes Monument and the booking CTA',
        },
      },
      {
        alt: {
          es: 'Wireframes de desktop y mobile en Figma',
          en: 'Desktop and mobile wireframes in Figma',
        },
      },
      {
        alt: {
          es: 'Sistema visual aplicado: paleta, tipografías y versiones del logo',
          en: 'Applied visual system: palette, typefaces, and logo versions',
        },
      },
      {
        alt: {
          es: 'Sitio en mobile: habitaciones, reserva directa y WhatsApp flotante',
          en: 'Site on mobile: rooms, direct booking, and floating WhatsApp',
        },
      },
    ],
  },
  {
    slug: 'pulso-creativo',
    title: 'Pulso Creativo',
    tagline: {
      es: 'Plataforma institucional para una consultora B2B con más de 25 años de trayectoria.',
      en: 'Institutional platform for a B2B consultancy with over 25 years of track record.',
    },
    description: {
      es: 'Sitio institucional con foco en autoridad corporativa: rediseño UX del contenido, contacto dual y captación de leads con contexto.',
      en: 'Institutional site focused on corporate authority: UX rewrite of the content, dual contact flow, and lead capture with context.',
    },
    tags: ['WordPress', 'Elementor', 'UX Writing', 'UI Design', 'B2B'],
    type: 'wordpress',
    links: {
      live: 'https://pulsocreativo.com.ar',
    },
    coverImage: null,
    year: 2026,
    featured: true,
    order: 1,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'Pulso Creativo',                                            en: 'Pulso Creativo' },
      role:     { es: 'Diseño UX/UI y Desarrollo Frontend · Freelance',            en: 'UX/UI Design & Frontend Development · Freelance' },
      duration: { es: '3 meses',                                                   en: '3 months' },
      team:     { es: 'Trabajo individual · contacto directo con las consultoras', en: 'Solo project · direct contact with the consultants' },
      stack:    ['WordPress', 'Elementor', 'WPForms', 'Joinchat', 'LiteSpeed Cache'],
    },
    imageBriefs: [
      {
        alt: {
          es: 'Home del sitio institucional en desktop',
          en: 'Institutional site home on desktop',
        },
      },
      {
        alt: {
          es: 'Carrusel de marcas con comportamiento táctil',
          en: 'Client logo carousel with touch behavior',
        },
      },
      {
        alt: {
          es: 'Casos de éxito en formato de viñetas con íconos',
          en: 'Success cases in a bulleted format with icons',
        },
      },
      {
        alt: {
          es: 'Sistema de contacto dual: formulario y WhatsApp ruteado por servicio',
          en: 'Dual contact system: form and WhatsApp routed by service',
        },
      },
    ],
  },
  {
    slug: 'futbol-talent-pro',
    title: 'FutbolTalentPro',
    tagline: {
      es: 'Plataforma mobile-first para scouting deportivo.',
      en: 'Mobile-first platform for sports scouting.',
    },
    description: {
      es: 'Diseño de experiencia e interfaz, arquitectura de información progresiva y Design System atómico para un MVP validado técnicamente.',
      en: 'UX/UI design, progressive information architecture, and atomic Design System for a technically validated MVP.',
    },
    tags: ['UX Research', 'UI Design', 'Design System', 'Figma', 'FigJam'],
    type: 'ux',
    links: {
      figma: undefined,
    },
    coverImage: null,
    year: 2025,
    featured: false,
    order: 3,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'FutbolTalent.Pro',                    en: 'FutbolTalent.Pro' },
      role:     { es: 'Diseñador UX/UI',                     en: 'UX/UI Designer' },
      duration: { es: '3 meses',                             en: '3 months' },
      team:     { es: 'Equipo multidisciplinario · Diseño UX/UI y Desarrollo Frontend', en: 'Cross-functional team · UX/UI Design & Frontend Development' },
      stack:    ['Figma', 'FigJam', 'Design System', 'UX Research'],
      nda:      { es: 'Bajo confidencialidad, material no sensible', en: 'Under NDA, non-sensitive material only' },
    },
    imageBriefs: [
      {
        alt: {
          es: 'Pantalla de plataforma móvil',
          en: 'Mobile platform screen',
        },
      },
      {
        alt: {
          es: 'Wireframes de baja fidelidad',
          en: 'Low-fidelity wireframes',
        },
      },
      {
        alt: {
          es: 'Sistema de componentes UI',
          en: 'UI component system',
        },
      },
      {
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
      es: 'Encontrá el tono exacto de tu artista favorito.',
      en: 'Find the exact tone of your favorite guitarist.',
    },
    description: {
      es: 'Aplicación full-stack para guitarristas: buscá artistas, explorá su equipamiento y descubrí cómo replicar su sonido.',
      en: 'Full-stack app for guitarists: search artists, explore their gear and discover how to replicate their sound.',
    },
    tags: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    type: 'fullstack',
    links: {
      github:     'https://github.com/tiagocollado/el-ritual-del-tono-frontend',
      githubBack: 'https://github.com/tiagocollado/el-ritual-del-tono-backend',
      live:       'https://el-ritual-del-tono.vercel.app',
    },
    coverImage: null,
    year: 2025,
    featured: true,
    order: 4,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'Proyecto personal',                   en: 'Personal project' },
      role:     { es: 'Full-stack Developer',                en: 'Full-stack Developer' },
      duration: { es: '2 meses',                             en: '2 months' },
      team:     { es: 'Diseño y desarrollo end-to-end',      en: 'End-to-end design & development' },
      stack:    ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind'],
    },
    imageBriefs: [
      {
        alt: {
          es: 'Hero shot — página principal de El Ritual del Tono mostrando un artista y su cadena de señal',
          en: 'Hero shot — El Ritual del Tono main page showing an artist and their signal chain',
        },
      },
      {
        alt: {
          es: 'Esquema de las 3 colecciones MongoDB del proyecto: Artists con Songs como subdocumentos, Gears reutilizables y Orders',
          en: 'MongoDB schema diagram with 3 collections: Artists with Songs subdocuments, reusable Gears, and Orders',
        },
      },
      {
        alt: {
          es: 'Página de canción mostrando la cadena de señal: guitarra, pedales y amplificador en orden',
          en: 'Song page showing the signal chain: guitar, pedals, and amp in order',
        },
      },
      {
        alt: {
          es: 'Carrito y checkout simulado mostrando el setup completo de un tono',
          en: 'Cart and simulated checkout showing the complete tone setup',
        },
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
    type: 'ux',
    links: {},
    coverImage: null,
    year: 2023,
    featured: false,
    order: 7,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'Concept · Cabify',                    en: 'Concept · Cabify' },
      role:     { es: 'UX/UI Designer',                      en: 'UX/UI Designer' },
      duration: { es: '3 meses',                             en: '3 months' },
      team:     { es: 'Trabajo individual',                  en: 'Individual work' },
      stack:    ['Figma', 'UX Research', 'Prototyping', 'Spotify API (concept)'],
    },
    imageBriefs: [
      {
        alt: {
          es: 'Hero shot — prototipo iPhone 14 mostrando la pantalla principal de Music Match con la playlist fusionada',
          en: 'Hero shot — iPhone 14 prototype showing the main Music Match screen with the merged playlist',
        },
      },
      {
        alt: {
          es: 'Diagrama del algoritmo de fusión: dos perfiles Spotify con géneros y artistas convergen en una playlist compartida',
          en: 'Merge algorithm diagram: two Spotify profiles with genres and artists converge into a shared playlist',
        },
      },
      {
        alt: {
          es: 'User flow del onboarding skippable de Spotify, en 3 pantallas mobile',
          en: 'Skippable Spotify onboarding user flow across 3 mobile screens',
        },
      },
      {
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
    type: 'ux',
    links: {
      figma: undefined,
    },
    coverImage: null,
    year: 2025,
    featured: false,
    order: 5,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'Simulación · No Country',             en: 'Simulation · No Country' },
      role:     { es: 'UX/UI Designer',                      en: 'UX/UI Designer' },
      duration: { es: '5 semanas',                           en: '5 weeks' },
      team:     { es: '6 personas · AR / CL / CO · 100% remoto', en: '6 people · AR / CL / CO · 100% remote' },
      stack:    ['Figma', 'FigJam', 'Notion', 'Design Tokens', 'UX Writing'],
    },
    imageBriefs: [
      {
        alt: {
          es: 'Hero shot — tablero Figma del Design System con paleta, componentes y tipografía',
          en: 'Hero shot — Figma board of the Design System with palette, components, and typography',
        },
      },
      {
        alt: {
          es: 'Diagrama 70/30 mostrando el core invariante vs los tokens personalizables',
          en: '70/30 diagram showing the invariant core vs customizable tokens',
        },
      },
      {
        alt: {
          es: 'Misma UI aplicada con dos marcas distintas: una formal/académica y una dinámica/innovadora',
          en: 'Same UI applied with two different brands: one formal/academic, one dynamic/innovative',
        },
      },
      {
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
    type: 'ux',
    links: {
      figma: undefined,
    },
    coverImage: null,
    year: 2025,
    featured: false,
    order: 6,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'Proyecto universitario · Maimónides', en: 'University project · Maimónides' },
      role:     { es: 'UX/UI Designer',                      en: 'UX/UI Designer' },
      duration: { es: '3 meses',                             en: '3 months' },
      team:     { es: 'Trabajo individual',                  en: 'Individual work' },
      stack:    ['Figma', 'UX Research', 'Card Sorting', 'Inclusive Design', 'Accessibility AA'],
    },
    imageBriefs: [
      {
        alt: {
          es: 'Hero shot — pantalla principal de Recuérdalo con las 4 categorías emergentes del card sorting',
          en: 'Hero shot — Recuérdalo main screen with the 4 categories that emerged from card sorting',
        },
      },
      {
        alt: {
          es: 'Card sorting documentado: 15 tarjetas de funcionalidades agrupadas por usuarios mayores en 4 categorías emocionales',
          en: 'Documented card sorting: 15 feature cards grouped by older users into 4 emotional categories',
        },
      },
      {
        alt: {
          es: 'Secuencia de pasos reversibles: indicador numérico, botón Volver grande y confirmación visual inmediata',
          en: 'Reversible steps sequence: numeric indicator, large Back button, and immediate visual confirmation',
        },
      },
      {
        alt: {
          es: 'Comparación de accesibilidad: UI estándar versus Recuérdalo con tipografía y touch targets aumentados',
          en: 'Accessibility comparison: standard UI vs Recuérdalo with enlarged typography and touch targets',
        },
      },
    ],
  },
]