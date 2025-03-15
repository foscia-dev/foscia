import makeRelationFactory from '@foscia/core/relations/props/makeRelationFactory';
import {
  InferModelRelationInstanceFromModels,
  InferModelRelationInstanceFromTypes,
  ModelHasOneFactory,
  ModelHasOneFactoryConfig,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_RELATION_HAS_ONE } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

export default /* @__PURE__ */ makeRelationFactory(SYMBOL_MODEL_RELATION_HAS_ONE) as {
  /**
   * Create a has one relation property factory with custom model type.
   * Prefer using the model callback or strict type strings signatures.
   *
   * @param type
   * @param config
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
   */<
    T extends object | null = never,
    R extends boolean = false,
  >(
    type: T extends never ? never : string | readonly string[],
    config?: ModelHasOneFactoryConfig<T, R>,
  ): ModelHasOneFactory<T, R>;
  /**
   * Create a has one relation property factory with strict type strings.
   * Recommended when having circular relations.
   * Must be combined with {@link Foscia.CustomTypes | `Foscia.CustomTypes`}
   * namespace overload to work.
   *
   * @param type
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { hasOne } from '@foscia/core';
   *
   * hasOne('posts');
   * hasOne(['posts', 'comments']);
   * hasOne('posts', { readOnly: true });
   * ```
   */<
    T extends string | readonly string[],
    R extends boolean = false,
  >(
    type: T,
    config?: ModelHasOneFactoryConfig<InferModelRelationInstanceFromTypes<T>, R>,
  ): ModelHasOneFactory<InferModelRelationInstanceFromTypes<T>, R>;
  /**
   * Create a has one relation property factory with strict type strings.
   * Recommended when having circular relations.
   * Must be combined with {@link Foscia.CustomTypes | `Foscia.CustomTypes`}
   * namespace overload to work.
   *
   * @param type
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { hasOne } from '@foscia/core';
   *
   * hasOne('posts', { nullable: true });
   * hasOne(['posts', 'comments'], { nullable: true });
   * hasOne('posts', { nullable: true, readOnly: true });
   * ```
   */<
    T extends string | readonly string[],
    R extends boolean = false,
  >(
    type: T,
    config: ModelHasOneFactoryConfig<InferModelRelationInstanceFromTypes<T>, R> & {
      nullable: true;
    },
  ): ModelHasOneFactory<InferModelRelationInstanceFromTypes<T> | null, R>;
  /**
   * Create a has one relation property factory with a model resolver callback.
   * Recommended when not having circular references.
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
    // eslint-disable-next-line max-len
    T extends InferModelRelationInstanceFromModels<M> = InferModelRelationInstanceFromModels<M>,
    R extends boolean = false,
  >(
    resolver: () => Awaitable<M>,
    config?: ModelHasOneFactoryConfig<T, R>,
  ): ModelHasOneFactory<T, R>;
  /**
   * Create a has one relation property factory with a model resolver callback.
   * Recommended when not having circular references.
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
   * hasOne(() => Post, { nullable: true });
   * hasOne(() => [Post, Comment], { nullable: true });
   * hasOne(() => Post, { nullable: true, readOnly: true });
   * ```
   */<
    M extends object | readonly object[],
    // eslint-disable-next-line max-len
    T extends InferModelRelationInstanceFromModels<M> | null = InferModelRelationInstanceFromModels<M> | null,
    R extends boolean = false,
  >(
    resolver: () => Awaitable<M>,
    config: ModelHasOneFactoryConfig<T, R> & { nullable: true; },
  ): ModelHasOneFactory<T, R>;
};
