import { ArrayableVariadic } from '@foscia/shared/types';

export default <T>(...values: ArrayableVariadic<T>): T[] => (
  values.length === 1 && Array.isArray(values[0]) ? values[0] : values as T[]
);
