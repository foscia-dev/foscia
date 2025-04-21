import {
  InferModelPropNullable,
  InferModelPropReadOnly,
  InferModelRelationInstanceFromCustomTypes,
  InferModelRelationInstanceFromModels,
  ModelBelongsTo,
  ModelBelongsToFactory,
  ModelBelongsToFactoryConfig,
  ModelPropConfig,
  ModelRelationTypeFromCustomTypes,
} from '@foscia/core/model/types';
import forceFill from '@foscia/core/model/utilities/forceFill';
import makeRelationFactory from '@foscia/core/relations/props/makeRelationFactory';
import guessRelationForeignKey from '@foscia/core/relations/utilities/guessRelationForeignKey';
import guessRelationOwnerKey from '@foscia/core/relations/utilities/guessRelationOwnerKey';
import { SYMBOL_MODEL_RELATION_BELONGS_TO } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

export default /* @__PURE__ */ makeRelationFactory<ModelBelongsTo>(
  SYMBOL_MODEL_RELATION_BELONGS_TO,
  {
    onWrite: ({ instance, prop, next }) => {
      const foreignKey = guessRelationForeignKey(prop);
      if (instance.$model.$schema[foreignKey]) {
        forceFill(instance, {
          [foreignKey]: next ? next[guessRelationOwnerKey(prop)] : null,
        });
      }
    },
  },
) as {
  /**
   * Create a belongs to relation property factory with type parameter.
   *
   * @param type
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { belongsTo } from '@foscia/core';
   *
   * belongsTo<User>('users');
   * ```
   */<T extends object | null = never>(
    type: T extends never ? never : string,
    config?: ModelBelongsToFactoryConfig<T>,
  ): ModelBelongsToFactory<T, false>;
  /**
   * Create a belongs to relation property factory with type parameter.
   *
   * @param type
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { belongsTo } from '@foscia/core';
   *
   * belongsTo<User>('users', { readOnly: true });
   * ```
   */<T extends object | null = never>(
    type: T extends never ? never : string,
    config: { readOnly: true; } & ModelBelongsToFactoryConfig<T>,
  ): ModelBelongsToFactory<T, true>;
  /**
   * Create a belongs to relation property factory with strict type strings.
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
   * import { belongsTo } from '@foscia/core';
   *
   * belongsTo('users');
   * belongsTo('users', { readOnly: true });
   * belongsTo('users', { nullable: true });
   * ```
   */<
    S extends ModelRelationTypeFromCustomTypes,
    C extends ModelPropConfig,
    // eslint-disable-next-line max-len
    T extends object | null = InferModelRelationInstanceFromCustomTypes<S> | InferModelPropNullable<C>,
  >(
    type: S,
    config?: C & ModelBelongsToFactoryConfig<T>,
  ): ModelBelongsToFactory<T, InferModelPropReadOnly<C>>;
  /**
   * Create a belongs to relation property factory with a model resolver callback.
   * Recommended when not having circular references.
   *
   * @param resolver
   * @param config
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { belongsTo } from '@foscia/core';
   *
   * belongsTo(() => User);
   * belongsTo(() => User, { readOnly: true });
   * belongsTo(() => User, { nullable: true });
   * ```
   */<
    M extends object,
    C extends ModelPropConfig,
    T extends InferModelRelationInstanceFromModels<M> | InferModelPropNullable<C>,
  >(
    resolver: () => Awaitable<M>,
    config?: C & ModelBelongsToFactoryConfig<T>,
  ): ModelBelongsToFactory<T, InferModelPropReadOnly<C>>;
};
