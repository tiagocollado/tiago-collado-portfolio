import { StackItem } from '@/types'

export const stack: StackItem[] = [
  // Design
  { name: 'Figma',              category: 'design',   level: 'advanced',     showInCarousel: true },
  { name: 'Adobe Photoshop',    category: 'design',   level: 'intermediate', showInCarousel: true },
  { name: 'Adobe Illustrator',  category: 'design',   level: 'intermediate', showInCarousel: true },

  // Frontend
  { name: 'React',              category: 'frontend', level: 'intermediate', showInCarousel: true },
  { name: 'Next.js',            category: 'frontend', level: 'intermediate', showInCarousel: true },
  { name: 'Tailwind CSS',       category: 'frontend', level: 'intermediate', showInCarousel: true },
  { name: 'HTML5',              category: 'frontend', level: 'intermediate', showInCarousel: true },
  { name: 'CSS3',               category: 'frontend', level: 'intermediate', showInCarousel: true },
  { name: 'TypeScript',         category: 'frontend', level: 'intermediate', showInCarousel: true },

  // Backend
  { name: 'Node.js',            category: 'backend',  level: 'basic',        showInCarousel: true },
  { name: 'MongoDB',            category: 'backend',  level: 'basic',        showInCarousel: true },

  // Tools
  { name: 'WordPress',          category: 'tools',    level: 'intermediate', showInCarousel: false },
  { name: 'Framer',             category: 'tools',    level: 'basic',        showInCarousel: false },
  { name: 'IA Generativa',      category: 'tools',    level: 'intermediate', showInCarousel: true },
  { name: 'Git / GitHub',       category: 'tools',    level: 'intermediate', showInCarousel: true },
]