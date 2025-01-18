import { Model, ModelKey, ModelLimitedSnapshot, ModelSnapshot } from '@foscia/core/model/types';
import { ArrayableVariadic, wrapVariadic } from '@foscia/shared';

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
export default <M extends Model>(
  nextSnapshot: ModelSnapshot<M> | ModelLimitedSnapshot<M>,
  prevSnapshot: ModelSnapshot<M> | ModelLimitedSnapshot<M>,
  ...only: ArrayableVariadic<ModelKey<M>>
) => {
  if (nextSnapshot.$instance.$model !== prevSnapshot.$instance.$model) {
    return false;
  }

  const keys = wrapVariadic(...only);
  if (!keys.length && nextSnapshot.$exists !== prevSnapshot.$exists) {
    return false;
  }

  return (
    keys.length > 0
    || Object.keys(nextSnapshot.$values).length === Object.keys(prevSnapshot.$values).length
  ) && (keys.length ? keys : Object.keys(nextSnapshot.$values) as ModelKey<M>[]).every(
    (key) => nextSnapshot.$instance.$model.$config.compareValues(
      nextSnapshot.$values[key],
      prevSnapshot.$values[key],
    ),
  );
};
