import restoreSnapshot from '@foscia/core/model/snapshots/restoreSnapshot';
import { ModelInstance, ModelKey } from '@foscia/core/model/types';
import { ArrayableVariadic } from '@foscia/shared';

export default function restore<I extends ModelInstance>(
  instance: I,
  ...only: ArrayableVariadic<ModelKey<I>>
) {
  restoreSnapshot(instance, instance.$original, ...only);

  return instance;
}
