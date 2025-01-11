import ActionName from '@foscia/core/actions/actionName';
import context from '@foscia/core/actions/context/enhancers/context';
import instanceData from '@foscia/core/actions/context/enhancers/crud/instanceData';
import query from '@foscia/core/actions/context/enhancers/query';
import registerWriteActionHooks
  from '@foscia/core/actions/context/utilities/registerWriteActionHooks';
import makeEnhancer from '@foscia/core/actions/makeEnhancer';
import {
  Action,
  ConsumeId,
  ConsumeInstance,
  ConsumeModel,
  ConsumeRelation,
  ConsumeSerializer,
  ContextEnhancer,
  InferQueryInstance,
} from '@foscia/core/actions/types';
import {
  InferModelSchemaProp,
  ModelInstance,
  ModelRelation,
  ModelRelationKey,
} from '@foscia/core/model/types';

export default /* @__PURE__ */ makeEnhancer('create', (<
  C extends {},
  I extends ModelInstance,
  K extends string,
  R extends InferModelSchemaProp<I, K, ModelRelation>,
  RI extends InferQueryInstance<ConsumeRelation<R>>,
  Record,
  Related,
  Data,
>(
  instance: I | RI,
  throughInstance?: I,
  throughRelation?: K & ModelRelationKey<I>,
) => (
  action: Action<C & ConsumeSerializer<Record, Related, Data>>,
) => registerWriteActionHooks(action.use(
  query(throughInstance ?? instance, throughRelation as any),
  context({
    action: ActionName.CREATE,
    instance,
    // Rewrite ID when creating through another record.
    id: throughInstance ? throughInstance.id : undefined,
  }),
  instanceData(instance),
), instance, ['creating', 'saving'], ['created', 'saved'], true)) as {
  /**
   * Prepare context for an instance creation.
   *
   * @param instance
   *
   * @category Enhancers
   * @provideContext model, instance
   * @requireContext serializer
   *
   * @example
   * ```typescript
   * import { create, none } from '@foscia/core';
   *
   * await action().run(create(post), none());
   * ```
   */<C extends {}, I extends ModelInstance, Record, Related, Data>(
    instance: I,
    // eslint-disable-next-line max-len
  ): ContextEnhancer<C & ConsumeSerializer<Record, Related, Data>, C & ConsumeModel<I['$model']> & ConsumeInstance<I>>;
  /**
   * Prepare context for an instance creation through another instance relation.
   *
   * @param instance
   * @param throughInstance
   * @param throughRelation
   *
   * @category Enhancers
   *
   * @example
   * ```typescript
   * import { create, none } from '@foscia/core';
   *
   * await action().run(create(comment, post, 'comments'), none());
   * ```
   */<
    C extends {},
    I extends ModelInstance,
    K extends string,
    R extends InferModelSchemaProp<I, K, ModelRelation>,
    RI extends InferQueryInstance<ConsumeRelation<R>>,
    Record,
    Related,
    Data,
  >(
    instance: RI,
    throughInstance: I,
    throughRelation: K & ModelRelationKey<I>,
    // eslint-disable-next-line max-len
  ): ContextEnhancer<C & ConsumeSerializer<Record, Related, Data>, C & ConsumeModel<I['$model']> & ConsumeRelation<R> & ConsumeInstance<RI> & ConsumeId>;
});
