import isSameSnapshot from '@foscia/core/model/snapshots/checks/isSameSnapshot';
import takeSnapshot from '@foscia/core/model/snapshots/takeSnapshot';
import { ModelInstance, ModelKey } from '@foscia/core/model/types';
import { Arrayable } from '@foscia/shared';

/**
 * Check if instance changed since last original snapshot capture.
 *
 * @param instance
 * @param only
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { changed } from '@foscia/core';
 *
 * const titleChanged = changed(post, ['title']);
 * if (titleChanged) {
 * }
 * ```
 */
export default <I extends ModelInstance>(
  instance: I,
  only?: Arrayable<ModelKey<I>>,
) => !isSameSnapshot(
  takeSnapshot(instance),
  instance.$original,
  only,
);
