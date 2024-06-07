import forceFill from '@foscia/core/model/forceFill';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import { ModelInstance, ModelRelationKey } from '@foscia/core/model/types';

export default function loadUsingValue<I extends ModelInstance>(
  instance: I,
  relation: ModelRelationKey<I>,
  value: I[ModelRelationKey<I>],
) {
  forceFill(instance, { [relation]: value } as any);

  markSynced(instance, relation);
}
