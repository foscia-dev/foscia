import context from '@foscia/core/actions/context/enhancers/context';
import makeEnhancer from '@foscia/core/actions/makeEnhancer';
import {
  ConsumeId,
  ConsumeInstance,
  ConsumeModel,
  ConsumeRelation,
  ContextEnhancer,
} from '@foscia/core/actions/types';
import isModel from '@foscia/core/model/checks/isModel';
import {
  InferModelSchemaProp,
  Model,
  ModelIdType,
  ModelInstance,
  ModelRelation,
  ModelRelationKey,
} from '@foscia/core/model/types';

export default /* @__PURE__ */ makeEnhancer('query', ((
  modelOrInstance: Model | ModelInstance,
  idOrRelation?: ModelIdType | string,
) => (
  isModel(modelOrInstance)
    ? context({ model: modelOrInstance, id: idOrRelation })
    : context({
      model: modelOrInstance.$model,
      instance: idOrRelation ? undefined : modelOrInstance,
      id: modelOrInstance.$exists ? modelOrInstance.id : undefined,
      relation: idOrRelation && modelOrInstance.$model.$schema[idOrRelation],
    })
)) as {
  /**
   * Query a model.
   *
   * @param model
   *
   * @category Enhancers
   * @since 0.6.3
   * @provideContext model
   *
   * @example
   * ```typescript
   * import { query, all } from '@foscia/core';
   *
   * const posts = await action().run(query(Post), all());
   * ```
   */<C extends {}, M extends Model>(
    model: M,
  ): ContextEnhancer<C, C & ConsumeModel<M>>;
  /**
   * Query a model record by ID.
   *
   * @param model
   * @param id
   *
   * @category Enhancers
   * @since 0.6.3
   * @provideContext model, id
   *
   * @example
   * ```typescript
   * import { query, oneOrFail } from '@foscia/core';
   *
   * const post = await action().run(query(Post, '123'), oneOrFail());
   * ```
   */<C extends {}, M extends Model>(
    model: M,
    id: ModelIdType,
  ): ContextEnhancer<C, C & ConsumeModel<M> & ConsumeId>;
  /**
   * Query a model instance.
   *
   * @param instance
   *
   * @category Enhancers
   * @since 0.6.3
   * @provideContext model, instance, id
   *
   * @example
   * ```typescript
   * import { query, oneOrFail } from '@foscia/core';
   *
   * const refreshedPost = await action().run(query(post), oneOrFail());
   * ```
   */<C extends {}, I extends ModelInstance>(
    instance: I,
  ): ContextEnhancer<C, C & ConsumeModel<I['$model']> & ConsumeInstance<I> & ConsumeId>;
  /**
   * Query a model instance relation.
   *
   * @param instance
   * @param relation
   *
   * @category Enhancers
   * @since 0.6.3
   * @provideContext model, instance, id, relation
   *
   * @example
   * ```typescript
   * import { query, all } from '@foscia/core';
   *
   * const comments = await action().run(query(myPost, 'comments'), all());
   * ```
   */<
    C extends {},
    I extends ModelInstance,
    K extends string,
    R extends InferModelSchemaProp<I, K, ModelRelation>,
  >(
    instance: I,
    relation: K & ModelRelationKey<I>,
  ): ContextEnhancer<C, C & ConsumeModel<I['$model']> & ConsumeRelation<R> & ConsumeId>;
});
