import isInstance from '@foscia/core/models/definition/utilities/isInstance';
import isModelPrimary from '@foscia/core/models/definition/utilities/isModelPrimary';

/**
 * Check if given value are the same instance of model.
 *
 * @param value
 * @param against
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
 * Instances values are not checked, only the model and the primary properties.
 */
export default function isSame(
  value: unknown,
  against: unknown,
): boolean {
  if (value === against) {
    return true;
  }

  return isInstance(value) && isInstance(against)
    && value.$model === against.$model
    && value.$model.$schema.values().every(
      (prop) => !isModelPrimary(prop) || prop.get(value) === prop.get(against),
    );
}
