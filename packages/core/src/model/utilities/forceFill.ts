/* eslint-disable no-param-reassign */
import fill from '@foscia/core/model/utilities/fill';
import { ModelInstance, ModelValues } from '@foscia/core/model/types';

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
) => {
  const { strictReadOnly } = instance.$model.$config;

  try {
    instance.$model.$config.strictReadOnly = false;

    return fill(instance, values as any);
  } finally {
    instance.$model.$config.strictReadOnly = strictReadOnly;
  }
};
