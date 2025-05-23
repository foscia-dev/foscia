/* eslint-disable no-param-reassign */
import takeSnapshot from '@foscia/core/model/snapshots/takeSnapshot';
import { ModelInstance, ModelKey } from '@foscia/core/model/types';
import { Arrayable, tap, wrap } from '@foscia/shared';

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
export default <I extends ModelInstance>(
  instance: I,
  only?: Arrayable<ModelKey<I>>,
) => tap(instance, () => {
  const snapshot = takeSnapshot(instance);
  const keys = wrap(only);
  if (keys.length) {
    keys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(snapshot.$values, key)) {
        // @ts-ignore
        instance.$original.$values[key] = snapshot.$values[key];
      } else {
        // @ts-ignore
        delete instance.$original.$values[key];
      }
    });
  } else {
    instance.$original = snapshot;
  }
});
