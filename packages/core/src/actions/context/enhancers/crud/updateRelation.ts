import ActionName from '@foscia/core/actions/actionName';
import context from '@foscia/core/actions/context/enhancers/context';
import query from '@foscia/core/actions/context/enhancers/query';
import serializeRelation from '@foscia/core/actions/context/utils/serializeRelation';
import makeEnhancer from '@foscia/core/actions/makeEnhancer';
import {
  Action,
  ConsumeId,
  ConsumeModel,
  ConsumeRelation,
  ConsumeSerializer,
} from '@foscia/core/actions/types';
import isSingularRelationDef from '@foscia/core/model/checks/isSingularRelationDef';
import {
  InferModelSchemaProp,
  InferModelValuePropType,
  ModelInstance,
  ModelRelation,
  ModelRelationKey,
} from '@foscia/core/model/types';
import { wrap } from '@foscia/shared';

export type UpdateRelationActionName =
  | ActionName.UPDATE_RELATION
  | ActionName.ATTACH_RELATION
  | ActionName.DETACH_RELATION;

export type UpdateRelationValue<R> = R extends ModelRelation<any, infer T>
  ? NonNullable<T> extends any[] ? T | NonNullable<T>[number] : T : never;

/**
 * Prepare context for a singular or plural relation's update operation.
 * This will replace the previous relation's value.
 *
 * @param instance
 * @param relation
 * @param value
 * @param actionName
 *
 * @category Enhancers
 * @provideContext model, instance, id, relation
 * @requireContext serializer
 *
 * @example
 * ```typescript
 * import { updateRelation, none } from '@foscia/core';
 *
 * await action().run(updateRelation(post, 'tags', [tag1, tag2]), none());
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('updateRelation', <
  C extends {},
  I extends ModelInstance,
  K extends string,
  R extends InferModelSchemaProp<I, K, ModelRelation>,
  Record,
  Related,
  Data,
>(
  instance: I,
  relation: K & ModelRelationKey<I>,
  value: UpdateRelationValue<R>,
  actionName: UpdateRelationActionName = ActionName.UPDATE_RELATION,
) => async (action: Action<C & ConsumeSerializer<Record, Related, Data>>) => {
  const wrappedValue = isSingularRelationDef(instance.$model.$schema[relation] as R)
    ? value : wrap(value);

  return action.use(
    query(instance, relation),
    context({
      action: actionName,
      data: await serializeRelation(
        action,
        instance,
        relation,
        wrappedValue as InferModelValuePropType<R>,
      ),
    }),
  ) as unknown as Action<C & ConsumeModel<I['$model']> & ConsumeRelation<R> & ConsumeId>;
});
