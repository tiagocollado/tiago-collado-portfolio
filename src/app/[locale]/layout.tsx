import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono } from 'next/font/google'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/ui/Navbar'

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
  return [{ locale: 'es' }, { locale: 'en' }]
}

export const metadata: Metadata = {
  title: 'Tiago Collado — UX/UI Designer & Frontend Developer',
  description: 'Diseño experiencias con empatía. Las construyo con precisión.',
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <main style={{ paddingTop: '64px' }}>
              {children}
            </main>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}