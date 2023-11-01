/* eslint-disable no-param-reassign */
import takeSnapshot from '@foscia/core/model/snapshots/takeSnapshot';
import { ModelInstance, ModelKey } from '@foscia/core/model/types';
import { ArrayableVariadic, wrapVariadic } from '@foscia/shared';

export default function markSynced<I extends ModelInstance>(
  instance: I,
  ...only: ArrayableVariadic<ModelKey<I>>
) {
  const snapshot = takeSnapshot(instance);
  const keys = wrapVariadic(...only);
  if (keys.length) {
    keys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(snapshot.$values, key)) {
        instance.$original.$values[key] = snapshot.$values[key];
      } else {
        delete instance.$original.$values[key];
      }
    });
  } else {
    instance.$original = snapshot;
  }

  return instance;
}
