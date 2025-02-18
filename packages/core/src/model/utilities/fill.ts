import { ModelInstance, ModelKey, ModelValues, ModelWritableKey } from '@foscia/core/model/types';
import { tap } from '@foscia/shared';

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
  values: Partial<Pick<ModelValues<I>, ModelWritableKey<I>>>,
) => tap(instance, () => {
  Object.entries(values).forEach(([key, value]) => {
    // eslint-disable-next-line no-param-reassign
    instance[key as ModelKey<I>] = value as any;
  });
});
