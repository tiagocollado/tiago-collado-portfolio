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
  /**
   * Categorías generales del servicio prestado, en formato de agencia:
   * el título de la card da la marca y esto da la categoría
   * ("Paseo Güemes Hotel" → "Diseño Web & Dirección de Arte").
   *
   * Se rendea en dos lugares: debajo del título en la card del home y
   * arriba del título en el header del case study.
   *
   * ⚠️ Van CATEGORÍAS, no roles. "Diseño Web", "Aplicaciones Móviles",
   * "Design System", "Branding" — nunca "Diseño UX/UI", "Full-stack" ni
   * "WordPress", que describen cómo se hizo y viven en `metadata.role`
   * y en `metadata.stack`. Máximo 2 por proyecto: con más, la línea se
   * parte en dos renglones en la card y deja de escanearse.
   *
   * Reemplazó al campo `type` ('ux' | 'fullstack' | 'wordpress'), que
   * describía a Tiago en vez de al trabajo entregado.
   */
  services: {
    es: string[]
    en: string[]
  }
  links: {
    github?:     string
    githubBack?: string
    /** URL del live demo del proyecto. */
    live?:       string
    /**
     * URL de un prototipo de Figma.
     * ⚠️ Declarado pero SIN RENDEREAR: hoy ningún proyecto tiene uno y el
     * sidebar del case study no lo muestra. Para activarlo hacen falta tres
     * cosas: el push a `linkItems` en `CaseStudySidebar`, la key
     * `view_prototype` en los DOS JSON de mensajes, y el link real acá.
     */
    figma?:      string
  }
  coverImage: string | null
  /** Año de realización (ej. 2025). Se muestra en la card como label arriba. */
  year?: number
  /**
   * Forma de la card en la grilla masonry. Solo hay DOS, a propósito:
   *
   * - `wide`   → 4:3
   * - `square` → 1:1
   *
   * Salen de medir la referencia (Studio Dizzy): sus cards son 4:3, 3:2 y
   * ≈1:1. Se tomaron las dos extremas, que son las que dan el contraste.
   *
   * ⚠️ Dos formas y no más. En la grilla bento original cada card tenía su
   * proporción y el mismo archivo caía en recortes de 2,64:1 y 1,28:1, con lo
   * cual solo sobrevivía el 60% central. Dos formas fijas dan asimetría con
   * un spec que se puede seguir en Figma.
   *
   * ⚠️ NO hay `row-span`: la grilla es masonry de dos columnas y cada card
   * declara su propio aspect. Las columnas terminan a distinta altura y eso
   * es deliberado — es lo que la diferencia de una grilla alineada por filas.
   */
  cardShape: 'wide' | 'square'
  /**
   * Si el proyecto aparece en la grilla del home.
   *
   * Antes se llamaba `featured` y significaba "ocupa 2 columnas". Ese
   * significado murió con el rework: el tamaño lo decide ahora `cardShape`,
   * así que este campo solo dice QUÉ se muestra, no cómo. Se renombró en vez
   * de reusarse para que no quedara un nombre arrastrando la semántica vieja.
   *
   * Hoy: true en los 4 reales para clientes (`order` 1-4). Los otros 3
   * (simulación, universitario, concept) viven solo en /projects.
   */
  showOnHome: boolean
  /** Orden en ambas grillas: la del home y la de /projects. */
  order: number
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