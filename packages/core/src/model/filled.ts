import { ModelInstance } from '@foscia/core/model/types';

/**
 * Check if instance contains any values, even defined as null.
 *
 * This can be useful to check if any data has been loaded on an instance from
 * the store. If no attributes or relations are declared on model, it will
 * always return true. Notice that it excludes ID and LID from checked values.
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
 */
export default (instance: ModelInstance) => Object.keys(instance.$model.$schema).length <= 2
  || Object.keys(instance.$values).some(
    (key) => (key !== 'id' && key !== 'lid' && instance.$values[key] !== undefined),
  );
