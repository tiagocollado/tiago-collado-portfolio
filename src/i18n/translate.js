import en from './en.json';
import es from './es.json';

const dictionaries = { en, es };

/**
 * t('hero.headline') busca la key en el JSON del idioma. Corre solo en el
 * servidor, así el diccionario nunca viaja al navegador. Una key que falta
 * corta el build: un texto que falta sin avisar se publica como un hueco.
 * t.list() devuelve una lista y t.has() pregunta por una key opcional.
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
