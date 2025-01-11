import { Model } from '@foscia/core/model/types';

/**
 * Compare values using configured comparator.
 *
 * @param model
 * @param nextValue
 * @param prevValue
 *
 * @internal
 */
export default (
  model: Model,
  nextValue: unknown,
  prevValue: unknown,
) => (
  model.$config.compareValue
    ? model.$config.compareValue(nextValue, prevValue)
    : nextValue === prevValue
);
