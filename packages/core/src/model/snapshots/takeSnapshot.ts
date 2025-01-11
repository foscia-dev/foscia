import cloneModelValue from '@foscia/core/model/snapshots/cloneModelValue';
import { ModelInstance, ModelSnapshot, ModelValues } from '@foscia/core/model/types';
import { mapWithKeys, using } from '@foscia/shared';

/**
 * Capture a snapshot of the instance.
 *
 * @param instance
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { takeSnapshot } from '@foscia/core';
 *
 * const snapshot = takeSnapshot(post);
 * ```
 */
export default <I extends ModelInstance>(
  instance: I,
): ModelSnapshot<I> => ({
  $instance: instance,
  $exists: instance.$exists,
  $raw: instance.$raw,
  $loaded: { ...instance.$loaded },
  $values: mapWithKeys(instance.$values, (value, key) => using(
    cloneModelValue(instance.$model, value),
    (clonedValue) => (clonedValue !== undefined ? { [key]: clonedValue } : {}),
  )) as Partial<ModelValues<I>>,
});
