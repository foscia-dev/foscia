import isRelationDef from '@foscia/core/model/props/checks/isRelationDef';
import { ModelInstance, ModelLimitedSnapshot, ModelSnapshot } from '@foscia/core/model/types';
import { Arrayable, isNil, mapWithKeys, using } from '@foscia/shared';

const captureSnapshotRelation = (
  instance: ModelInstance,
  value: Arrayable<ModelInstance>,
  takeSnapshot: (
    related: ModelInstance,
    parent: ModelInstance,
  ) => ModelSnapshot | ModelLimitedSnapshot,
) => (
  Array.isArray(value)
    ? value.map((v) => takeSnapshot(v, instance))
    : takeSnapshot(value, instance)
);

const captureSnapshotValue = (
  instance: ModelInstance,
  key: string,
  value: unknown,
  takeSnapshot: (
    related: ModelInstance,
    parent: ModelInstance,
  ) => ModelSnapshot | ModelLimitedSnapshot,
) => using(
  instance.$model.$config.cloneSnapshotValue(value),
  (clone) => using(instance.$model.$schema[key], (def) => (
    isRelationDef(def) && !isNil(clone)
      ? captureSnapshotRelation(instance, clone as Arrayable<ModelInstance>, takeSnapshot)
      : clone
  )),
);

export default (
  instance: ModelInstance,
  takeSnapshot: (
    related: ModelInstance,
    parent: ModelInstance,
  ) => ModelSnapshot | ModelLimitedSnapshot,
  only?: string[],
) => mapWithKeys(
  instance.$values,
  (value, key) => (
    !only || only.indexOf(key) !== -1 ? using(
      captureSnapshotValue(instance, key, value, takeSnapshot),
      (snapshot) => (snapshot !== undefined ? { [key]: snapshot } : {}),
    ) : {}
  ),
);
