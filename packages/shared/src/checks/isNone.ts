import isNil from '@foscia/shared/checks/isNil';
import { Optional } from '@foscia/shared/types';

export default function isNone(value: unknown): value is Optional<''> {
  return isNil(value) || value === '';
}
