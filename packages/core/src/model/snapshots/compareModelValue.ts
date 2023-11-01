import { ModelClass } from '@foscia/core/model/types';

export default function compareModelValue(
  model: ModelClass,
  nextValue: unknown,
  prevValue: unknown,
) {
  return model.$config.compareValue
    ? model.$config.compareValue(nextValue, prevValue)
    : nextValue === prevValue;
}
