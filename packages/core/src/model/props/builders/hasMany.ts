import relation from '@foscia/core/model/props/builders/relation';
import {
  InferModelRelationFactoryInstance,
  ModelRelationFactory,
  ModelRelationFactoryConfig,
} from '@foscia/core/model/props/builders/types';
import { ModelInstance } from '@foscia/core/model/types';
import { SYMBOL_MODEL_RELATION_HAS_MANY } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

export default /* @__PURE__ */ relation(SYMBOL_MODEL_RELATION_HAS_MANY) as {
  /**
   * Create a has many relation property factory.
   * Recommended when having circular relations.
   *
   * @param type
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { hasMany } from '@foscia/core';
   *
   * hasMany<Post[]>();
   * hasMany<Post[]>('posts');
   * hasMany<(Post | Comment)[]>(['posts', 'comments']);
   * ```
   */<T extends object[] | null = ModelInstance[], R extends boolean = false>(
    type?: string | string[] | ModelRelationFactoryConfig<T, R>,
  ): ModelRelationFactory<T, R>;
  /**
   * Create a has many relation property factory.
   * Recommended in most circumstances.
   *
   * @param resolver
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { hasMany } from '@foscia/core';
   *
   * hasMany(() => Post);
   * hasMany(() => [Post, Comment]);
   * hasMany(() => Post, { readOnly: true });
   * ```
   */<
    M extends object | readonly object[],
    T extends InferModelRelationFactoryInstance<M>[] = InferModelRelationFactoryInstance<M>[],
    R extends boolean = false,
  >(
    resolver: () => Awaitable<M>,
    config?: ModelRelationFactoryConfig<T, R>,
  ): ModelRelationFactory<T, R>;
};
