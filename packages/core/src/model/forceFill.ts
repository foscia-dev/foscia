/* eslint-disable no-param-reassign */
import fill from '@foscia/core/model/fill';
import { ModelInstance, ModelValues } from '@foscia/core/model/types';

export default function forceFill<I extends ModelInstance>(
  instance: I,
  values: Partial<ModelValues<I>>,
) {
  const { strictReadonly } = instance.$model.$config;

  try {
    instance.$model.$config.strictReadonly = false;

    return fill(instance, values);
  } finally {
    instance.$model.$config.strictReadonly = strictReadonly;
  }
}
