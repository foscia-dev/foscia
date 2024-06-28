import { ModelClass } from '@foscia/core/model/types';

export default (
  model: ModelClass,
  nextValue: unknown,
  prevValue: unknown,
) => (
  model.$config.compareValue
    ? model.$config.compareValue(nextValue, prevValue)
    : nextValue === prevValue
);
