import takeSnapshot from '@foscia/core/models/snapshots/takeSnapshot';
import { ModelInstance, ModelKey } from '@foscia/core/models/types';
import { Arrayable, wrap } from '@foscia/shared';

/**
 * Take a snapshot and define it as the last original state of instance.
 *
 * @param instance
 * @param only
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { markSynced } from '@foscia/core';
 *
 * markSynced(post, ['title', 'description']);
 * ```
 */
export default function markSynced<I extends ModelInstance>(
  instance: I,
  only?: Arrayable<ModelKey<I>>,
) {
  const snapshot = takeSnapshot(instance);
  const keys = wrap(only);

  if (keys.length) {
    keys.forEach((key) => {
      if (snapshot.values.has(key)) {
        instance.$original.values.set(key, snapshot.values.get(key));
      } else {
        instance.$original.values.delete(key);
      }
    });
  } else {
    // eslint-disable-next-line no-param-reassign
    instance.$original = snapshot;
  }

  return instance;
}
