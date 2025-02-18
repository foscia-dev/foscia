import isInstance from '@foscia/core/model/checks/isInstance';
import { isNil } from '@foscia/shared';

/**
 * Check if given value are the same instance of model.
 *
 * @param value
 * @param otherValue
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { isSame } from '@foscia/core';
 *
 * if (isSame(fooPost, barPost)) {
 * }
 * ```
 *
 * @remarks
 * Instances values are not checked, only the model type and the ID.
 */
export default (
  value: unknown,
  otherValue: unknown,
): boolean => isInstance(value) && isInstance(otherValue) && (value === otherValue || (
  value.$model.$type === otherValue.$model.$type
  && !isNil(value.id)
  && value.id === otherValue.id
));
