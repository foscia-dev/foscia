const rules: [RegExp, string][] = [
  [/(f|fe)$/i, 'ves'],
  [/([^aeiouy])y$/i, '$1ies'],
  [/([^aeiouy]o)$/i, '$1es'],
  [/(s|ch|sh|x|z)$/i, '$1es'],
  [/(.)$/i, '$1s'],
];

export default function pluralize(word: string) {
  let pluralizedWord: string | undefined;
  rules.some(([regexp, replacement]) => {
    pluralizedWord = word.replace(regexp, replacement);

    return word !== pluralizedWord;
  });

  return pluralizedWord ?? word;
}
