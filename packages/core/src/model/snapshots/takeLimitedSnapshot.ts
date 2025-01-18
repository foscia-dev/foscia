import captureSnapshotValues from '@foscia/core/model/snapshots/utilities/captureSnapshotValues';
import {
  ModelInstance,
  ModelLimitedSnapshot,
  ModelLimitedSnapshotValues,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_SNAPSHOT } from '@foscia/core/symbols';

/**
 * Capture a limited snapshot of the instance.
 * Snapshot will only contain ID and LID values, and won't capture
 * raw record and loaded state.
 *
 * @param instance
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { takeLimitedSnapshot } from '@foscia/core';
 *
 * const snapshot = takeLimitedSnapshot(post);
 * ```
 */
const takeLimitedSnapshot = <I extends ModelInstance>(
  instance: I,
): ModelLimitedSnapshot<I> => ({
  $FOSCIA_TYPE: SYMBOL_MODEL_SNAPSHOT,
  $instance: instance,
  $exists: instance.$exists,
  $values: captureSnapshotValues(
    instance,
    takeLimitedSnapshot,
    ['id', 'lid'],
  ) as ModelLimitedSnapshotValues<I>,
});

export default takeLimitedSnapshot;
