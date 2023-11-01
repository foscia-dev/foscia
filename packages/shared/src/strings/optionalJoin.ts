import isNone from '@foscia/shared/checks/isNone';
import { Optional } from '@foscia/shared/types';

export default function optionalJoin(
  strings: Optional<string>[],
  separator: string,
) {
  return strings
    .filter((s) => !isNone(s))
    .join(separator);
}
