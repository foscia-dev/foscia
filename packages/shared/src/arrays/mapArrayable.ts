import isNil from '@foscia/shared/checks/isNil';
import { Arrayable, Awaitable, Optional } from '@foscia/shared/types';

export default async function mapArrayable<T, U>(
  value: Optional<Arrayable<T>>,
  callback: (value: T) => Awaitable<U>,
) {
  if (Array.isArray(value)) {
    return Promise.all(value.map((v) => callback(v)));
  }

  if (!isNil(value)) {
    return callback(value);
  }

  return value;
}
