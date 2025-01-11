import makePluralizer from '@foscia/shared/strings/makePluralizer';

/**
 * Pluralize a word.
 *
 * @param word
 *
 * @internal
 */
export default /* @__PURE__ */ makePluralizer([
  [/(child)$/i, '$1ren'],
  [/(f|fe)$/i, 'ves'],
  [/([^aeiouy])y$/i, '$1ies'],
  [/([^aeiouy]o)$/i, '$1es'],
  [/(s|ch|sh|x|z)$/i, '$1es'],
  [/(.)$/i, '$1s'],
]);
