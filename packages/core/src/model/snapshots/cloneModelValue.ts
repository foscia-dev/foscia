import { ModelClass } from '@foscia/core/model/types';

export default function cloneModelValue<T>(model: ModelClass, value: T) {
  return model.$config.cloneValue
    ? model.$config.cloneValue(value)
    : value;
}
