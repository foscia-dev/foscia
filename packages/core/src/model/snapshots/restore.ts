import restoreSnapshot from '@foscia/core/model/snapshots/restoreSnapshot';
import { ModelInstance, ModelKey } from '@foscia/core/model/types';
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
export default <I extends ModelInstance>(
  instance: I,
  only?: Arrayable<ModelKey<I>>,
) => restoreSnapshot(instance, instance.$original, only);
