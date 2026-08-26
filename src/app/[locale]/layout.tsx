import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono } from 'next/font/google'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/ui/Navbar'
import SkipLink from '@/components/ui/SkipLink'
import SmoothScrollProvider from '@/components/ui/SmoothScrollProvider'
import { CursorProvider } from '@/components/ui/CustomCursor'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

// Tells Next.js to pre-render pages for both locales at build time.
// Without this, pages are rendered dynamically and the locale context
// may not be available when next-intl's getMessages() runs on Vercel.
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }]
}

const SITE_URL = 'https://tiagocollado.vercel.app'
const BRAND = 'Gotya by Tiago Collado'
const TAGLINE = 'Designing experiences with empathy. Building them with precision.'

export const metadata: Metadata = {
  // metadataBase es obligatorio para que Next resuelva og:image a una URL
  // absoluta. Sin esto, las redes sociales reciben una ruta relativa y no
  // pueden descargar la imagen.
  metadataBase: new URL(SITE_URL),
  title: BRAND + ' — UX/UI Design & Web Development',
  description: TAGLINE,
  openGraph: {
    title: BRAND,
    description: TAGLINE,
    siteName: 'Gotya',
    url: SITE_URL,
    type: 'website',
    // La imagen NO se declara acá: la genera el archivo opengraph-image.tsx
    // de este mismo segmento (file convention de Next). Al vivir en
    // app/[locale]/, aplica también a /projects/[slug], así que compartir
    // cualquier case study usa el logotipo y no una captura del proyecto.
  },
  twitter: {
    card: 'summary_large_image',
    title: BRAND,
    description: TAGLINE,
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Required by next-intl v4: establishes the locale context for all
  // server-side translation calls (getMessages, getTranslations) in this subtree.
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextIntlClientProvider messages={messages}>
            <SmoothScrollProvider>
              <CursorProvider>
                <SkipLink />
                <Navbar />
                {/* `id="main"` es el destino del SkipLink y `tabIndex={-1}` lo
                    hace focusable por script sin meterlo en el orden de
                    tabulación. El `focus:outline-none` es una excepción
                    deliberada a "nunca suprimir el focus ring": acá el foco
                    llega solo de forma programática, y un contorno alrededor
                    de todo el contenido de la página se lee como un bug, no
                    como feedback. Los controles reales conservan su ring. */}
                <main id="main" tabIndex={-1} className="pt-16 focus:outline-none">
                  {children}
                </main>
              </CursorProvider>
            </SmoothScrollProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}