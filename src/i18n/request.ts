import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? 'es'

  // Explicit imports (not template literal) so webpack bundles both files
  // correctly in production. Template literals can cause missing-module errors
  // in Vercel's compiled output.
  const messages = locale === 'en'
    ? (await import('../messages/en.json')).default
    : (await import('../messages/es.json')).default

  return { locale, messages }
})