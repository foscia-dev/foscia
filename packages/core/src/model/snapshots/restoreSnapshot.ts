/* eslint-disable no-param-reassign */
import isPropDef from '@foscia/core/model/checks/isPropDef';
import isRelationDef from '@foscia/core/model/checks/isRelationDef';
import forceFill from '@foscia/core/model/forceFill';
import mapProps from '@foscia/core/model/props/mappers/mapProps';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import {
  ModelInstance,
  ModelKey,
  ModelLimitedSnapshot,
  ModelProp,
  ModelSnapshot,
  ModelValues,
} from '@foscia/core/model/types';
import { Arrayable, ArrayableVariadic, isNil, tap, wrapVariadic } from '@foscia/shared';

const restoreSnapshotRelation = (
  value: Arrayable<ModelSnapshot | ModelLimitedSnapshot>,
) => (
  Array.isArray(value)
    ? value.map((v) => v.$instance)
    : value.$instance
);

const restoreSnapshotValue = (
  snapshot: ModelSnapshot,
  def: ModelProp,
) => snapshot.$instance.$model.$config.cloneSnapshotValue(
  isRelationDef(def) && !isNil(snapshot.$values[def.key])
    ? restoreSnapshotRelation(snapshot.$values[def.key])
    : snapshot.$values[def.key],
);

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

  const restoreForDef = (def: ModelProp) => {
    if (keys.length && keys.indexOf(def.key as ModelKey<I>) === -1) {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(snapshot.$values, def.key)) {
      forceFill(instance, {
        [def.key]: restoreSnapshotValue(snapshot, def),
      } as Partial<ModelValues<I>>);
    } else {
      delete instance.$values[def.key];
    }
  };

  mapProps(instance.$model, restoreForDef, isPropDef as any);
  markSynced(instance, ...only);
});
