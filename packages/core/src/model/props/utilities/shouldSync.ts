import { ModelProp, ModelPropSync } from '@foscia/core/model/types';

/**
 * Check if a value property should be synced depending on the current action.
 *
 * @param def
 * @param action
 *
 * @internal
 */
export default (def: ModelProp, action: ModelPropSync) => (
  typeof def.sync === 'string'
    ? action === def.sync
    : (def.sync ?? true)
);
