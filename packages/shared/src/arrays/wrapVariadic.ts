import { ArrayableVariadic } from '@foscia/shared/types';

export default function wrapVariadic<T>(...values: ArrayableVariadic<T>): T[] {
  if (values.length === 1) {
    if (Array.isArray(values[0])) {
      return wrapVariadic(...values[0]);
    }

    return [values[0]];
  }

  return values as T[];
}
