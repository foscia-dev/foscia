import { Model } from '@foscia/core/model/types';

/**
 * Clone a value using configured cloner.
 *
 * @param model
 * @param value
 *
 * @internal
 */
export default <T>(model: Model, value: T) => (
  model.$config.cloneValue
    ? model.$config.cloneValue(value)
    : value
);
