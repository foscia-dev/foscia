import relation, {
  PendingModelRelation,
  PendingModelRelationTo,
} from '@foscia/core/model/props/builders/relation';
import { ModelInstance } from '@foscia/core/model/types';
import { SYMBOL_MODEL_RELATION_HAS_MANY } from '@foscia/core/symbols';

export default function hasMany<I extends ModelInstance>(
  config?: PendingModelRelationTo<I[]>,
): PendingModelRelation<I[], false> {
  return relation<I[]>(SYMBOL_MODEL_RELATION_HAS_MANY, config);
}
