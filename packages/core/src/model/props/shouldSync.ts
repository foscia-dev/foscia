import { RawModelProp, ModelPropSync } from '@foscia/core/model/types';

export default function shouldSync(def: RawModelProp, actions: ModelPropSync[]) {
  return typeof def.sync === 'string'
    ? actions.indexOf(def.sync) !== -1
    : (def.sync ?? true);
}
