import relation from '@foscia/core/model/props/relation';
import {
  InferModelRelationFactoryInstance,
  ModelInstance,
  ModelRelationFactory,
  ModelRelationFactoryConfig,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_RELATION_HAS_ONE } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

export default /* @__PURE__ */ relation(SYMBOL_MODEL_RELATION_HAS_ONE) as {
  /**
   * Create a has one relation property factory.
   * Recommended when having circular relations.
   *
   * @param type
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { hasOne } from '@foscia/core';
   *
   * hasOne<Post>();
   * hasOne<Post>('posts');
   * hasOne<Post | Comment>(['posts', 'comments']);
   * ```
   */<T extends object | null = ModelInstance, R extends boolean = false>(
    type?: string | string[] | ModelRelationFactoryConfig<T, R>,
  ): ModelRelationFactory<T, R>;
  /**
   * Create a has one relation property factory.
   * Recommended in most circumstances.
   *
   * @param resolver
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { hasOne } from '@foscia/core';
   *
   * hasOne(() => Post);
   * hasOne(() => [Post, Comment]);
   * hasOne(() => Post, { readOnly: true });
   * ```
   */<
    M extends object | readonly object[],
    T extends InferModelRelationFactoryInstance<M> | null = InferModelRelationFactoryInstance<M>,
    R extends boolean = false,
  >(
    resolver: () => Awaitable<M>,
    config?: ModelRelationFactoryConfig<T, R>,
  ): ModelRelationFactory<T, R>;
};
