import relation, {
  PendingModelRelation,
  PendingModelRelationConfig,
  PendingModelRelationInstance,
} from '@foscia/core/model/props/builders/relation';
import { Model, ModelInstance, ModelRelationConfig } from '@foscia/core/model/types';
import { SYMBOL_MODEL_RELATION_HAS_ONE } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

function hasOne<I extends ModelInstance | null = ModelInstance>(
  config?: string | string[] | ModelRelationConfig,
): PendingModelRelation<I, false>;
function hasOne<M extends Model | Model[]>(
  resolver: () => Awaitable<M>,
): PendingModelRelation<PendingModelRelationInstance<M>, false>;

function hasOne(config?: PendingModelRelationConfig) {
  return relation(SYMBOL_MODEL_RELATION_HAS_ONE, config) as any;
}

export default hasOne;
