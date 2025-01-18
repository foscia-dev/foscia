import takeLimitedSnapshot from '@foscia/core/model/snapshots/takeLimitedSnapshot';
import captureSnapshotValues from '@foscia/core/model/snapshots/utilities/captureSnapshotValues';
import { ModelInstance, ModelSnapshot, ModelSnapshotValues } from '@foscia/core/model/types';
import { SYMBOL_MODEL_SNAPSHOT } from '@foscia/core/symbols';

const takeFullSnapshot = <I extends ModelInstance>(
  instance: I,
  parents: ModelSnapshot[] = [],
) => {
  const snapshot: ModelSnapshot<I> = {
    $FOSCIA_TYPE: SYMBOL_MODEL_SNAPSHOT,
    $instance: instance,
    $exists: instance.$exists,
    $raw: instance.$raw,
    $loaded: { ...instance.$loaded },
    $values: {},
  };

  // @ts-ignore
  snapshot.$values = captureSnapshotValues(instance, (related, parent) => (
    parents.find(({ $instance }) => $instance === related) ?? (
      (parent.$model.$config.limitedSnapshots ?? true)
        ? takeLimitedSnapshot(related)
        : takeFullSnapshot(related, [...parents, snapshot])
    )
  )) as ModelSnapshotValues<I>;

  return snapshot;
};

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
export default <I extends ModelInstance>(instance: I) => takeFullSnapshot(instance);
