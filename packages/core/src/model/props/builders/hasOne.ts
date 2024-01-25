import relation from '@foscia/core/model/props/builders/relation';
import {
  PendingModelRelation,
  PendingModelRelationConfig,
  PendingModelRelationInstance,
} from '@foscia/core/model/props/builders/types';
import { ModelInstance, ModelRelationConfig } from '@foscia/core/model/types';
import { SYMBOL_MODEL_RELATION_HAS_ONE } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

function hasOne<I extends object | null = ModelInstance>(
  config?: string | string[] | ModelRelationConfig,
): PendingModelRelation<I, false>;
function hasOne<M extends object | object[]>(
  resolver: () => Awaitable<M>,
): PendingModelRelation<PendingModelRelationInstance<M>, false>;

function hasOne(config?: PendingModelRelationConfig) {
  return relation(SYMBOL_MODEL_RELATION_HAS_ONE, config) as any;
}

export default hasOne;
