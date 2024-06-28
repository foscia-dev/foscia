import isNil from '@foscia/shared/checks/isNil';
import { Arrayable, Optional } from '@foscia/shared/types';

export default <T>(value?: Optional<Arrayable<T>>): T[] => {
  if (isNil(value)) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};
