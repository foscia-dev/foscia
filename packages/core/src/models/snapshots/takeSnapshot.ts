import FosciaError from '@foscia/core/errors/fosciaError';
import isModelRelation from '@foscia/core/models/definition/utilities/isModelRelation';
import { isInstance } from '@foscia/core/models/index';
import strictOf from '@foscia/core/models/internals/strictOf';
import captureSnapshotValue from '@foscia/core/models/snapshots/internals/captureSnapshotValue';
import takeShallowSnapshot from '@foscia/core/models/snapshots/takeShallowSnapshot';
import { ModelInstance, ModelSnapshot } from '@foscia/core/models/types';
import { SYMBOL_MODEL_SNAPSHOT } from '@foscia/core/symbols';

/**
 * Capture a snapshot of the instance.
 *
 * @param instance
 * @param prevSnapshots
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
export default function takeFullSnapshot<I extends ModelInstance>(
  instance: I,
  prevSnapshots: ModelSnapshot[] = [],
): ModelSnapshot<I> {
  const snapshot = {
    $FOSCIA_TYPE: SYMBOL_MODEL_SNAPSHOT,
    original: instance.$original ?? null,
    instance,
    exists: instance.$exists,
    raw: instance.$raw,
    loaded: new Set(strictOf(instance).$loaded),
    values: new Map(),
  } as const;

  const takeSnapshot = <R extends ModelInstance>(related: R, holder: ModelInstance) => {
    const relatedSnapshot = prevSnapshots.find(
      (p): p is ModelSnapshot<R> => p.instance === related,
    );
    if (relatedSnapshot) {
      return relatedSnapshot;
    }

    return (holder.$model.$config.limitedSnapshots ?? true)
      ? takeShallowSnapshot(related)
      : takeFullSnapshot(related, [...prevSnapshots, snapshot]);
  };

  strictOf(instance).$model.$schema.values().forEach((prop) => {
    const value = captureSnapshotValue(instance, prop);
    if (value !== undefined) {
      const captureInstanceSnapshot = (related: unknown) => {
        if (isInstance(related)) {
          return takeSnapshot(related, instance);
        }

        throw new FosciaError('Non-instance relation\'s value found in instance.');
      };

      const captureValue = () => {
        if (value && isModelRelation(prop)) {
          return Array.isArray(value)
            ? value.map((v) => captureInstanceSnapshot(v))
            : captureInstanceSnapshot(value);
        }

        return value;
      };

      snapshot.values.set(prop.key, captureValue());
    }
  });

  return snapshot;
}
