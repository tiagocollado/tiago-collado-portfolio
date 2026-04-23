import createMiddleware from 'next-intl/middleware'

// In Next.js 16, "middleware" was renamed to "proxy".
// This file runs before every request to detect the locale
// and redirect/rewrite to the correct [locale] segment.
export const proxy = createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es'
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
