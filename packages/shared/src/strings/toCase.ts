/**
 * Create a string case converter using a word transformer and separator.
 *
 * @param transformer
 * @param separator
 *
 * @internal
 */
export default (
  transformer: (word: string, index: number) => string,
  separator: string,
) => (value: string) => {
  const matches = value.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
  );

  return matches === null ? value : matches.map(transformer).join(separator);
};
