import isInstance from '@foscia/core/model/checks/isInstance';
import { isNil } from '@foscia/shared';

export default function isSame(
  value: unknown,
  otherValue: unknown,
): boolean {
  return isInstance(value) && isInstance(otherValue) && (value === otherValue || (
    value.$model.$type === otherValue.$model.$type
    && !isNil(value.id)
    && value.id === otherValue.id
  ));
}
