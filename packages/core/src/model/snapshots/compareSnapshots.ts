import compareModelValue from '@foscia/core/model/snapshots/compareModelValue';
import { Model, ModelKey, ModelSnapshot } from '@foscia/core/model/types';
import { ArrayableVariadic, wrapVariadic } from '@foscia/shared';

/**
 * Compare two snapshots.
 *
 * @param nextSnapshot
 * @param prevSnapshot
 * @param only
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { compareSnapshot } from '@foscia/core';
 *
 * const titleChanged = compareSnapshot(newSnapshot, oldSnapshot, ['title']);
 * if (titleChanged) {
 * }
 * ```
 */
export default <M extends Model>(
  nextSnapshot: ModelSnapshot<M>,
  prevSnapshot: ModelSnapshot<M>,
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
    (key) => compareModelValue(
      nextSnapshot.$instance.$model,
      nextSnapshot.$values[key],
      prevSnapshot.$values[key],
    ),
  );
};
