import relation from '@foscia/core/model/props/builders/relation';
import {
  InferModelRelationFactoryInstance,
  ModelRelationFactory,
  ModelRelationFactoryConfig,
} from '@foscia/core/model/props/builders/types';
import { ModelInstance, ModelRelationConfig } from '@foscia/core/model/types';
import { SYMBOL_MODEL_RELATION_HAS_ONE } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

const hasOne: {
  /**
   * Create a has one relation property factory.
   *
   * @param config
   *
   * @category Factories
   */<I extends object | null = ModelInstance>(
    config?: string | string[] | ModelRelationConfig,
  ): ModelRelationFactory<I, false>;
  /**
   * Create a has one relation property factory.
   *
   * @param resolver
   *
   * @category Factories
   */<M extends object | object[]>(
    resolver: () => Awaitable<M>,
  ): ModelRelationFactory<InferModelRelationFactoryInstance<M>, false>;
} = (
  config?: ModelRelationFactoryConfig,
) => relation(SYMBOL_MODEL_RELATION_HAS_ONE, config) as any;

export default hasOne;
