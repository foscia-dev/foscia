import isRelation from '@foscia/core/model/props/checks/isRelation';
import { ModelInstance, ModelLimitedSnapshot, ModelSnapshot } from '@foscia/core/model/types';
import { Arrayable, isNil, mapWithKeys } from '@foscia/shared';

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
) => {
  const clonedValue = instance.$model.$config.cloneSnapshotValue(value);
  const prop = instance.$model.$schema[key];

  return isRelation(prop) && !isNil(clonedValue)
    ? captureSnapshotRelation(instance, clonedValue as Arrayable<ModelInstance>, takeSnapshot)
    : clonedValue;
};

export default (
  instance: ModelInstance,
  takeSnapshot: (
    related: ModelInstance,
    parent: ModelInstance,
  ) => ModelSnapshot | ModelLimitedSnapshot,
  only?: string[],
) => mapWithKeys(
  instance.$values,
  (value, key) => {
    const snapshotValue = !only || only.indexOf(key) !== -1
      ? captureSnapshotValue(instance, key, value, takeSnapshot)
      : undefined;

    return snapshotValue !== undefined ? { [key]: snapshotValue } : {};
  },
);
