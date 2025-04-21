import {
  InferModelPropReadOnly,
  InferModelRelationInstanceFromCustomTypes,
  InferModelRelationInstanceFromModels,
  ModelHasManyFactory,
  ModelHasManyFactoryConfig,
  ModelPropConfig,
  ModelRelationTypeFromCustomTypes,
} from '@foscia/core/model/types';
import makeRelationFactory from '@foscia/core/relations/props/makeRelationFactory';
import { SYMBOL_MODEL_RELATION_HAS_MANY } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

export default /* @__PURE__ */ makeRelationFactory(SYMBOL_MODEL_RELATION_HAS_MANY) as {
  /**
   * Create a has many relation property factory with type parameter.
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
   * hasMany<Post>('posts');
   * ```
   */<T extends object = never>(
    type: T extends never ? never : string,
    config?: ModelHasManyFactoryConfig<T[]>,
  ): ModelHasManyFactory<T[], false>;
  /**
   * Create a has many relation property factory with type parameter.
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
   * hasMany<Post>('posts', { readOnly: true });
   * ```
   */<T extends object = never>(
    type: T extends never ? never : string,
    config: { readOnly: true; } & ModelHasManyFactoryConfig<T[]>,
  ): ModelHasManyFactory<T[], true>;
  /**
   * Create a has many relation property factory with strict type strings.
   * Recommended when having circular relations.
   * Must be combined with `Foscia` namespace overload to work.
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
   * ```
   */<
    S extends ModelRelationTypeFromCustomTypes,
    C extends Omit<ModelPropConfig, 'nullable'>,
    T extends object = InferModelRelationInstanceFromCustomTypes<S>,
  >(
    type: S,
    config?: C & ModelHasManyFactoryConfig<T[]>,
  ): ModelHasManyFactory<T[], InferModelPropReadOnly<C>>;
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
   * ```
   */<
    M extends object,
    C extends Omit<ModelPropConfig, 'nullable'>,
    T extends InferModelRelationInstanceFromModels<M>,
  >(
    resolver: () => Awaitable<M>,
    config?: C & ModelHasManyFactoryConfig<T[]>,
  ): ModelHasManyFactory<T[], InferModelPropReadOnly<C>>;
};
