import { Value } from '@foscia/shared/types';

export default function value<T>(
  valueOrCallback: T,
  ...args: T extends ((...args: any[]) => any) ? Parameters<T> : never[]
): Value<T> {
  if (typeof valueOrCallback === 'function') {
    return valueOrCallback(...args);
  }

  return valueOrCallback as Value<T>;
}
