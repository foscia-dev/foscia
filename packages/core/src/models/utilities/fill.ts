import FosciaError from '@foscia/core/errors/fosciaError';
import getModelProp from '@foscia/core/models/definition/utilities/getModelProp';
import { ModelInstance, ModelMutableValues } from '@foscia/core/models/types';
import { trustedEntries } from '@foscia/shared';

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
export default function fill<I extends ModelInstance>(
  instance: I,
  values: Partial<ModelMutableValues<I>>,
) {
  trustedEntries(values).forEach(([key, value]) => {
    const prop = getModelProp(instance.$model, key);
    if (prop) {
      return prop.set(instance, value);
    }

    throw new FosciaError(`Trying to set non-model property \`${key}\`.`);
  });

  return instance;
}
