/* eslint-disable no-param-reassign */
import { ModelInstance, ModelKey, ModelWritableValues } from '@foscia/core/model/types';

export default function fill<I extends ModelInstance>(
  instance: I,
  values: Partial<ModelWritableValues<I>>,
) {
  Object.entries(values).forEach(([key, value]) => {
    instance[key as ModelKey<I>] = value as any;
  });

  return instance;
}
