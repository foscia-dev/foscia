import relation, {
  PendingModelRelation,
  PendingModelRelationConfig,
  PendingModelRelationInstance,
} from '@foscia/core/model/props/builders/relation';
import { Model, ModelInstance, ModelRelationConfig } from '@foscia/core/model/types';
import { SYMBOL_MODEL_RELATION_HAS_MANY } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

function hasMany<I extends ModelInstance[] | null = ModelInstance[]>(
  config?: string | string[] | ModelRelationConfig,
): PendingModelRelation<I, false>;
function hasMany<M extends Model | Model[]>(
  resolver: () => Awaitable<M>,
): PendingModelRelation<PendingModelRelationInstance<M>[], false>;

function hasMany(config?: PendingModelRelationConfig) {
  return relation(SYMBOL_MODEL_RELATION_HAS_MANY, config) as any;
}

export default hasMany;
