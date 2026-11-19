/*
 * Idioma al que va "/" según el header Accept-Language del navegador: inglés
 * si es el idioma que el navegador pone primero; cualquier otro, castellano.
 *
 * No usa Astro.preferredLocale porque compara el código entero: "en-US" no
 * coincide con el locale "en" y devolvería undefined.
 */
export function homeLocaleFor(acceptLanguage) {
  return mostPreferredLanguage(acceptLanguage ?? '') === 'en' ? 'en' : 'es';
}

// "en-US,en;q=0.9,es;q=0.8" → "en": el de mayor q, sin la región. Sin q, la
// calidad es 1; con empate gana el primero. "*" y q=0 no cuentan.
function mostPreferredLanguage(header) {
  let bestLanguage = null;
  let bestQuality = 0;

  for (const entry of header.split(',')) {
    const [language, ...params] = entry.split(';').map((part) => part.trim());
    const qualityParam = params.find((param) => param.startsWith('q='));
    const quality = qualityParam ? Number(qualityParam.slice(2)) : 1;

    // Un q mal escrito da NaN, y NaN > x es siempre false: se descarta.
    if (!language || language === '*' || !(quality > bestQuality)) continue;
    bestLanguage = language;
    bestQuality = quality;
  }

  return bestLanguage ? bestLanguage.split('-')[0].toLowerCase() : null;
}
