/* eslint-disable no-param-reassign */
import forceFill from '@foscia/core/model/forceFill';
import mapProps from '@foscia/core/model/props/mappers/mapProps';
import cloneModelValue from '@foscia/core/model/snapshots/cloneModelValue';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import {
  ModelAttribute,
  ModelId,
  ModelInstance,
  ModelKey,
  ModelRelation,
  ModelSnapshot,
  ModelValues,
} from '@foscia/core/model/types';
import { ArrayableVariadic, wrapVariadic } from '@foscia/shared';

export default function restoreSnapshot<I extends ModelInstance>(
  instance: I,
  snapshot: ModelSnapshot<I>,
  ...only: ArrayableVariadic<ModelKey<I>>
) {
  const keys = wrapVariadic(...only);

  if (!keys.length) {
    instance.$exists = snapshot.$exists;
    instance.$raw = snapshot.$raw;
    instance.$loaded = snapshot.$loaded;
  }

  const restoreForDef = <K extends ModelKey<I>>(
    def: ModelId<K> | ModelAttribute<K> | ModelRelation<K>,
  ) => {
    if (keys.length && keys.indexOf(def.key) === -1) {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(snapshot.$values, def.key)) {
      forceFill(instance, {
        [def.key]: cloneModelValue(instance.$model, snapshot.$values[def.key]),
      } as Partial<ModelValues<I>>);
    } else {
      delete instance.$values[def.key];
    }
  };

  mapProps(instance, restoreForDef);
  markSynced(instance, ...only);

  return instance;
}
