import {
  InferModelPropNullable,
  InferModelPropReadOnly,
  InferModelRelationInstanceFromCustomTypes,
  InferModelRelationInstanceFromModels,
  ModelHasOneFactory,
  ModelHasOneFactoryConfig,
  ModelPropConfig,
  ModelRelationTypeFromCustomTypes,
} from '@foscia/core/model/types';
import makeRelationFactory from '@foscia/core/relations/props/makeRelationFactory';
import { SYMBOL_MODEL_RELATION_HAS_ONE } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

export default /* @__PURE__ */ makeRelationFactory(SYMBOL_MODEL_RELATION_HAS_ONE) as {
  /**
   * Create a has one relation property factory with type parameter.
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
   * hasOne<User>('users');
   * ```
   */<T extends object | null = never>(
    type: T extends never ? never : string,
    config?: ModelHasOneFactoryConfig<T>,
  ): ModelHasOneFactory<T, false>;
  /**
   * Create a has one relation property factory with type parameter.
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
   * hasOne<User>('users', { readOnly: true });
   * ```
   */<T extends object | null = never>(
    type: T extends never ? never : string,
    config: { readOnly: true; } & ModelHasOneFactoryConfig<T>,
  ): ModelHasOneFactory<T, true>;
  /**
   * Create a has one relation property factory with strict type strings.
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
   * import { hasOne } from '@foscia/core';
   *
   * hasOne('posts');
   * hasOne('posts', { readOnly: true });
   * hasOne('posts', { nullable: true });
   * ```
   */<
    S extends ModelRelationTypeFromCustomTypes,
    C extends ModelPropConfig,
    // eslint-disable-next-line max-len
    T extends object | null = InferModelRelationInstanceFromCustomTypes<S> | InferModelPropNullable<C>,
  >(
    type: S,
    config?: C & ModelHasOneFactoryConfig<T>,
  ): ModelHasOneFactory<T, InferModelPropReadOnly<C>>;
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
   * hasOne(() => Post, { readOnly: true });
   * hasOne(() => Post, { nullable: true });
   * ```
   */<
    M extends object,
    C extends ModelPropConfig,
    T extends InferModelRelationInstanceFromModels<M> | InferModelPropNullable<C>,
  >(
    resolver: () => Awaitable<M>,
    config?: C & ModelHasOneFactoryConfig<T>,
  ): ModelHasOneFactory<T, InferModelPropReadOnly<C>>;
};
