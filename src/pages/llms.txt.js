import { publishedProjects } from '../data/projects.js';
import { createTranslator } from '../i18n/translate.js';

// Se genera una sola vez, en el build: es un archivo de texto fijo que se
// actualiza solo cuando cambia un proyecto en projects.js.
export const prerender = true;

/*
 * Mismos canales que muestra la sección de contacto (Contact.jsx). WhatsApp
 * queda afuera a propósito: es un número de teléfono. Si cambia un canal en
 * Contact.jsx, se cambia también acá.
 */
const CONTACT_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tiagocollado/' },
  { label: 'GitHub', href: 'https://github.com/tiagocollado' },
  { label: 'CV', path: '/tiago-collado-cv.pdf' },
  { label: 'Email', href: 'mailto:tiago.collado@gmail.com' },
];

/*
 * Arma /llms.txt con el formato de llmstxt.org: un título, una descripción
 * corta y secciones con listas de links. Todo el texto sale del repo: el
 * nombre y la descripción de en.json, los casos de projects.js.
 */
export function GET({ site }) {
  const t = createTranslator('en');
  const absoluteUrl = (path) => new URL(path, site).href;

  const caseStudies = publishedProjects.map(
    (project) =>
      `- [${project.title}](${absoluteUrl(`/en/projects/${project.slug}/`)}): ${project.description.en}`,
  );

  const contact = CONTACT_LINKS.map(
    (link) => `- [${link.label}](${link.href ?? absoluteUrl(link.path)})`,
  );

  // La versión en castellano. Los títulos de los proyectos son los mismos en
  // los dos idiomas; el de la home sale de es.json.
  const spanishVersion = [
    `- [${createTranslator('es')('meta.og_title')}](${absoluteUrl('/es/')})`,
    ...publishedProjects.map(
      (project) => `- [${project.title}](${absoluteUrl(`/es/projects/${project.slug}/`)})`,
    ),
  ];

  const lines = [
    `# ${t('meta.og_title')}`,
    '',
    `> ${t('meta.description')}`,
    '',
    '## Case studies',
    '',
    ...caseStudies,
    '',
    '## Contact',
    '',
    ...contact,
    '',
    '## Optional',
    '',
    ...spanishVersion,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
