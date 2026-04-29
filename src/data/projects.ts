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
      es: 'Diseño end-to-end de una startup de movilidad deportiva: research, wireframes, design system y 40 pantallas en alta fidelidad para tres perfiles de usuario distintos.',
      en: 'End-to-end design for a sports mobility startup: research, wireframes, design system and 40 high-fidelity screens for three distinct user profiles.',
    },
    tags: ['UX Research', 'UI Design', 'Design System', 'Figma', 'FigJam'],
    type: 'ux',
    links: {
      figma: undefined,
    },
    coverImage: '/images/projects/futboltalentpro-cover.jpg',
    gallery: ['/images/gallery/futbol-talent-pro/1.jpg'],
    year: 2025,
    featured: true,
    order: 1,
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
    coverImage: '/images/projects/el-ritual-del-tono-cover.jpg',
    gallery: ['/images/gallery/el-ritual-del-tono/1.jpg'],
    year: 2025,
    featured: false,
    order: 2,
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
    links: {
      behance: 'https://www.behance.net/gallery/192360257/Cabify-Music-Match-New-Feature-UXUI',
    },
    coverImage: '/images/projects/cabify-music-match-cover.jpg',
    gallery: ['/images/gallery/cabify-music-match/1.jpg'],
    year: 2023,
    featured: false,
    order: 3,
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
    coverImage: '/images/projects/multibrand-cover.jpg',
    gallery: ['/images/gallery/multibrand-design-system/1.jpg'],
    year: 2025,
    featured: false,
    order: 4,
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
    coverImage: '/images/projects/recuerdalo-cover.jpg',
    gallery: ['/images/gallery/recuerdalo/1.jpg'],
    year: 2025,
    featured: false,
    order: 5,
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