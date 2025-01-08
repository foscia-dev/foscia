import { Model } from '@foscia/core/model/types';

export default <T>(model: Model, value: T) => (
  model.$config.cloneValue
    ? model.$config.cloneValue(value)
    : value
);
