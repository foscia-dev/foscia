import { ModelProp, ModelPropSync } from '@foscia/core/model/types';

/**
 * Check if a value property should be synced depending on the current action.
 *
 * @param prop
 * @param action
 *
 * @internal
 */
export default (prop: ModelProp, action: ModelPropSync) => (
  typeof prop.sync === 'string'
    ? action === prop.sync
    : (prop.sync ?? true)
);
