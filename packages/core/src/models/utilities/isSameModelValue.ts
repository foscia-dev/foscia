import isSame from '@foscia/core/models/utilities/isSame';
import isSameSnapshot from '@foscia/core/models/snapshots/isSameSnapshot';
import isSnapshot from '@foscia/core/models/snapshots/isSnapshot';

/**
 * Compare two model values.
 * Will check for {@link isSame | `isSame`} instances or strict equality,
 * and inspect array deeply.
 *
 * @param next
 * @param prev
 *
 * @category Utilities
 * @since 0.13.0
 */
export default function isSameModelValue(next: unknown, prev: unknown): boolean {
  if (next === prev) {
    return true;
  }

  if (isSame(next, prev)) {
    return true;
  }

  if (isSnapshot(next)) {
    return isSnapshot(prev) && isSameSnapshot(next, prev);
  }

  if (Array.isArray(next)) {
    return Array.isArray(prev)
      && next.length === prev.length
      && !next.some((v, i) => !isSameModelValue(v, prev[i]));
  }

  return false;
}
