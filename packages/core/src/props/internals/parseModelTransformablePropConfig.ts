import { ModelTransformableProp } from '@foscia/core/models/types';
import isTransformer from '@foscia/core/transformers/isTransformer';
import { ObjectTransformer } from '@foscia/core/transformers/types';

/**
 * Parse a transformable model property parameters to a valid config.
 *
 * @param transformer
 * @param config
 *
 * @internal
 */
export default function parseModelTransformablePropConfig<
  T,
  C extends ModelTransformableProp<T, unknown, unknown>,
>(
  config: C,
  transformer?: ObjectTransformer<T, any, any> | Omit<C, 'transformer'>,
): C | undefined {
  return isTransformer<T, any, any>(transformer)
    ? { transformer, ...config }
    : config;
}
