export type Locale = 'es' | 'en'

/**
 * Vocabulario de imagenes del case study.
 *
 * Reemplaza a la cuota de "4 imagenes por caso". Cada valor define que
 * muestra la imagen y, por consecuencia, como se rendea. La direccion de
 * arte completa de cada uno esta en `.claude/rules/imagenes.md`.
 *
 * - `mockup`         El mockup del sitio en un entorno real, panoramico.
 *                    Es el HERO de cada case study y la MISMA composicion
 *                    que el cover del home, en otro encuadre. Va A SANGRE.
 * - `long-strip`     La pagina entera capturada, completa: en una columna
 *                    o partida en columnas lado a lado. Muestra alcance sin
 *                    explicar nada. Va A SANGRE.
 * - `screen-cluster` Dos o tres pantallas juntas sobre un plano de color.
 * - `palette`        Bandas de color con su nombre (sistema visual).
 * - `diagram`        Una decision con estructura: flujos, arquitectura, 70/30.
 * - `detail`         Un recorte o zoom de UNA pantalla, no la pantalla entera.
 *
 * Lo que queda FUERA del vocabulario: cualquier imagen que haya que LEER
 * (screenshots con parrafos, bullets o cards de texto adentro). Ver la regla
 * de comprension a 330px en `.claude/rules/imagenes.md`.
 */
export type CaseStudyImageType =
  | 'mockup'
  | 'long-strip'
  | 'screen-cluster'
  | 'palette'
  | 'diagram'
  | 'detail'

/**
 * Donde cae la imagen en la pagina. Es placement puro: el ancho y el
 * recorte los decide `type`, no esto.
 *
 * `hero` va arriba de todo, ANTES del primer parrafo (en desktop, debajo de
 * la barra de metadata; en mobile la barra baja despues del intro). Los
 * demas valores nombran la seccion editorial despues de la cual entra la
 * imagen. `end` es el cierre de la pagina.
 *
 * ⚠️ El slot NO decide el ancho. Que el hero vaya a sangre sale de su
 * `type` (`mockup`), no de estar en `hero`: asi un slot sigue siendo
 * placement puro y el nombre del archivo puede decir QUE es la imagen.
 *
 * Es obligatorio a proposito: si fuera opcional, una imagen sin `slot`
 * no se rendearia en ningun lado y no lo avisaria nada. Asi lo caza TS.
 */
export type CaseStudyImageSlot =
  | 'hero'
  | 'intro'
  | 'challenge'
  | 'decisions'
  | 'delivered'
  | 'end'

export interface CaseStudyImageBrief {
  /** Que muestra la imagen. Decide ancho, recorte y parallax. */
  type: CaseStudyImageType
  /** Donde cae en la pagina. Varias imagenes pueden compartir slot. */
  slot: CaseStudyImageSlot
  /** Texto alternativo (a11y), bilingue. Siempre obligatorio. */
  alt: { es: string; en: string }
  /**
   * Proporcion real del archivo, para los tipos SIN recorte (`long-strip`
   * y `mockup`).
   *
   * Los demas tipos tienen un recorte fijo, asi que su proporcion sale del
   * tipo. Los que no se recortan muestran el archivo tal cual, y su
   * proporcion depende de la pieza: una tira mide lo que mida la pagina
   * capturada. `next/image` usa este dato para reservar el alto antes de
   * que cargue y evitar el salto de layout (CLS). Si no se declara, se usa
   * el default del tipo (1:3 la tira, 21:9 el mockup): la imagen se ve igual
   * de bien, pero si no coincide la pagina pega un salto al cargar.
   */
  frame?: { width: number; height: number }
  /** SOLO mientras la imagen no existe: que imagen tiene que ir. */
  description?: string
  /** SOLO mientras la imagen no existe: prompt sugerido. */
  prompt?: string
  /** Path absoluto desde /public cuando la imagen ya existe. */
  src?: string
}

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
     * ⚠️ Declarado pero SIN RENDEREAR: hoy ningún proyecto tiene uno y la
     * barra de metadata no lo muestra. Para activarlo hacen falta tres
     * cosas: el push a `linkItems` en `CaseStudyMetaBar`, la key
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
   * Si el proyecto existe en el sitio publicado.
   *
   * `false` = no se buildea su página (da 404), no aparece en el home y no
   * entra en el ciclo de "Próximo proyecto". Los datos, el copy y las
   * imágenes se quedan en el repo: reactivarlo es cambiar este valor a `true`.
   *
   * Existe porque la versión actual del portfolio muestra solo los 4 que
   * están completos. Los otros 3 vuelven en la versión siguiente, junto con
   * la página de todos los proyectos (CLAUDE.md §8).
   *
   * Es distinto de `showOnHome`: `published` decide si la página EXISTE;
   * `showOnHome`, si además va destacado en la grilla del home. Un proyecto
   * con `published: false` nunca se muestra, tenga el `showOnHome` que tenga.
   */
  published: boolean
  /**
   * Si el proyecto aparece en la grilla del home.
   *
   * Antes se llamaba `featured` y significaba "ocupa 2 columnas". Ese
   * significado murió con el rework: el tamaño lo decide ahora `cardShape`,
   * así que este campo solo dice QUÉ se muestra, no cómo. Se renombró en vez
   * de reusarse para que no quedara un nombre arrastrando la semántica vieja.
   *
   * Hoy: true en los 4 publicados (`order` 1-4), que son los cuatro que
   * mejor muestran rango. Los otros 3 no están publicados (ver `published`).
   */
  showOnHome: boolean
  /**
   * Orden del home, y también del ciclo de "Próximo proyecto" al pie de cada
   * case study: los dos leen la misma lista, así que no pueden divergir.
   */
  order: number
  /**
   * Metadata estructurada para la barra de metadata del case study
   * (`CaseStudyMetaBar`). Cada campo es opcional — si falta, el bloque
   * correspondiente no aparece en la barra.
   */
  metadata?: {
    /** Cliente o entidad para la que se hizo el proyecto. */
    client?:   { es: string; en: string }
    /** Rol específico ej. "Diseñador UX/UI (ad honorem)". */
    role?:     { es: string; en: string }
    /** Duración ej. "3 meses (ago–oct 2025)". */
    duration?: { es: string; en: string }
    /** Alcance del trabajo ej. "Diseño y ejecución end-to-end · trato directo con el cliente". */
    team?:     { es: string; en: string }
    /** Stack como array para listarlo en la barra de metadata. */
    stack?:    string[]
    /** Nota sobre NDA si aplica. */
    nda?:      { es: string; en: string }
  }
  /**
   * Imagenes del case study. NO hay cantidad fija: cada proyecto usa los
   * tipos que necesita, pueden ser 2 o 6.
   *
   * Reemplazo del array de 4 posiciones fijas (`[0]` intro - `[1]` desafio -
   * `[2]` decisiones - `[3]` entregado). Esa cuota se decidio antes de saber
   * que necesitaba cada caso y obligaba a inventar que poner en cada slot.
   * Ahora cada imagen declara DOS cosas:
   *
   * - `type`  -> QUE es y COMO se rendea (ancho, recorte, parallax).
   * - `slot`  -> DONDE cae en la pagina.
   *
   * Varias imagenes pueden compartir `slot`: eso es lo que produce los
   * grupos de 2-3 imagenes seguidas sin texto entre medio, en vez de la
   * alternancia 1 a 1 parrafo-imagen que tenia el layout viejo.
   *
   * Las reglas de arte de cada `type` viven en `.claude/rules/imagenes.md`.
   */
  imageBriefs?: CaseStudyImageBrief[]
}

export interface StackItem {
  name: string
  category: 'design' | 'frontend' | 'backend' | 'tools'
  level: 'advanced' | 'intermediate' | 'basic'
  showInCarousel: boolean
  icon?: string
}