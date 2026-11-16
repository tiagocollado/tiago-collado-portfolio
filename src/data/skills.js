/*
 * Skills de la sección del home, en el orden en que se muestran.
 *
 * - name: igual en los dos idiomas, como el title de los proyectos.
 * - activities: qué hago dentro de esa skill, en los dos idiomas.
 * - caseSlugs: los casos donde se ve. Los títulos salen de projects.js; si
 *   un slug no es de un proyecto publicado, el build se corta (Skills.astro).
 */
export const skills = [
  {
    name: 'UX Design',
    activities: {
      es: [
        'Entrevistas y observación con usuarios',
        'Card sorting y encuestas',
        'Personas y user flows',
        'Wireframes y prototipos navegables',
      ],
      en: [
        'User interviews and observation',
        'Card sorting and surveys',
        'Personas and user flows',
        'Wireframes and clickable prototypes',
      ],
    },
    caseSlugs: ['recuerdalo', 'mimascota', 'cabify-playlist-del-viaje'],
  },
  {
    name: 'UI Design',
    activities: {
      es: [
        'UI kits en Atomic Design',
        'Variables, estilos de texto y guías de estilo',
        'Accesibilidad: contraste, tamaño de texto y áreas táctiles',
        'Alta fidelidad',
      ],
      en: [
        'UI kits built with Atomic Design',
        'Variables, text styles and style guides',
        'Accessibility: contrast, text size and touch targets',
        'High-fidelity design',
      ],
    },
    caseSlugs: ['recuerdalo', 'cabify-playlist-del-viaje', 'mimascota', 'paseo-guemes-hotel'],
  },
  {
    name: 'Product Thinking',
    activities: {
      es: [
        'Benchmark para definir el problema',
        'Recorte de alcance y MVP',
        'Análisis de mercado y posicionamiento',
        'Prioridades según el objetivo del negocio',
      ],
      en: [
        'Benchmarking to define the problem',
        'Scope cuts and MVP',
        'Market analysis and positioning',
        'Priorities set by business goals',
      ],
    },
    caseSlugs: ['el-ritual-del-tono', 'paseo-guemes-hotel', 'cabify-playlist-del-viaje'],
  },
  {
    name: 'Frontend Development',
    activities: {
      es: [
        'Componentes y estado en React',
        'API REST y base de datos',
        'Este sitio, en Astro',
        'Implementación y publicación en WordPress',
      ],
      en: [
        'React components and state',
        'REST APIs and databases',
        'This site, built with Astro',
        'WordPress implementation and launch',
      ],
    },
    caseSlugs: ['el-ritual-del-tono', 'pulso-creativo', 'paseo-guemes-hotel'],
  },
];
