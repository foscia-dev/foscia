/**
 * Create a function to pluralize or singularize words based on given rules.
 *
 * @param rules
 *
 * @internal
 */
export default (rules: [RegExp, string][]) => (word: string) => {
  let nextWord: string | undefined;
  rules.some(([regexp, replacement]) => {
    nextWord = word.replace(regexp, replacement);

    return word !== nextWord;
  });

  return nextWord ?? word;
};
