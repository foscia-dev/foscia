import { ModelInstance, ModelProp } from '@foscia/core/models/types';

/**
 * Capture a snapshot value.
 *
 * @param instance
 * @param prop
 *
 * @internal
 */
export default function captureSnapshotValue<I extends ModelInstance, T>(
  instance: I,
  prop: ModelProp<T, I>,
) {
  return instance.$model.$config.cloneSnapshotValue(prop.get(instance));
}
