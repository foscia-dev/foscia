import isNil from '@foscia/shared/checks/isNil';
import { Arrayable } from '@foscia/shared/types';

/**
 * Wrap value to array.
 *
 * @param value
 *
 * @internal
 */
export default <T>(value?: Arrayable<T> | null | undefined): T[] => {
  if (isNil(value)) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};
