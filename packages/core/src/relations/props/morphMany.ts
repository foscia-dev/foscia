import {
  InferModelPropReadOnly,
  InferModelRelationInstanceFromCustomTypes,
  InferModelRelationInstanceFromModels,
  ModelMorphManyFactory,
  ModelMorphManyFactoryConfig,
  ModelPropConfig,
  ModelRelationTypeFromCustomTypes,
} from '@foscia/core/models/oldTypes';
import makeRelationFactory from '@foscia/core/relations/props/makeRelationFactory';
import { SYMBOL_MODEL_RELATION_MORPH_MANY } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

export default /* @__PURE__ */ makeRelationFactory(SYMBOL_MODEL_RELATION_MORPH_MANY) as {
  /**
   * Create a morph many relation property factory with type parameter.
   *
   * @param type
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { morphMany } from '@foscia/core';
   *
   * morphMany<Post | Comment>(['posts', 'comments']);
   * ```
   */<T extends object = never>(
    type: T extends never ? never : readonly string[],
    config?: ModelMorphManyFactoryConfig<T[]>,
  ): ModelMorphManyFactory<T[], false>;
  /**
   * Create a morph many relation property factory with type parameter.
   *
   * @param type
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { morphMany } from '@foscia/core';
   *
   * morphMany<Post | Comment>(['posts', 'comments'], { readOnly: true });
   * ```
   */<T extends object = never>(
    type: T extends never ? never : readonly string[],
    config: { readOnly: true; } & ModelMorphManyFactoryConfig<T[]>,
  ): ModelMorphManyFactory<T[], true>;
  /**
   * Create a morph many relation property factory with strict type strings.
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
   * import { morphMany } from '@foscia/core';
   *
   * morphMany(['posts', 'comments']);
   * morphMany(['posts', 'comments'], { readOnly: true });
   * ```
   */<
    S extends readonly ModelRelationTypeFromCustomTypes[],
    C extends Omit<ModelPropConfig, 'nullable'>,
    T extends object = InferModelRelationInstanceFromCustomTypes<S>,
  >(
    type: S,
    config?: C & ModelMorphManyFactoryConfig<T[]>,
  ): ModelMorphManyFactory<T[], InferModelPropReadOnly<C>>;
  /**
   * Create a morph many relation property factory with a model resolver callback.
   * Recommended when not having circular references.
   *
   * @param resolver
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { morphMany } from '@foscia/core';
   *
   * morphMany(() => [Post, Comment]);
   * morphMany(() => [Post, Comment], { readOnly: true });
   * ```
   */<
    M extends readonly object[],
    C extends Omit<ModelPropConfig, 'nullable'>,
    T extends InferModelRelationInstanceFromModels<M>,
  >(
    resolver: () => Awaitable<M>,
    config?: C & ModelMorphManyFactoryConfig<T[]>,
  ): ModelMorphManyFactory<T[], InferModelPropReadOnly<C>>;
};
