import relation, {
  PendingModelRelation,
  PendingModelRelationTo,
} from '@foscia/core/model/props/builders/relation';
import { ModelInstance } from '@foscia/core/model/types';
import { SYMBOL_MODEL_RELATION_HAS_ONE } from '@foscia/core/symbols';

export default function hasOne<I extends ModelInstance | null>(
  config?: PendingModelRelationTo<I>,
): PendingModelRelation<I, false> {
  return relation<I>(SYMBOL_MODEL_RELATION_HAS_ONE, config);
}
