import { ModelInstance, ModelProp, ModelPropSync } from '@foscia/core/models/types';

/**
 * Check if a property should be synced for a given context.
 *
 * @param prop
 * @param context
 *
 * @internal
 */
export default function shouldSyncProp<T, I extends ModelInstance>(
  prop: ModelProp<T, I>,
  context: ModelPropSync,
) {
  return !('sync' in prop)
    || typeof prop.sync !== 'string'
    || prop.sync === context;
}
