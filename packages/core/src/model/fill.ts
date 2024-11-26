import { ModelInstance, ModelKey, ModelWritableValues } from '@foscia/core/model/types';

/**
 * Fill the instance with given values.
 *
 * @param instance
 * @param values
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { fill } from '@foscia/core';
 *
 * const post = fill(new Post(), { title: 'Hello', description: 'World' });
 * ```
 */
export default <I extends ModelInstance>(
  instance: I,
  values: Partial<ModelWritableValues<I>>,
) => {
  Object.entries(values).forEach(([key, value]) => {
    // eslint-disable-next-line no-param-reassign
    instance[key as ModelKey<I>] = value as any;
  });

  return instance;
};
