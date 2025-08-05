import restoreSnapshot from '@foscia/core/models/snapshots/restoreSnapshot';
import { ModelInstance, ModelKey } from '@foscia/core/models/types';
import { Arrayable } from '@foscia/shared';

/**
 * Restore the original snapshot of an instance.
 *
 * @param instance
 * @param only
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { restore } from '@foscia/core';
 *
 * restore(post, ['title']);
 * ```
 */
export default function restore<I extends ModelInstance>(
  instance: I,
  only?: Arrayable<ModelKey<I>>,
) {
  return restoreSnapshot(instance, instance.$original, only);
}
