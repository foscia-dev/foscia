import makeRelationFactory from '@foscia/core/relations/props/makeRelationFactory';
import {
  InferModelRelationInstanceFromModels,
  InferModelRelationInstanceFromTypes,
  ModelHasManyFactory,
  ModelHasManyFactoryConfig,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_RELATION_HAS_MANY } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

export default /* @__PURE__ */ makeRelationFactory(SYMBOL_MODEL_RELATION_HAS_MANY) as {
  /**
   * Create a has many relation property factory with custom model type.
   * Prefer using the model callback or strict type strings signatures.
   *
   * @param type
   * @param config
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
   */<
    T extends object[] = never,
    R extends boolean = false,
  >(
    type: T extends never ? never : string | readonly string[],
    config?: ModelHasManyFactoryConfig<T, R>,
  ): ModelHasManyFactory<T, R>;
  /**
   * Create a has many relation property factory with strict type strings.
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
   * import { hasMany } from '@foscia/core';
   *
   * hasMany('posts');
   * hasMany('posts', { readOnly: true });
   * hasMany(['posts', 'comments']);
   * ```
   */<
    T extends string | readonly string[],
    R extends boolean = false,
  >(
    type: T,
    config?: ModelHasManyFactoryConfig<InferModelRelationInstanceFromTypes<T>[], R>,
  ): ModelHasManyFactory<InferModelRelationInstanceFromTypes<T>[], R>;
  /**
   * Create a has many relation property factory with strict type strings.
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
   * import { hasMany } from '@foscia/core';
   *
   * hasMany('posts');
   * hasMany('posts', { readOnly: true });
   * hasMany(['posts', 'comments']);
   * ```
   */<
    T extends string | readonly string[],
    R extends boolean = false,
  >(
    type: T,
    config?: ModelHasManyFactoryConfig<InferModelRelationInstanceFromTypes<T>[], R>,
  ): ModelHasManyFactory<InferModelRelationInstanceFromTypes<T>[], R>;
  /**
   * Create a has many relation property factory with a model resolver callback.
   * Recommended when not having circular references.
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
   * hasMany(() => Post, { readOnly: true });
   * hasMany(() => [Post, Comment]);
   * ```
   */<
    M extends object | readonly object[],
    T extends InferModelRelationInstanceFromModels<M>[] = InferModelRelationInstanceFromModels<M>[],
    R extends boolean = false,
  >(
    resolver: () => Awaitable<M>,
    config?: ModelHasManyFactoryConfig<T, R>,
  ): ModelHasManyFactory<T, R>;
};
