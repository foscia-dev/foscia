import { ModelPropSync, RawModelProp } from '@foscia/core/model/types';

export default (def: RawModelProp, actions: ModelPropSync[]) => (
  typeof def.sync === 'string'
    ? actions.indexOf(def.sync) !== -1
    : (def.sync ?? true)
);
