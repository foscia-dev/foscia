import makePluralizer from '@foscia/shared/strings/makePluralizer';

/**
 * Singularize a word.
 *
 * @param word
 *
 * @internal
 */
export default /* @__PURE__ */ makePluralizer([
  [/(child)ren$/i, '$1'],
  [/(kni|wi|li)(ves)$/i, '$1fe'],
  [/(ves)$/i, 'f'],
  [/(ies)$/i, 'y'],
  [/(i)$/i, 'us'],
  [/(zes)$/i, 'ze'],
  [/(shes)$/i, 'sh'],
  [/(ses)$/i, 's'],
  [/(oes)$/i, 'o'],
  [/(s)$/i, ''],
]);
