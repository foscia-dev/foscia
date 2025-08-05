import isModelPrimary from '@foscia/core/models/definition/utilities/isModelPrimary';
import strictOf from '@foscia/core/models/internals/strictOf';
import captureSnapshotValue from '@foscia/core/models/snapshots/internals/captureSnapshotValue';
import { ModelInstance, ModelKey, ModelShallowSnapshot } from '@foscia/core/models/types';
import { SYMBOL_MODEL_SNAPSHOT } from '@foscia/core/symbols';

/**
 * Capture a shallow snapshot of the instance.
 * Snapshot will only contain primary values, and won't capture raw record and loaded state.
 *
 * @param instance
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { takeShallowSnapshot } from '@foscia/core';
 *
 * const snapshot = takeShallowSnapshot(post);
 * ```
 */
export default function takeShallowSnapshot<I extends ModelInstance>(
  instance: I,
): ModelShallowSnapshot<I> {
  return {
    $FOSCIA_TYPE: SYMBOL_MODEL_SNAPSHOT,
    instance,
    exists: instance.$exists,
    values: strictOf(instance).$model.$schema.values().reduce((values, prop) => {
      if (isModelPrimary(prop)) {
        const value = captureSnapshotValue(instance, prop);
        if (value !== undefined) {
          values.set(prop.key, value);
        }
      }

      return values;
    }, new Map<ModelKey<I>, unknown>()),
  };
}
