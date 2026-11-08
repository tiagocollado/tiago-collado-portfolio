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
 *
 * Dos variantes para los casos que no son un texto suelto:
 * - t.list('services.items') devuelve una lista de textos.
 * - t.has('case_study_x.process') dice si existe una key opcional, sin cortar
 *   el build si falta.
 */
export function createTranslator(locale) {
  const dictionary = dictionaries[locale];

  if (!dictionary) {
    throw new Error(`No hay diccionario para el idioma "${locale}".`);
  }

  const lookup = (key) =>
    key.split('.').reduce((section, part) => section?.[part], dictionary);

  function t(key) {
    const text = lookup(key);
    if (typeof text !== 'string') {
      throw new Error(`Falta el texto "${key}" en ${locale}.json.`);
    }
    return text;
  }

  t.list = function list(key) {
    const texts = lookup(key);
    if (!Array.isArray(texts)) {
      throw new Error(`Falta la lista "${key}" en ${locale}.json.`);
    }
    return texts;
  };

  t.has = function has(key) {
    return typeof lookup(key) === 'string';
  };

  return t;
}
