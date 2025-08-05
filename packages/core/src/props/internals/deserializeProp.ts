import { ModelTransformableProp } from '@foscia/core/models/types';

/**
 * Transform a property's value.
 *
 * @param prop
 * @param value
 *
 * @internal
 */
export default async function deserializeProp<T, Deserialized>(
  prop: ModelTransformableProp<T, Deserialized, unknown>,
  value: Deserialized,
): Promise<T> {
  if (prop.transformer) {
    return prop.transformer.deserialize(value);
  }

  return value as unknown as T;
}
