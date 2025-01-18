import isNil from '@foscia/shared/checks/isNil';
import { Awaitable } from '@foscia/shared/types';

/**
 * Map an optional arrayable value.
 *
 * @param value
 * @param callback
 *
 * @internal
 */
export default async <T, U>(
  value: T[] | T,
  callback: (value: NonNullable<T>) => Awaitable<U>,
) => {
  if (Array.isArray(value)) {
    return Promise.all(value.map((v) => callback(v as NonNullable<T>)));
  }

  return isNil(value) ? value : callback(value as NonNullable<T>);
};
