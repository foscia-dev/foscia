import isNone from '@foscia/shared/checks/isNone';
import { Optional } from '@foscia/shared/types';

/**
 * Join strings which are not "none" with separator.
 *
 * @param strings
 * @param separator
 *
 * @internal
 */
export default (
  strings: Optional<string>[],
  separator: string,
) => strings
  .filter((s) => !isNone(s))
  .join(separator);
