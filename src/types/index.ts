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
  /** Año de realización (ej. 2025). Se muestra en la card como label arriba. */
  year?: number
  featured: boolean
  order: number
  comingSoon?: boolean
  /**
   * Si es true, el case study renderea con el layout Awwwards-style (sidebar
   * metadata + main editorial, secciones intro/challenge/decisions/delivered/closing).
   * Si es false o undefined, se renderea con el layout legacy (5 secciones numeradas).
   * Los case studies se migran uno por uno; mientras tanto conviven los dos layouts.
   */
  awwwardsLayout?: boolean
  /**
   * Metadata estructurada para el sidebar del layout Awwwards-style.
   * Solo se renderea cuando `awwwardsLayout: true`. Cada campo es opcional —
   * si falta, el bloque correspondiente no aparece en el sidebar.
   */
  metadata?: {
    /** Cliente o entidad para la que se hizo el proyecto. */
    client?:   { es: string; en: string }
    /** Rol específico ej. "Diseñador UX/UI (ad honorem)". */
    role?:     { es: string; en: string }
    /** Duración ej. "3 meses (ago–oct 2025)". */
    duration?: { es: string; en: string }
    /** Equipo ej. "3 personas (yo + dev + fundadores)". */
    team?:     { es: string; en: string }
    /** Stack como array para listarlo en el sidebar. */
    stack?:    string[]
    /** Nota sobre NDA si aplica. */
    nda?:      { es: string; en: string }
  }
  /**
   * Briefs de las 4 imágenes contextuales del layout Awwwards-style.
   * Orden fijo: [0] intro · [1] desafío · [2] entre decisiones · [3] entregado.
   *
   * Cada brief lleva:
   * - `alt`: texto alternativo (a11y), bilingüe.
   * - `description?`: SOLO mientras la imagen no existe — qué imagen tiene
   *   que ir. Aparece visible en el placeholder.
   * - `prompt?`: SOLO mientras la imagen no existe — prompt sugerido para
   *   Nano Banana / Gemini Pro. Aparece en el placeholder.
   * - `src?`: path absoluto desde /public cuando la imagen ya existe. Si
   *   está, se renderea la imagen real y se ignoran description/prompt.
   *
   * Cuando Tiago genera y sube una imagen, solo agrega `src` al brief
   * correspondiente — los otros campos quedan como documentación viva.
   */
  imageBriefs?: Array<{
    alt:          { es: string; en: string }
    description?: string
    prompt?:      string
    src?:         string
  }>
}

export interface StackItem {
  name: string
  category: 'design' | 'frontend' | 'backend' | 'tools'
  level: 'advanced' | 'intermediate' | 'basic'
  showInCarousel: boolean
  icon?: string
}