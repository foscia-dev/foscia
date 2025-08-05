import { ModelTransformableProp } from '@foscia/core/models/types';
import isTransformer from '@foscia/core/transformers/isTransformer';

/**
 * Transform a property's value.
 *
 * @param prop
 * @param value
 * @param action
 *
 * @internal
 */
export default function transformProp<
  T,
  A extends 'serialize' | 'deserialize',
  P extends {} | ModelTransformableProp<T>,
>(
  prop: P,
  value: T,
  action: A,
): T | (T extends 'serialize' ? unknown : T) {
  if ('transformer' in prop && isTransformer(prop.transformer)) {
    return prop.transformer[action](value) as any;
  }

  return value;
}
