import { ModelClass } from '@foscia/core/model/types';

export default <T>(model: ModelClass, value: T) => (
  model.$config.cloneValue
    ? model.$config.cloneValue(value)
    : value
);
