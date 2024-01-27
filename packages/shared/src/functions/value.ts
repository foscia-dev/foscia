import { Value } from '@foscia/shared/types';

export default function value<T>(
  valueOrCallback: T,
): Value<T> {
  if (typeof valueOrCallback === 'function') {
    return valueOrCallback();
  }

  return valueOrCallback as Value<T>;
}
