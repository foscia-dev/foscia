import { Model } from '@foscia/core/model/types';

export default (
  model: Model,
  nextValue: unknown,
  prevValue: unknown,
) => (
  model.$config.compareValue
    ? model.$config.compareValue(nextValue, prevValue)
    : nextValue === prevValue
);
