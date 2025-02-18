import isSnapshot from '@foscia/core/model/snapshots/checks/isSnapshot';
import isSame from '@foscia/core/model/checks/isSame';
import isSameSnapshot from '@foscia/core/model/snapshots/checks/isSameSnapshot';

const compareValue = (next: unknown, prev: unknown) => (
  isSame(next, prev)
  || next === prev
  || (isSnapshot(next) && isSnapshot(prev) && isSameSnapshot(next, prev))
);

/**
 * Compare two model values.
 * Will check for {@link isSame | `isSame`} instances or strict equality,
 * and inspect array deeply.
 *
 * @param next
 * @param prev
 *
 * @since 0.13.0
 */
export default (next: unknown, prev: unknown) => (
  Array.isArray(next)
    ? (
      Array.isArray(prev)
      && next.length === prev.length
      && !next.some((v, i) => !compareValue(v, prev[i]))
    )
    : compareValue(next, prev)
);
