import { ModelRelation } from '@foscia/core/model/types';
import { SYMBOL_MODEL_RELATION_HAS_MANY } from '@foscia/core/symbols';

export default function isPluralRelationDef(def: ModelRelation): boolean {
  return def.$RELATION_TYPE === SYMBOL_MODEL_RELATION_HAS_MANY;
}
