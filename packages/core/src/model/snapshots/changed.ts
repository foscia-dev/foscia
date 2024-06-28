import compareSnapshots from '@foscia/core/model/snapshots/compareSnapshots';
import takeSnapshot from '@foscia/core/model/snapshots/takeSnapshot';
import { ModelInstance, ModelKey } from '@foscia/core/model/types';
import { ArrayableVariadic } from '@foscia/shared';

export default <I extends ModelInstance>(
  instance: I,
  ...only: ArrayableVariadic<ModelKey<I>>
) => !compareSnapshots(
  takeSnapshot(instance),
  instance.$original,
  ...only,
);
