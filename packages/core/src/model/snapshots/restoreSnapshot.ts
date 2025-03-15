/* eslint-disable no-param-reassign */
import isRelation from '@foscia/core/model/props/checks/isRelation';
import isValueProp from '@foscia/core/model/props/checks/isValueProp';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import {
  ModelInstance,
  ModelKey,
  ModelLimitedSnapshot,
  ModelProp,
  ModelSnapshot,
  ModelValues,
} from '@foscia/core/model/types';
import forceFill from '@foscia/core/model/utilities/forceFill';
import { Arrayable, isNil, tap, wrap } from '@foscia/shared';

const restoreSnapshotRelation = (
  value: Arrayable<ModelSnapshot | ModelLimitedSnapshot>,
) => (
  Array.isArray(value)
    ? value.map((v) => v.$instance)
    : value.$instance
);

const restoreSnapshotValue = (
  snapshot: ModelSnapshot,
  prop: ModelProp,
) => snapshot.$instance.$model.$config.cloneSnapshotValue(
  isRelation(prop) && !isNil(snapshot.$values[prop.key])
    ? restoreSnapshotRelation(snapshot.$values[prop.key])
    : snapshot.$values[prop.key],
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
  only?: Arrayable<ModelKey<I>>,
) => tap(instance, () => {
  const keys = wrap(only);

  if (!keys.length) {
    instance.$exists = snapshot.$exists;
    instance.$raw = snapshot.$raw;
    instance.$loaded = snapshot.$loaded;
  }

  Object.values(instance.$model.$schema).forEach((prop) => {
    if (
      !isValueProp(prop)
      || (keys.length && keys.indexOf(prop.key as ModelKey<I>) === -1)
    ) {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(snapshot.$values, prop.key)) {
      forceFill(instance, {
        [prop.key]: restoreSnapshotValue(snapshot, prop),
      } as Partial<ModelValues<I>>);
    } else {
      delete instance.$values[prop.key];
    }
  });

  markSynced(instance, only);
});
