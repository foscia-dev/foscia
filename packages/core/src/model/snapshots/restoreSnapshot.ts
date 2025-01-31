/* eslint-disable no-param-reassign */
import isPropDef from '@foscia/core/model/checks/isPropDef';
import forceFill from '@foscia/core/model/forceFill';
import mapProps from '@foscia/core/model/props/mappers/mapProps';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import {
  ModelInstance,
  ModelKey,
  ModelSnapshot,
  ModelValueProp,
  ModelValues,
} from '@foscia/core/model/types';
import { ArrayableVariadic, tap, wrapVariadic } from '@foscia/shared';

/**
 * Restore a specific snapshot on instance.
 *
 * @param instance
 * @param snapshot
 * @param only
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { restoreSnapshot } from '@foscia/core';
 *
 * restoreSnapshot(post, veryOldSnapshot, ['title']);
 * ```
 */
export default <I extends ModelInstance>(
  instance: I,
  snapshot: ModelSnapshot<I>,
  ...only: ArrayableVariadic<ModelKey<I>>
) => tap(instance, () => {
  const keys = wrapVariadic(...only);

  if (!keys.length) {
    instance.$exists = snapshot.$exists;
    instance.$raw = snapshot.$raw;
    instance.$loaded = snapshot.$loaded;
  }

  const restoreForDef = (def: ModelValueProp<ModelKey<I>>) => {
    if (keys.length && keys.indexOf(def.key) === -1) {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(snapshot.$values, def.key)) {
      forceFill(instance, {
        [def.key]: instance.$model.$config.cloneValue(snapshot.$values[def.key]),
      } as Partial<ModelValues<I>>);
    } else {
      delete instance.$values[def.key];
    }
  };

  mapProps(instance.$model, restoreForDef, isPropDef as any);
  markSynced(instance, ...only);
});
