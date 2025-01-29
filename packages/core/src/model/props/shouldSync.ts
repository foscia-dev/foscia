import { ModelProp, ModelPropSync } from '@foscia/core/model/types';

/**
 * Check if a value property should be synced depending on the current action.
 *
 * @param def
 * @param actions
 *
 * @internal
 */
export default (def: ModelProp, actions: ModelPropSync[]) => (
  typeof def.sync === 'string'
    ? actions.indexOf(def.sync) !== -1
    : (def.sync ?? true)
);
