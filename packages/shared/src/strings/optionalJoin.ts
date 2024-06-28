import isNone from '@foscia/shared/checks/isNone';
import { Optional } from '@foscia/shared/types';

export default (
  strings: Optional<string>[],
  separator: string,
) => strings
  .filter((s) => !isNone(s))
  .join(separator);
