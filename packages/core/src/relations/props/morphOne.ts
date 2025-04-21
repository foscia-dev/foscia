import {
  InferModelPropNullable,
  InferModelPropReadOnly,
  InferModelRelationInstanceFromCustomTypes,
  InferModelRelationInstanceFromModels,
  ModelMorphOneFactory,
  ModelMorphOneFactoryConfig,
  ModelPropConfig,
  ModelRelationTypeFromCustomTypes,
} from '@foscia/core/model/types';
import makeRelationFactory from '@foscia/core/relations/props/makeRelationFactory';
import { SYMBOL_MODEL_RELATION_MORPH_ONE } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

export default /* @__PURE__ */ makeRelationFactory(SYMBOL_MODEL_RELATION_MORPH_ONE) as {
  /**
   * Create a morph one relation property factory with type parameter.
   *
   * @param type
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { morphOne } from '@foscia/core';
   *
   * morphOne<User>('users');
   * ```
   */<T extends object | null = never>(
    type: T extends never ? never : string,
    config?: ModelMorphOneFactoryConfig<T>,
  ): ModelMorphOneFactory<T, false>;
  /**
   * Create a morph one relation property factory with type parameter.
   *
   * @param type
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { morphOne } from '@foscia/core';
   *
   * morphOne<User>('users', { readOnly: true });
   * ```
   */<T extends object | null = never>(
    type: T extends never ? never : string,
    config: { readOnly: true; } & ModelMorphOneFactoryConfig<T>,
  ): ModelMorphOneFactory<T, true>;
  /**
   * Create a morph one relation property factory with strict type strings.
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
   * import { morphOne } from '@foscia/core';
   *
   * morphOne(['posts', 'comments']);
   * morphOne(['posts', 'comments'], { readOnly: true });
   * morphOne(['posts', 'comments'], { nullable: true });
   * ```
   */<
    S extends readonly ModelRelationTypeFromCustomTypes[],
    C extends ModelPropConfig,
    // eslint-disable-next-line max-len
    T extends object | null = InferModelRelationInstanceFromCustomTypes<S> | InferModelPropNullable<C>,
  >(
    type: S,
    config?: C & ModelMorphOneFactoryConfig<T>,
  ): ModelMorphOneFactory<T, InferModelPropReadOnly<C>>;
  /**
   * Create a morph one relation property factory with a model resolver callback.
   * Recommended when not having circular references.
   *
   * @param resolver
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { morphOne } from '@foscia/core';
   *
   * morphOne(() => [Post, Comment]);
   * morphOne(() => [Post, Comment], { readOnly: true });
   * morphOne(() => [Post, Comment], { nullable: true });
   * ```
   */<
    M extends readonly object[],
    C extends ModelPropConfig,
    T extends InferModelRelationInstanceFromModels<M> | InferModelPropNullable<C>,
  >(
    resolver: () => Awaitable<M>,
    config?: C & ModelMorphOneFactoryConfig<T>,
  ): ModelMorphOneFactory<T, InferModelPropReadOnly<C>>;
};
