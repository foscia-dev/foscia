import isSameSnapshot from '@foscia/core/models/snapshots/isSameSnapshot';
import takeSnapshot from '@foscia/core/models/snapshots/takeSnapshot';
import { ModelInstance, ModelKey } from '@foscia/core/models/types';
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
export default function changed<I extends ModelInstance>(
  instance: I,
  only?: Arrayable<ModelKey<I>>,
) {
  return !isSameSnapshot(
    takeSnapshot(instance),
    instance.$original,
    only,
  );
}
