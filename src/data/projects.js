import paseoCover from '../assets/covers/paseo-guemes-hotel-cover.jpg';
import paseoMockup from '../assets/case-study/paseo-guemes-hotel/00-mockup.jpg';
import paseoStrip from '../assets/case-study/paseo-guemes-hotel/01-tira.jpg';
import paseoCluster from '../assets/case-study/paseo-guemes-hotel/02-cluster.jpg';
import paseoPalette from '../assets/case-study/paseo-guemes-hotel/03-paleta.jpg';

import pulsoCover from '../assets/covers/pulso-creativo-cover.jpg';
import pulsoMockup from '../assets/case-study/pulso-creativo/00-mockup.jpg';
import pulsoStrip from '../assets/case-study/pulso-creativo/01-tira.jpg';
import pulsoCluster from '../assets/case-study/pulso-creativo/02-cluster.jpg';
import pulsoPalette from '../assets/case-study/pulso-creativo/03-paleta.jpg';
import pulsoDetail from '../assets/case-study/pulso-creativo/04-detalle.jpg';

import ritualCover from '../assets/covers/el-ritual-del-tono-cover.jpg';
import ritualMockup from '../assets/case-study/el-ritual-del-tono/00-mockup.jpg';
import ritualStrip from '../assets/case-study/el-ritual-del-tono/01-tira.jpg';
import ritualCluster from '../assets/case-study/el-ritual-del-tono/02-cluster.jpg';
import ritualDiagram from '../assets/case-study/el-ritual-del-tono/03-diagrama.jpg';
import ritualPalette from '../assets/case-study/el-ritual-del-tono/04-paleta.jpg';

import cabifyCover from '../assets/covers/cabify-playlist-del-viaje-cover.jpg';
import cabifyMockup from '../assets/case-study/cabify-playlist-del-viaje/00-mockup.jpg';
import cabifyStrip from '../assets/case-study/cabify-playlist-del-viaje/01-tira.jpg';
import cabifyClusterA from '../assets/case-study/cabify-playlist-del-viaje/02-cluster-a.jpg';
import cabifyDiagram from '../assets/case-study/cabify-playlist-del-viaje/03-diagrama.jpg';
import cabifyClusterB from '../assets/case-study/cabify-playlist-del-viaje/04-cluster-b.jpg';
import cabifyPalette from '../assets/case-study/cabify-playlist-del-viaje/05-paleta.jpg';

/*
 * Campos que no se explican solos:
 * - services: categorías del trabajo, nunca roles ("Diseño Web", no "Diseño UX/UI"). Máximo 2.
 * - cardShape: forma de la card en la grilla del home: 'wide' (4:3) o 'square' (1:1).
 * - published: si la página del proyecto existe. Con false no se genera ni aparece en ningún lado.
 * - showOnHome: si, además de existir, aparece en la grilla del home.
 * - order: orden del home y del ciclo de "Próximo proyecto".
 * - imageBriefs: imágenes del caso. type decide ancho y recorte (imageSpec.js); slot, dónde cae.
 * - frame: proporción real del archivo, solo en los tipos sin recorte (mockup y long-strip).
 */
export const projects = [
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
    services: {
      es: ['Diseño Web', 'Dirección de Arte'],
      en: ['Website Design', 'Art Direction'],
    },
    links: {
      live: 'https://paseoguemeshotel.com.ar',
    },
    cardShape: 'wide',
    coverImage: paseoCover,
    year: 2026,
    published: true,
    showOnHome: true,
    order: 2,
    metadata: {
      client:   { es: 'Paseo Güemes Hotel · Salta',                                en: 'Paseo Güemes Hotel · Salta' },
      role:     { es: 'Dirección de arte, diseño UX/UI e implementación en WordPress', en: 'Art direction, UX/UI design & WordPress implementation' },
      duration: { es: '2 meses',                                                   en: '2 months' },
      team:     { es: 'Diseño y ejecución end-to-end · trato directo con el cliente', en: 'End-to-end design & delivery · direct client relationship' },
      stack:    ['Figma', 'WordPress'],
    },
    imageBriefs: [
      {
        type: 'mockup',
        slot: 'hero',
        alt: {
          es: 'Laptop y celular sobre hormigón con la home de Paseo Güemes Hotel en pantalla',
          en: 'Laptop and phone on concrete showing the Paseo Güemes Hotel home page',
        },
        src: paseoMockup,
      },
      {
        type: 'long-strip',
        slot: 'intro',
        frame: { width: 1440, height: 810 },
        alt: {
          es: 'La home completa, de punta a punta, en desktop y en mobile, partida en columnas',
          en: 'The full home page, top to bottom, on desktop and mobile, split into columns',
        },
        src: paseoStrip,
      },
      {
        type: 'screen-cluster',
        slot: 'decisions',
        alt: {
          es: 'Tres pantallas mobile sobre el marrón de la marca: la home, Beneficios locales y la página de ubicación',
          en: 'Three mobile screens on the brand brown: the home page, Local Benefits, and the location page',
        },
        src: paseoCluster,
      },
      {
        type: 'palette',
        slot: 'delivered',
        alt: {
          es: 'Paleta extraída del logo, con el logo al lado: marrón marca, marrón claro, crema, negro y blanco',
          en: 'Palette taken from the logo, shown next to it: brand brown, light brown, cream, black, and white',
        },
        src: paseoPalette,
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
    services: {
      es: ['Diseño Web'],
      en: ['Website Design'],
    },
    links: {
      live: 'https://pulsocreativo.com.ar',
    },
    cardShape: 'wide',
    coverImage: pulsoCover,
    year: 2026,
    published: true,
    showOnHome: true,
    order: 3,
    metadata: {
      client:   { es: 'Pulso Creativo',                                              en: 'Pulso Creativo' },
      role:     { es: 'Diseño UX/UI e implementación en WordPress',                  en: 'UX/UI design & WordPress implementation' },
      duration: { es: '3 meses',                                                     en: '3 months' },
      team:     { es: 'Diseño y ejecución end-to-end · trato directo con el cliente', en: 'End-to-end design & delivery · direct client relationship' },
      stack:    ['Figma', 'WordPress'],
    },
    imageBriefs: [
      {
        type: 'mockup',
        slot: 'hero',
        alt: {
          es: 'Laptop sobre hormigón con la home de Pulso Creativo en pantalla',
          en: 'Laptop on concrete showing the Pulso Creativo home page',
        },
        src: pulsoMockup,
      },
      {
        type: 'long-strip',
        slot: 'intro',
        frame: { width: 1440, height: 810 },
        alt: {
          es: 'La home completa, de punta a punta, en desktop y en mobile',
          en: 'The full home page, top to bottom, on desktop and mobile',
        },
        src: pulsoStrip,
      },
      {
        type: 'screen-cluster',
        slot: 'decisions',
        alt: {
          es: 'Tres pantallas mobile sobre el verde de la marca: el hero, las cards de servicios y la metodología',
          en: 'Three mobile screens on the brand green: the hero, the service cards, and the methodology',
        },
        src: pulsoCluster,
      },
      {
        type: 'palette',
        slot: 'decisions',
        alt: {
          es: 'Paleta extraída del logo: verde acción, verde marca, grafito, negro y blanco',
          en: 'Palette taken from the logo: action green, brand green, graphite, black, and white',
        },
        src: pulsoPalette,
      },
      {
        type: 'detail',
        slot: 'delivered',
        alt: {
          es: 'La página de contacto de Pulso Creativo en un celular: el formulario y el botón de WhatsApp en la misma pantalla',
          en: 'The Pulso Creativo contact page on a phone: the form and the WhatsApp button on the same screen',
        },
        src: pulsoDetail,
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
    coverImage: ritualCover,
    year: 2025,
    published: true,
    showOnHome: true,
    order: 4,
    metadata: {
      client:   { es: 'Proyecto universitario · Maimónides', en: 'University project · Maimónides' },
      role:     { es: 'Diseño UI y Desarrollo Full-stack',   en: 'UI Design & Full-stack Development' },
      duration: { es: '2 meses',                             en: '2 months' },
      team:     { es: 'Diseño y desarrollo end-to-end',      en: 'End-to-end design & development' },
      stack:    ['React', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind'],
    },
    imageBriefs: [
      {
        type: 'mockup',
        slot: 'hero',
        alt: {
          es: 'La home de El Ritual del Tono en desktop y en celular, sobre hormigón',
          en: 'The El Ritual del Tono home page on desktop and on a phone, on concrete',
        },
        src: ritualMockup,
      },
      {
        type: 'long-strip',
        slot: 'intro',
        frame: { width: 1440, height: 810 },
        alt: {
          es: 'Cuatro pantallas de la demo, lado a lado: la home, la página de un artista con el setup de cada canción, el catálogo de equipos y la ficha de un producto en mobile',
          en: 'Four screens of the demo side by side: the home page, an artist page with the setup for each song, the gear catalog, and a product page on mobile',
        },
        src: ritualStrip,
      },
      {
        type: 'screen-cluster',
        slot: 'decisions',
        alt: {
          es: 'Tres pantallas mobile sobre el cobre del logo: el setup de Comfortably Numb con el botón Comprar Sonido Completo, el carrito con esos tres equipos y el checkout',
          en: 'Three mobile screens on the logo copper: the Comfortably Numb setup and its one-click buy button, the cart holding those three pieces of gear, and checkout',
        },
        src: ritualCluster,
      },
      {
        type: 'diagram',
        slot: 'decisions',
        alt: {
          es: 'La Stratocaster de los 60 del catálogo, un solo documento, conectada a los siete artistas que la usan en once canciones',
          en: "The catalog's '60s Stratocaster, a single document, linked to the seven artists who use it across eleven songs",
        },
        src: ritualDiagram,
      },
      {
        type: 'palette',
        slot: 'delivered',
        alt: {
          es: 'Paleta del sitio y del logo, con el logo de la púa al lado: naranja acción, cobre, azul, negro y blanco',
          en: 'Palette from the site and the logo, shown next to the guitar-pick logo: action orange, copper, blue, black, and white',
        },
        src: ritualPalette,
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
    services: {
      es: ['Design System'],
      en: ['Design System'],
    },
    links: {},
    cardShape: 'wide',
    coverImage: null,
    year: 2025,
    published: false,
    showOnHome: false,
    order: 5,
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
    services: {
      es: ['Aplicaciones Móviles'],
      en: ['Mobile Apps'],
    },
    links: {},
    cardShape: 'square',
    coverImage: null,
    year: 2025,
    published: false,
    showOnHome: false,
    order: 6,
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
  {
    slug: 'cabify-playlist-del-viaje',
    title: 'Cabify · Playlist del viaje',
    tagline: {
      es: 'Propuesta de rediseño para llevar la música del pasajero a los viajes de Cabify, mezclada con los gustos del conductor.',
      en: "Redesign proposal that brings the passenger's music into Cabify rides, mixed with the driver's taste.",
    },
    description: {
      es: 'Propuesta de rediseño que lleva la música del pasajero a los viajes de Cabify.',
      en: "Redesign proposal that brings the passenger's music into Cabify rides.",
    },
    services: {
      es: ['Aplicaciones Móviles', 'Design System'],
      en: ['Mobile Apps', 'Design System'],
    },
    links: {
      prototype: 'https://www.figma.com/proto/lau81Ek16dCN8fJmtncGeK/-2023--Cabify---Playlist-del-viaje?node-id=986-269&p=f&scaling=scale-down&content-scaling=fixed&starting-point-node-id=986%3A269&show-proto-sidebar=1&page-id=127%3A18',
    },
    cardShape: 'square',
    coverImage: cabifyCover,
    year: 2023,
    published: true,
    showOnHome: true,
    order: 1,
    metadata: {
      client:   { es: 'Propuesta de rediseño · Cabify',                      en: 'Redesign proposal · Cabify' },
      role:     { es: 'Diseño UX/UI',                                        en: 'UX/UI design' },
      team:     { es: 'Diseño end-to-end en Figma · del brief al prototipo', en: 'End-to-end design in Figma · from brief to prototype' },
      stack:    ['Figma'],
    },
    imageBriefs: [
      {
        type: 'mockup',
        slot: 'hero',
        alt: {
          es: 'Cinco pantallas mobile sobre hormigón con luz de ventana: Mis preferencias, Tus gustos musicales, la canción que está sonando, Playlists y la invitación a la jam',
          en: 'Five mobile screens on concrete with window light: My preferences, Your music taste, the song now playing, Playlists, and the jam invite',
        },
        src: cabifyMockup,
      },
      {
        type: 'long-strip',
        slot: 'intro',
        frame: { width: 1440, height: 810 },
        alt: {
          es: 'Tres bocetos en papel de las pantallas y el user flow original sobre hormigón oscuro',
          en: 'Three paper sketches of the screens and the original user flow on dark concrete',
        },
        src: cabifyStrip,
      },
      {
        type: 'screen-cluster',
        slot: 'challenge',
        alt: {
          es: 'La pantalla Mis preferencias de Cabify con el panel de la radio abierto, y ampliadas la fila Música en No y el campo para indicar la frecuencia de la emisora',
          en: "Cabify's My preferences screen with the radio panel open, and enlarged, the Music row set to No and the field for entering the station frequency",
        },
        src: cabifyClusterA,
      },
      {
        type: 'diagram',
        slot: 'decisions',
        alt: {
          es: 'Las quince pantallas en dos filas sobre hormigón oscuro, arriba el recorrido para configurar la música y abajo el del viaje',
          en: 'The fifteen screens in two rows on dark concrete, with the music setup flow on top and the ride flow below',
        },
        src: cabifyDiagram,
      },
      {
        type: 'screen-cluster',
        slot: 'decisions',
        alt: {
          es: 'Tres pantallas mobile sobre hormigón oscuro: el panel para elegir de dónde sale la música, Tus gustos musicales con Guardar deshabilitado y el error de conexión con Spotify',
          en: 'Three mobile screens on dark concrete: the panel to choose where the music comes from, Your music taste with Save disabled, and the Spotify connection error',
        },
        src: cabifyClusterB,
      },
      {
        type: 'palette',
        slot: 'delivered',
        alt: {
          es: 'El UI Kit sobre hormigón oscuro, con átomos, una fila de preferencia, el panel que la contiene y la pantalla con la grilla de cuatro columnas, y abajo los colores y la tipografía',
          en: 'The UI Kit on dark concrete, with atoms, a preference row, the panel that holds it, and the screen with the four-column grid, plus the colors and typography below',
        },
        src: cabifyPalette,
      },
    ],
  },
];

// Lo que se ve en el sitio lee de esta lista, no de `projects`: así un proyecto sin publicar no se cuela.
export const publishedProjects = projects
  .filter((project) => project.published)
  .sort((a, b) => a.order - b.order);
