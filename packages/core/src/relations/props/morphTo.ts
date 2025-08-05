import {
  InferModelPropNullable,
  InferModelPropReadOnly,
  InferModelRelationInstanceFromCustomTypes,
  InferModelRelationInstanceFromModels,
  ModelInstance,
  ModelMorphTo,
  ModelMorphToFactory,
  ModelMorphToFactoryConfig,
  ModelPropConfig,
  ModelRelationTypeFromCustomTypes,
} from '@foscia/core/models/oldTypes';
import forceFill from '@foscia/core/models/utilities/forceFill';
import makeRelationFactory from '@foscia/core/relations/props/makeRelationFactory';
import guessRelationForeignKey from '@foscia/core/relations/utilities/guessRelationForeignKey';
import guessRelationForeignTypeKey
  from '@foscia/core/relations/utilities/guessRelationForeignTypeKey';
import guessRelationOwnerKey from '@foscia/core/relations/utilities/guessRelationOwnerKey';
import resolveMorphType from '@foscia/core/relations/utilities/resolveMorphType';
import { SYMBOL_MODEL_RELATION_MORPH_TO } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

export default /* @__PURE__ */ makeRelationFactory<ModelMorphTo<ModelInstance>>(
  SYMBOL_MODEL_RELATION_MORPH_TO,
  {
    onWrite: ({ instance, prop, next }) => {
      const foreignKey = guessRelationForeignKey(prop);
      const foreignTypeKey = guessRelationForeignTypeKey(prop);
      if (instance.$model.$schema[foreignKey] && instance.$model.$schema[foreignTypeKey]) {
        forceFill(
          instance,
          next ? {
            [foreignKey]: next[guessRelationOwnerKey(prop)],
            [foreignTypeKey]: resolveMorphType(instance.$model),
          } : {
            [foreignKey]: null,
            [foreignTypeKey]: null,
          },
        );
      }
    },
  },
) as {
  /**
   * Create a morph to relation property factory with type parameter.
   *
   * @param type
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { morphTo } from '@foscia/core';
   *
   * morphTo<User>('users');
   * ```
   */<T extends object | null = never>(
    type: T extends never ? never : string,
    config?: ModelMorphToFactoryConfig<T>,
  ): ModelMorphToFactory<T, false>;
  /**
   * Create a morph to relation property factory with type parameter.
   *
   * @param type
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { morphTo } from '@foscia/core';
   *
   * morphTo<User>('users', { readOnly: true });
   * ```
   */<T extends object | null = never>(
    type: T extends never ? never : string,
    config: { readOnly: true; } & ModelMorphToFactoryConfig<T>,
  ): ModelMorphToFactory<T, true>;
  /**
   * Create a morph to relation property factory with strict type strings.
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
   * import { morphTo } from '@foscia/core';
   *
   * morphTo(['posts', 'comments']);
   * morphTo(['posts', 'comments'], { readOnly: true });
   * morphTo(['posts', 'comments'], { nullable: true });
   * ```
   */<
    S extends readonly ModelRelationTypeFromCustomTypes[],
    C extends ModelPropConfig,
    // eslint-disable-next-line max-len
    T extends object | null = InferModelRelationInstanceFromCustomTypes<S> | InferModelPropNullable<C>,
  >(
    type: S,
    config?: C & ModelMorphToFactoryConfig<T>,
  ): ModelMorphToFactory<T, InferModelPropReadOnly<C>>;
  /**
   * Create a morph to relation property factory with a model resolver callback.
   * Recommended when not having circular references.
   *
   * @param resolver
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { morphTo } from '@foscia/core';
   *
   * morphTo(() => [Post, Comment]);
   * morphTo(() => [Post, Comment], { readOnly: true });
   * morphTo(() => [Post, Comment], { nullable: true });
   * ```
   */<
    M extends readonly object[],
    C extends ModelPropConfig,
    T extends InferModelRelationInstanceFromModels<M> | InferModelPropNullable<C>,
  >(
    resolver: () => Awaitable<M>,
    config?: C & ModelMorphToFactoryConfig<T>,
  ): ModelMorphToFactory<T, InferModelPropReadOnly<C>>;
};
