import { ModelInstance, ModelValues } from '@foscia/core/models/types';
import fill from '@foscia/core/models/utilities/fill';

/**
 * Fill the instance with given values even if values are read-only.
 *
 * @param instance
 * @param values
 *
 * @category Utilities
 * @since 0.6.1
 *
 * @example
 * ```typescript
 * import { forceFill } from '@foscia/core';
 *
 * const post = forceFill(new Post(), { author: user });
 * ```
 */
export default <I extends ModelInstance>(
  instance: I,
  values: Partial<ModelValues<I>>,
) => fill(instance, values);
