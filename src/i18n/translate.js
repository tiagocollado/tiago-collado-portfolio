import en from './en.json';
import es from './es.json';

const dictionaries = { en, es };

/**
 * Devuelve la función t() de un idioma.
 *
 * t('hero.headline') parte la key por los puntos y la busca adentro del JSON:
 * primero el bloque "hero", después "headline". Se usa en el servidor, al
 * armar cada página, así el diccionario entero nunca viaja al navegador: a
 * una isla se le pasan solo los textos que usa, ya traducidos.
 *
 * Si la key no existe, corta el build con un error que la nombra. Es a
 * propósito: un texto que falta y no avisa se publica como un hueco.
 */
export function createTranslator(locale) {
  const dictionary = dictionaries[locale];

  if (!dictionary) {
    throw new Error(`No hay diccionario para el idioma "${locale}".`);
  }

  return function t(key) {
    const text = key
      .split('.')
      .reduce((section, part) => section?.[part], dictionary);

    if (typeof text !== 'string') {
      throw new Error(`Falta el texto "${key}" en ${locale}.json.`);
    }

    return text;
  };
}
