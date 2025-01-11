import ActionName from '@foscia/core/actions/actionName';
import context from '@foscia/core/actions/context/enhancers/context';
import query from '@foscia/core/actions/context/enhancers/query';
import registerWriteActionHooks
  from '@foscia/core/actions/context/utilities/registerWriteActionHooks';
import makeEnhancer from '@foscia/core/actions/makeEnhancer';
import {
  Action,
  ConsumeId,
  ConsumeInstance,
  ConsumeModel,
  ContextEnhancer,
} from '@foscia/core/actions/types';
import isModel from '@foscia/core/model/checks/isModel';
import forceFill from '@foscia/core/model/forceFill';
import { Model, ModelIdType, ModelInstance } from '@foscia/core/model/types';
import { using } from '@foscia/shared';

export default /* @__PURE__ */ makeEnhancer('destroy', ((
  modelOrInstance: Model | ModelInstance,
  id?: ModelIdType,
) => using(
  // eslint-disable-next-line new-cap
  isModel(modelOrInstance) ? forceFill(new modelOrInstance(), { id }) : modelOrInstance,
  (instance) => (action: Action) => registerWriteActionHooks(action.use(
    query(modelOrInstance as any, id as any),
    context({
      action: ActionName.DESTROY,
      // Rewrite ID to ensure destroy targets the record termination point
      // even if $exists is false.
      id: instance.id,
    }),
  ), instance, 'destroying', 'destroyed', false),
)) as {
  /**
   * Prepare context for an instance deletion.
   *
   * @param instance
   *
   * @category Enhancers
   * @provideContext model, instance, id
   *
   * @example
   * ```typescript
   * import { destroy, none } from '@foscia/core';
   *
   * await action().run(destroy(post), none());
   * ```
   */<C extends {}, I extends ModelInstance>(
    instance: I,
  ): ContextEnhancer<C, C & ConsumeModel<I['$model']> & ConsumeInstance<I> & ConsumeId>;
  /**
   * Prepare context for a record deletion using model and ID.
   *
   * @param model
   * @param id
   *
   * @category Enhancers
   * @since 0.13.0
   * @provideContext model, id
   *
   * @example
   * ```typescript
   * import { destroy, none } from '@foscia/core';
   *
   * await action().run(destroy(Post, '123'), none());
   * ```
   */<C extends {}, M extends Model>(
    model: M,
    id: ModelIdType,
  ): ContextEnhancer<C, C & ConsumeModel<M> & ConsumeId>;
});
