import context from '@foscia/core/actions/context/enhancers/context';
import {
  Action,
  AnonymousEnhancer,
  ConsumeModel,
  ConsumeModelByPrimary,
  ConsumeModelInstance,
  ConsumeModelRelation,
} from '@foscia/core/actions/types';
import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import isModel from '@foscia/core/models/definition/utilities/isModel';
import isModelRelation from '@foscia/core/models/definition/utilities/isModelRelation';
import getPrimaryValues from '@foscia/core/models/primary/getPrimaryValues';
import parsePrimaryValues from '@foscia/core/models/primary/parsePrimaryValues';
import {
  Model,
  ModelInstance,
  ModelPrimaryRawValues,
  ModelRelationProps,
} from '@foscia/core/models/types';

export default /* @__PURE__ */ makeEnhancer('query', (<
  C extends {},
  I extends ModelInstance,
>(
  model: Model<I> | I,
  primary?: ModelPrimaryRawValues<I> | keyof ModelRelationProps<I>,
) => (action: Action<C>) => {
  const queryContext = isModel(model)
    ? {
      model,
      primary: primary !== undefined
        ? parsePrimaryValues(model, primary as ModelPrimaryRawValues<I>)
        : undefined,
    }
    : {
      model: model.$model,
      instance: model,
      primary: getPrimaryValues(model),
      relation: primary !== undefined
        // TODO Validate relation.
        ? model.$model.$schema.get(primary as keyof ModelRelationProps<I>)
        : undefined,
    };

  const queryScopes = (
    isModelRelation(queryContext.relation)
      ? queryContext.relation.scopes
      : queryContext.model.$config.scopes
  ) ?? [];

  (action.use as any)(
    context(queryContext),
    ...queryScopes,
  );
}) as {
  /**
   * Query a model records.
   *
   * @param model
   *
   * @category Enhancers
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
  ): AnonymousEnhancer<C, C & ConsumeModel<M>>;
  /**
   * Query a model record by ID.
   *
   * @param model
   * @param primary
   *
   * @category Enhancers
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
    primary: ModelPrimaryRawValues<InstanceType<M>>,
  ): AnonymousEnhancer<C, C & ConsumeModelByPrimary<InstanceType<M>>>;
  /**
   * Query a model record by instance.
   *
   * @param instance
   *
   * @category Enhancers
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
  ): AnonymousEnhancer<C, C & ConsumeModelInstance<I>>;
  /**
   * Query a model relation related records.
   *
   * @param instance
   * @param relation
   *
   * @category Enhancers
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
    K extends keyof ModelRelationProps<I>,
  >(
    instance: I,
    relation: K,
  ): AnonymousEnhancer<C, C & ConsumeModelRelation<ModelRelationProps<I>[K]>>;
});
