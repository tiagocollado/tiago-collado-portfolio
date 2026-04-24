export type Locale = 'es' | 'en'

export interface Project {
  slug: string
  title: string
  tagline: {
    es: string
    en: string
  }
  description: {
    es: string
    en: string
  }
  tags: string[]
  type: 'ux' | 'fullstack' | 'wordpress' | 'coming-soon'
  links: {
    behance?:    string
    github?:     string
    githubBack?: string
    live?:       string
    figma?:      string
  }
  coverImage: string | null
  /**
   * Paths absolutos (desde /public) a imágenes de galería del caso de estudio.
   * Si está vacío o undefined, el componente Gallery no renderiza nada.
   * Para agregar más imágenes a un proyecto, sumar paths acá — no hay probe automático.
   */
  gallery?: string[]
  featured: boolean
  order: number
  comingSoon?: boolean
}

export interface StackItem {
  name: string
  category: 'design' | 'frontend' | 'backend' | 'tools'
  level: 'advanced' | 'intermediate' | 'basic'
  showInCarousel: boolean
  icon?: string
}