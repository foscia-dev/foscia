import isNil from '@foscia/shared/checks/isNil';
import { Arrayable, Awaitable, Optional } from '@foscia/shared/types';

/**
 * Map an optional arrayable value.
 *
 * @param value
 * @param callback
 *
 * @internal
 */
export default async <T, U>(
  value: Optional<Arrayable<T>>,
  callback: (value: T) => Awaitable<U>,
) => {
  if (Array.isArray(value)) {
    return Promise.all(value.map((v) => callback(v)));
  }

  return isNil(value) ? value : callback(value);
};
