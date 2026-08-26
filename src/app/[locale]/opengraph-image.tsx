import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Locale } from '@/types'

/**
 * Imagen de Open Graph generada en build time.
 *
 * Por qué existe: antes no había ninguna og:image declarada, así que cuando
 * alguien compartía el link, el scraper de la red social agarraba la primera
 * imagen grande que encontraba en el HTML (el cover de un case study). Este
 * archivo fuerza que SIEMPRE se use el logotipo de la marca.
 *
 * Al vivir en app/[locale]/, la convención de Next hace que aplique a este
 * segmento y a todos los de abajo (incluido /projects/[slug]), salvo que un
 * segmento más profundo declare su propia imagen.
 *
 * Nota: no usamos el icon.svg directamente porque la mayoría de las redes
 * (WhatsApp, LinkedIn, X) no renderean SVG en preview. Esto sale como PNG.
 */

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Gotya by Tiago Collado'

// Pre-genera la imagen para ambos locales en build time en vez de
// renderearla on-demand en cada scrape de red social.
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }]
}

// Mismos tokens que globals.css en dark mode, hardcodeados porque
// ImageResponse no tiene acceso a las CSS variables del sitio.
const BG = '#111110'
const INK = '#F0EDE8'
const MUTED = '#A8A49F'
const ACCENT = '#C96A3A'

/**
 * El lema, por idioma.
 *
 * Va hardcodeado y no por next-intl a propósito: `getTranslations` necesita
 * el request context de next-intl, que en un archivo de imagen (que no es
 * una page) es una dependencia frágil para ganar muy poco. Son dos frases
 * que ya viven en `hero.headline` / `hero.subheadline` de los JSON; si las
 * cambiás allá, acordate de tocarlas acá.
 */
const MOTTO: Record<Locale, { line1: string; line2: string }> = {
  es: {
    line1: 'Diseñar experiencias con empatía.',
    line2: 'Crearlas con precisión.',
  },
  en: {
    line1: 'Designing experiences with empathy.',
    line2: 'Building them with precision.',
  },
}

const EYEBROW: Record<Locale, string> = {
  es: 'Diseño UX/UI y Desarrollo Web',
  en: 'UX/UI Design & Web Development',
}

/**
 * Carga los TTF de Space Grotesk desde el repo.
 *
 * ⚠️ Tienen que ser TTF (u OTF/WOFF): satori —el motor detrás de
 * ImageResponse— NO soporta WOFF2, que es justamente lo único que baja
 * `next/font/google`. Por eso los archivos están commiteados en `fonts/`
 * en vez de reusar los que Next ya descarga.
 *
 * Se leen del filesystem y no por fetch para que el build no dependa de la
 * red ni de que Google Fonts esté arriba.
 */
async function loadFonts() {
  const dir = join(process.cwd(), 'src', 'app', '[locale]', 'fonts')
  const [regular, bold] = await Promise.all([
    readFile(join(dir, 'SpaceGrotesk-Regular.ttf')),
    readFile(join(dir, 'SpaceGrotesk-Bold.ttf')),
  ])
  return [
    { name: 'Space Grotesk', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Space Grotesk', data: bold, weight: 700 as const, style: 'normal' as const },
  ]
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  // `params` es una Promise en Next 16 — también acá, no solo en las pages.
  const { locale } = await params
  // Si llegara un locale raro, caemos a inglés en vez de romper el build.
  const lang: Locale = locale === 'es' ? 'es' : 'en'

  const motto = MOTTO[lang]
  const fonts = await loadFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: BG,
          padding: '80px',
          fontFamily: 'Space Grotesk',
        }}
      >
        {/* Marca de agua: la G del logotipo, gigante y recortada por el borde */}
        <div
          style={{
            position: 'absolute',
            right: '-60px',
            bottom: '-160px',
            fontSize: '520px',
            fontWeight: 700,
            color: ACCENT,
            opacity: 0.12,
            letterSpacing: '-0.05em',
          }}
        >
          G
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '6px', backgroundColor: ACCENT }} />
          <div
            style={{
              fontSize: '24px',
              color: MUTED,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            {EYEBROW[lang]}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '128px',
              fontWeight: 700,
              color: INK,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            Gotya
          </div>
          <div
            style={{
              fontSize: '32px',
              color: MUTED,
              marginTop: '16px',
              letterSpacing: '-0.01em',
            }}
          >
            by Tiago Collado
          </div>
        </div>

        {/* Satori exige display:flex explícito en todo div con más de un
            hijo, así que el lema va en dos divs apilados en vez de un <br />. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '30px',
            maxWidth: '860px',
            lineHeight: 1.35,
          }}
        >
          <div style={{ color: INK }}>{motto.line1}</div>
          <div style={{ color: ACCENT }}>{motto.line2}</div>
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
