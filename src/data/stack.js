// Solo herramientas, en el orden en que se muestran; los conceptos están en
// skills.js. El ícono de cada una sale de ToolIcon.astro.
export const stackGroups = {
  design: { es: 'Diseño', en: 'Design' },
  development: { es: 'Desarrollo', en: 'Development' },
  ai: { es: 'IA', en: 'AI' },
  analytics: { es: 'Datos y gestión', en: 'Analytics & workflow' },
};

export const stack = [
  { name: 'Figma', group: stackGroups.design },
  { name: 'FigJam', group: stackGroups.design },
  { name: 'Miro', group: stackGroups.design },
  { name: 'Framer', group: stackGroups.design },
  { name: 'Photoshop', group: stackGroups.design },
  { name: 'Illustrator', group: stackGroups.design },
  { name: 'Premiere', group: stackGroups.design },

  { name: 'HTML & CSS', group: stackGroups.development },
  { name: 'JavaScript', group: stackGroups.development },
  { name: 'React', group: stackGroups.development },
  { name: 'Next.js', group: stackGroups.development },
  { name: 'Astro', group: stackGroups.development },
  { name: 'Tailwind CSS', group: stackGroups.development },
  { name: 'WordPress', group: stackGroups.development },
  { name: 'Git & GitHub', group: stackGroups.development },
  { name: 'Vercel', group: stackGroups.development },
  { name: 'Cursor', group: stackGroups.development },

  { name: 'Claude', group: stackGroups.ai },
  { name: 'ElevenLabs', group: stackGroups.ai },
  { name: 'Higgsfield', group: stackGroups.ai },
  { name: 'Runway', group: stackGroups.ai },
  { name: 'Gemini', group: stackGroups.ai },
  { name: 'Midjourney', group: stackGroups.ai },

  { name: 'Google Analytics', group: stackGroups.analytics },
  { name: 'Search Console', group: stackGroups.analytics },
  { name: 'Notion', group: stackGroups.analytics },
];
