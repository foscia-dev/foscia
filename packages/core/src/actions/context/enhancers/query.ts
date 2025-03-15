import context from '@foscia/core/actions/context/enhancers/context';
import include from '@foscia/core/actions/context/enhancers/include';
import {
  Action,
  AnonymousEnhancer,
  ConsumeId,
  ConsumeInstance,
  ConsumeModel,
  ConsumeRelation, InferQueryInstance,
} from '@foscia/core/actions/types';
import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import isModel from '@foscia/core/model/checks/isModel';
import {
  InferModelSchemaProp,
  Model,
  ModelIdType,
  ModelInstance,
  ModelRelation,
  ModelRelationKey,
} from '@foscia/core/model/types';
import { RawInclude } from '@foscia/core/relations/types';
import { isNil } from '@foscia/shared';

/**
 * Options for the query.
 *
 * @internal
 */
export type QueryOptions<C extends {} = {}, M extends ModelInstance | Model = Model> = {
  query?: AnonymousEnhancer<C, any> | null;
  include?: RawInclude<M> | null;
};

export default /* @__PURE__ */ makeEnhancer('query', (<C extends {}>(
  modelOrInstance: Model | ModelInstance,
  idOrRelationOrOptions?: ModelIdType | string | QueryOptions,
  optionsOrUndefined?: QueryOptions,
) => (action: Action<C>) => {
  const [idOrRelation, options] = typeof idOrRelationOrOptions === 'object'
    ? [undefined, idOrRelationOrOptions]
    : [idOrRelationOrOptions, optionsOrUndefined];

  const queryContext = isModel(modelOrInstance) ? {
    model: modelOrInstance,
    id: idOrRelation,
  } : {
    model: modelOrInstance.$model,
    instance: idOrRelation ? undefined : modelOrInstance,
    id: modelOrInstance.$exists ? modelOrInstance.id : undefined,
    relation: isNil(idOrRelation)
      ? undefined
      : modelOrInstance.$model.$schema[idOrRelation] as ModelRelation,
  };

  action(context(queryContext));

  const customBehaviors = isModel(modelOrInstance)
    ? modelOrInstance.$config
    : queryContext.relation;

  const additionalQuery = options?.query !== null
    && (options?.query ?? customBehaviors?.query);
  if (additionalQuery) {
    action(additionalQuery as any);
  }

  const additionalInclude = options?.include !== null
    && (options?.include ?? customBehaviors?.include);
  if (additionalInclude) {
    action(include(additionalInclude as any));
  }
}) as {
  /**
   * Query a model.
   *
   * @param model
   * @param options
   *
   * @category Enhancers
   * @since 0.6.3
   * @provideContext model
   *
   * @example
   * ```typescript
   * import { query, all } from '@foscia/core';
   *
   * const posts = await action(query(Post), all());
   * ```
   */<C extends {}, M extends Model>(
    model: M,
    options?: QueryOptions<C & ConsumeModel<M>, M>,
  ): AnonymousEnhancer<C, C & ConsumeModel<M>>;
  /**
   * Query a model record by ID.
   *
   * @param model
   * @param id
   * @param options
   *
   * @category Enhancers
   * @since 0.6.3
   * @provideContext model, id
   *
   * @example
   * ```typescript
   * import { query, oneOrFail } from '@foscia/core';
   *
   * const post = await action(query(Post, '123'), oneOrFail());
   * ```
   */<C extends {}, M extends Model>(
    model: M,
    id: ModelIdType,
    options?: QueryOptions<C & ConsumeModel<M> & ConsumeId, M>,
  ): AnonymousEnhancer<C, C & ConsumeModel<M> & ConsumeId>;
  /**
   * Query a model instance.
   *
   * @param instance
   * @param options
   *
   * @category Enhancers
   * @since 0.6.3
   * @provideContext model, instance, id
   *
   * @example
   * ```typescript
   * import { query, oneOrFail } from '@foscia/core';
   *
   * const refreshedPost = await action(query(post), oneOrFail());
   * ```
   */<C extends {}, I extends ModelInstance>(
    instance: I,
    options?: QueryOptions<C & ConsumeModel<I['$model']> & ConsumeInstance<I> & ConsumeId, I>,
  ): AnonymousEnhancer<C, C & ConsumeModel<I['$model']> & ConsumeInstance<I> & ConsumeId>;
  /**
   * Query a model instance relation.
   *
   * @param instance
   * @param relation
   * @param options
   *
   * @category Enhancers
   * @since 0.6.3
   * @provideContext model, instance, id, relation
   *
   * @example
   * ```typescript
   * import { query, all } from '@foscia/core';
   *
   * const comments = await action(query(myPost, 'comments'), all());
   * ```
   */<
    C extends {},
    I extends ModelInstance,
    K extends string,
    R extends InferModelSchemaProp<I, K, ModelRelation>,
  >(
    instance: I,
    relation: K & ModelRelationKey<I>,
    options?: QueryOptions<C & ConsumeModel<I['$model']> & ConsumeRelation<R> & ConsumeId, InferQueryInstance<ConsumeRelation<R>>>,
  ): AnonymousEnhancer<C, C & ConsumeModel<I['$model']> & ConsumeRelation<R> & ConsumeId>;
});
