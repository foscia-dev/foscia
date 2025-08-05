import { ModelTransformableProp } from '@foscia/core/models/types';

/**
 * Transform a property's value.
 *
 * @param prop
 * @param value
 *
 * @internal
 */
export default async function serializeProp<T, SerializationResult = T>(
  prop: ModelTransformableProp<T, unknown, SerializationResult>,
  value: T,
): Promise<SerializationResult> {
  if (prop.transformer) {
    return prop.transformer.serialize(value);
  }

  return value as unknown as SerializationResult;
}
