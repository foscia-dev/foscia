import {
  ModelInstance,
  ModelKey,
  ModelShallowSnapshot,
  ModelSnapshot,
} from '@foscia/core/models/types';
import { Arrayable, wrap } from '@foscia/shared';

/**
 * Check if two snapshots are similar (same model, same existence state
 * and same values).
 *
 * @param nextSnapshot
 * @param prevSnapshot
 * @param only
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { isSameSnapshot } from '@foscia/core';
 *
 * const titleChanged = isSameSnapshot(newSnapshot, oldSnapshot, ['title']);
 * if (titleChanged) {
 * }
 * ```
 */
export default function isSameSnapshot<I extends ModelInstance>(
  nextSnapshot: ModelSnapshot<I> | ModelShallowSnapshot<I>,
  prevSnapshot: ModelSnapshot<I> | ModelShallowSnapshot<I> | null,
  only?: Arrayable<ModelKey<I>>,
) {
  if (!prevSnapshot || nextSnapshot.instance.$model !== prevSnapshot.instance.$model) {
    return false;
  }

  const keys = wrap(only);
  if (!keys.length && (
    nextSnapshot.exists !== prevSnapshot.exists
    || nextSnapshot.values.size !== prevSnapshot.values.size
  )) {
    return false;
  }

  return (keys.length ? keys : nextSnapshot.values.keys()).every(
    (key) => nextSnapshot.instance.$model.$config.isSameSnapshotValue(
      nextSnapshot.values.get(key),
      prevSnapshot.values.get(key),
    ),
  );
}
