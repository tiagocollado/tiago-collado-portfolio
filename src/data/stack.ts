import { StackItem } from '@/types'

/**
 * Stack tecnológico mostrado en el carrusel del portfolio.
 *
 * REGLA (ver CLAUDE.md): solo `showInCarousel: true` en herramientas que
 * Tiago realmente domina con soltura. Si en una entrevista le preguntan
 * profundo, tiene que poder responder. Si no, no va.
 *
 * ORDEN DEL CARRUSEL:
 * Pensado para el momento en que un reclutador llega a la sección
 * (después de scrollear Hero → Projects → About). Probablemente tenga
 * 30-60 segundos de atención. El loop dura 45s, así que los primeros
 * 5-7 ítems son los que más probabilidad tienen de ser leídos.
 *
 * Estrategia: mezclar Design + UX + Frontend al principio para mostrar
 * un perfil balanceado desde el primer pantallazo. Lo más fuerte de
 * Tiago (Figma, UX Research, React) va arriba. Lo más básico/secundario
 * (HTML, CSS, Git) al final.
 */
export const stack: StackItem[] = [
  // ── Top del carrusel: lo más fuerte y diferenciador ────────────────
  { name: 'Figma',              category: 'design',   level: 'advanced',     showInCarousel: true },
  { name: 'UX Research',        category: 'tools',    level: 'advanced',     showInCarousel: true },
  { name: 'React',              category: 'frontend', level: 'intermediate', showInCarousel: true },
  { name: 'Design Systems',     category: 'tools',    level: 'intermediate', showInCarousel: true },
  { name: 'Next.js',            category: 'frontend', level: 'intermediate', showInCarousel: true },
  { name: 'Prototyping',        category: 'tools',    level: 'advanced',     showInCarousel: true },
  { name: 'Tailwind CSS',       category: 'frontend', level: 'intermediate', showInCarousel: true },

  // ── Medio: herramientas creativas y skills complementarias ─────────
  { name: 'FigJam',             category: 'design',   level: 'advanced',     showInCarousel: true },
  { name: 'Adobe Photoshop',    category: 'design',   level: 'intermediate', showInCarousel: true },
  { name: 'IA Generativa',      category: 'tools',    level: 'intermediate', showInCarousel: true },
  { name: 'Adobe Illustrator',  category: 'design',   level: 'intermediate', showInCarousel: true },
  { name: 'Accessibility',      category: 'tools',    level: 'intermediate', showInCarousel: true },

  // ── Cierre del carrusel: bases y herramientas de soporte ───────────
  { name: 'HTML5',              category: 'frontend', level: 'intermediate', showInCarousel: true },
  { name: 'Adobe Premiere',     category: 'design',   level: 'intermediate', showInCarousel: true },
  { name: 'CSS3',               category: 'frontend', level: 'intermediate', showInCarousel: true },
  { name: 'Git / GitHub',       category: 'tools',    level: 'intermediate', showInCarousel: true },

  // ── No visibles en el carrusel ─────────────────────────────────────
  // Tocados pero NO domina con soltura (regla CLAUDE.md):
  { name: 'TypeScript',         category: 'frontend', level: 'basic',        showInCarousel: false },
  { name: 'Node.js',            category: 'backend',  level: 'basic',        showInCarousel: false },
  { name: 'MongoDB',            category: 'backend',  level: 'basic',        showInCarousel: false },

  // CMS — disponibles pero fuera del carrusel principal:
  { name: 'WordPress',          category: 'tools',    level: 'intermediate', showInCarousel: false },
  { name: 'Framer',             category: 'tools',    level: 'basic',        showInCarousel: false },
]
