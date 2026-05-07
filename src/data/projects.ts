import { Project } from '@/types'

export const projects: Project[] = [
  {
    slug: 'futbol-talent-pro',
    title: 'FutbolTalentPro',
    tagline: {
      es: 'Plataforma UX/UI para conectar jugadores jóvenes con scouts y clubes.',
      en: 'UX/UI platform connecting young players with scouts and clubs.',
    },
    description: {
      es: 'Diseño end-to-end de una startup de movilidad deportiva: research, wireframes, design system y +30 pantallas en alta fidelidad para tres perfiles de usuario distintos.',
      en: 'End-to-end design for a sports mobility startup: research, wireframes, design system and 30+ high-fidelity screens for three distinct user profiles.',
    },
    tags: ['UX Research', 'UI Design', 'Design System', 'Figma', 'FigJam'],
    type: 'ux',
    links: {
      figma: undefined,
    },
    coverImage: '/images/covers/futboltalentpro-cover.jpg',
    gallery: ['/images/case-study/futbol-talent-pro/1.jpg'],
    year: 2025,
    featured: true,
    order: 1,
    awwwardsLayout: true,
    metadata: {
      client:   { es: 'FutbolTalent.Pro',                    en: 'FutbolTalent.Pro' },
      role:     { es: 'Diseñador UX/UI',                     en: 'UX/UI Designer' },
      duration: { es: '3 meses',                             en: '3 months' },
      team:     { es: 'Trabajo en equipo · 1 dev Flutter + 2 leads', en: 'Team setup · 1 Flutter dev + 2 leads' },
      stack:    ['Figma', 'FigJam', 'Design System', 'UX Research'],
      nda:      { es: 'Bajo confidencialidad, material no sensible', en: 'Under NDA, non-sensitive material only' },
    },
    imageBriefs: [
      {
        alt: {
          es: 'Hero shot — pantalla principal de FutbolTalentPro mostrando explorador de jugadores',
          en: 'Hero shot — main FutbolTalentPro screen showing player explorer',
        },
        src: '/images/case-study/futbol-talent-pro/01-hero.jpg',
      },
      {
        alt: {
          es: 'Wireframes lo-fi mostrando el flujo de freemium vs premium',
          en: 'Lo-fi wireframes showing freemium vs premium flow',
        },
        src: '/images/case-study/futbol-talent-pro/02-challenge.jpg',
      },
      {
        alt: {
          es: 'Design system de FutbolTalentPro: tokens, componentes, light/dark',
          en: 'FutbolTalentPro design system: tokens, components, light/dark',
        },
        src: '/images/case-study/futbol-talent-pro/03-decisions.jpg',
      },
      {
        alt: {
          es: 'User personas y flujos del MVP — material no NDA',
          en: 'User personas and MVP flows — non-NDA material',
        },
        src: '/images/case-study/futbol-talent-pro/04-delivered.jpg',
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
    coverImage: '/images/covers/el-ritual-del-tono-cover.jpg',
    gallery: ['/images/case-study/el-ritual-del-tono/1.jpg'],
    year: 2025,
    featured: false,
    order: 2,
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
        src: '/images/case-study/el-ritual-del-tono/01-hero.jpg',
      },
      {
        alt: {
          es: 'Esquema de las 3 colecciones MongoDB del proyecto: Artists con Songs como subdocumentos, Gears reutilizables y Orders',
          en: 'MongoDB schema diagram with 3 collections: Artists with Songs subdocuments, reusable Gears, and Orders',
        },
        src: '/images/case-study/el-ritual-del-tono/02-challenge.jpg',
      },
      {
        alt: {
          es: 'Página de canción mostrando la cadena de señal: guitarra, pedales y amplificador en orden',
          en: 'Song page showing the signal chain: guitar, pedals, and amp in order',
        },
        src: '/images/case-study/el-ritual-del-tono/03-decisions.jpg',
      },
      {
        alt: {
          es: 'Carrito y checkout simulado mostrando el setup completo de un tono',
          en: 'Cart and simulated checkout showing the complete tone setup',
        },
        src: '/images/case-study/el-ritual-del-tono/04-delivered.jpg',
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
    coverImage: '/images/covers/cabify-music-match-cover.jpg',
    gallery: ['/images/case-study/cabify-music-match/1.jpg'],
    year: 2023,
    featured: false,
    order: 3,
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
        src: '/images/case-study/cabify-music-match/01-hero.jpg',
      },
      {
        alt: {
          es: 'Diagrama del algoritmo de fusión: dos perfiles Spotify con géneros y artistas convergen en una playlist compartida',
          en: 'Merge algorithm diagram: two Spotify profiles with genres and artists converge into a shared playlist',
        },
        src: '/images/case-study/cabify-music-match/02-challenge.jpg',
      },
      {
        alt: {
          es: 'User flow del onboarding skippable de Spotify, en 3 pantallas mobile',
          en: 'Skippable Spotify onboarding user flow across 3 mobile screens',
        },
        src: '/images/case-study/cabify-music-match/03-decisions.jpg',
      },
      {
        alt: {
          es: 'Tres estados clave de Music Match: fusión, playlist por mood y modo silencio',
          en: 'Three key Music Match states: merge, mood playlist, and silence mode',
        },
        src: '/images/case-study/cabify-music-match/04-delivered.jpg',
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
    coverImage: '/images/covers/multibrand-cover.jpg',
    gallery: ['/images/case-study/multibrand-design-system/1.jpg'],
    year: 2025,
    featured: false,
    order: 4,
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
        src: '/images/case-study/multibrand-design-system/01-hero.jpg',
      },
      {
        alt: {
          es: 'Diagrama 70/30 mostrando el core invariante vs los tokens personalizables',
          en: '70/30 diagram showing the invariant core vs customizable tokens',
        },
        src: '/images/case-study/multibrand-design-system/02-challenge.jpg',
      },
      {
        alt: {
          es: 'Misma UI aplicada con dos marcas distintas: una formal/académica y una dinámica/innovadora',
          en: 'Same UI applied with two different brands: one formal/academic, one dynamic/innovative',
        },
        src: '/images/case-study/multibrand-design-system/03-decisions.jpg',
      },
      {
        alt: {
          es: 'Documentación del design system en Notion: guías, checklist de accesibilidad y proceso de creación de submarcas',
          en: 'Design system documentation in Notion: guides, accessibility checklist, and sub-brand creation process',
        },
        src: '/images/case-study/multibrand-design-system/04-delivered.jpg',
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
    coverImage: '/images/covers/recuerdalo-cover.jpg',
    gallery: ['/images/case-study/recuerdalo/1.jpg'],
    year: 2025,
    featured: false,
    order: 5,
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
        src: '/images/case-study/recuerdalo/01-hero.jpg',
      },
      {
        alt: {
          es: 'Card sorting documentado: 15 tarjetas de funcionalidades agrupadas por usuarios mayores en 4 categorías emocionales',
          en: 'Documented card sorting: 15 feature cards grouped by older users into 4 emotional categories',
        },
        src: '/images/case-study/recuerdalo/02-challenge.jpg',
      },
      {
        alt: {
          es: 'Secuencia de pasos reversibles: indicador numérico, botón Volver grande y confirmación visual inmediata',
          en: 'Reversible steps sequence: numeric indicator, large Back button, and immediate visual confirmation',
        },
        src: '/images/case-study/recuerdalo/03-decisions.jpg',
      },
      {
        alt: {
          es: 'Comparación de accesibilidad: UI estándar versus Recuérdalo con tipografía y touch targets aumentados',
          en: 'Accessibility comparison: standard UI vs Recuérdalo with enlarged typography and touch targets',
        },
        src: '/images/case-study/recuerdalo/04-delivered.jpg',
      },
    ],
  },
  {
    slug: 'retro-kicks',
    title: 'Retro Kicks',
    tagline: {
      es: 'Tienda de sneakers retro — en construcción.',
      en: 'Retro sneaker store — coming soon.',
    },
    description: {
      es: 'E-commerce colaborativo de sneakers retro con stack full-stack. Actualmente en proceso de resolución de integración con MongoDB Atlas.',
      en: 'Collaborative retro sneaker e-commerce with full-stack architecture. Currently resolving MongoDB Atlas integration.',
    },
    tags: ['Next.js', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    type: 'coming-soon',
    links: {
      github: 'https://github.com/tiagocollado',
    },
    coverImage: null,
    year: 2025,
    featured: false,
    order: 6,
    comingSoon: true,
  },
]