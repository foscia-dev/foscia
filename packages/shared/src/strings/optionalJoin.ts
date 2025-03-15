/**
 * Join strings which are not "none" with separator.
 *
 * @param strings
 * @param separator
 *
 * @internal
 */
export default (
  strings: (string | null | undefined)[],
  separator: string,
) => strings
  .filter((s) => s)
  .join(separator);
