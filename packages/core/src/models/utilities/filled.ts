import isModelPrimary from '@foscia/core/models/definition/utilities/isModelPrimary';
import { ModelInstance } from '@foscia/core/models/types';

/**
 * Check if instance contains any values, even defined as null.
 *
 * @param instance
 *
 * @category Utilities
 * @since 0.9.3
 *
 * @example
 * ```typescript
 * import { filled } from '@foscia/core';
 *
 * if (filled(myPost)) {
 *   /* myPost contains at least one filled value *\/
 * }
 * ```
 *
 * @remarks
 * This can be useful to check if any data has been loaded on an instance from
 * the store. If no attributes or relations are declared on model, it will
 * always return true. Notice that it excludes primary properties.
 */
export default function filled(instance: ModelInstance) {
  return instance.$model.$schema.size === 0
    || instance.$model.$schema.values().some(
      (prop) => !isModelPrimary(prop) || prop.get(instance) !== undefined,
    );
}
