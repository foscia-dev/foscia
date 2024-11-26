import { ModelPropSync, ModelValueProp } from '@foscia/core/model/types';

export default (def: ModelValueProp, actions: ModelPropSync[]) => (
  typeof def.sync === 'string'
    ? actions.indexOf(def.sync) !== -1
    : (def.sync ?? true)
);
