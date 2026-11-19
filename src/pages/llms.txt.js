import { publishedProjects } from '../data/projects.js';
import { createTranslator } from '../i18n/translate.js';

export const prerender = true;

// Los canales de Contact.jsx, menos WhatsApp, que es un teléfono. Si cambia
// uno allá, se cambia acá.
const CONTACT_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tiagocollado/' },
  { label: 'GitHub', href: 'https://github.com/tiagocollado' },
  { label: 'CV', path: '/tiago-collado-cv.pdf' },
  { label: 'Email', href: 'mailto:tiago.collado@gmail.com' },
];

// Formato de llmstxt.org.
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
