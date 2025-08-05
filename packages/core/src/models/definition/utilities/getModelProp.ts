import { Model, ModelInstance, ModelKey, ModelProp } from '@foscia/core/models/types';

/**
 * Get a model property from a model.
 *
 * @param model
 * @param key
 *
 * @category Utilities
 */
export default function getModelProp<
  I extends ModelInstance,
  K extends string,
>(
  model: Model<I>,
  key: K,
): K extends ModelKey<I> ? ModelProp<I[K], I> : null {
  if (model.$schema.has(key)) {
    // @ts-expect-error
    return model.$schema.get(key)!;
  }

  // @ts-expect-error
  return null;
}
