import ActionKind from '@foscia/core/actions/context/actionKind';
import context from '@foscia/core/actions/context/enhancers/context';
import query from '@foscia/core/actions/context/enhancers/query';
import serializeRelation from '@foscia/core/actions/context/utilities/serializeRelation';
import {
  Action,
  ConsumeId,
  ConsumeModel,
  ConsumeRelation,
  ConsumeSerializer,
} from '@foscia/core/actions/types';
import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import {
  InferModelSchemaProp,
  ModelInstance,
  ModelRelation,
  ModelRelationKey,
  ModelValues,
  ModelWritableKey,
} from '@foscia/core/model/types';

/**
 * Infer the relation update possible values.
 *
 * @internal
 */
export type InferRelationUpdateValue<R> = R extends ModelRelation<infer T>
  ? NonNullable<T> extends any[] ? T | NonNullable<T>[number] : T : never;

/**
 * Prepare context for a singular or plural relation's update operation.
 * This will replace the previous relation's value.
 *
 * @param instance
 * @param relation
 * @param value
 * @param actionKind
 *
 * @category Enhancers
 * @provideContext model, instance, id, relation
 * @requireContext serializer
 *
 * @example
 * ```typescript
 * import { updateRelation, none } from '@foscia/core';
 *
 * await action(updateRelation(post, 'tags', [tag1, tag2]), none());
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('updateRelation', <
  C extends {},
  I extends ModelInstance,
  K extends ModelWritableKey<I> & ModelRelationKey<I>,
  Record,
  Related,
  Data,
>(
  instance: I,
  relation: K,
  value: ModelValues<I>[K],
  // eslint-disable-next-line max-len
  actionKind: ActionKind.UPDATE_RELATION | ActionKind.ATTACH_RELATION | ActionKind.DETACH_RELATION = ActionKind.UPDATE_RELATION,
) => async (action: Action<C & ConsumeSerializer<Record, Related, Data>>) => action(
  query(instance, relation),
  context({
    actionKind,
    data: await serializeRelation(
      action,
      instance,
      relation,
      value,
    ),
  }),
) as unknown as Action<C & ConsumeModel<I['$model']> & ConsumeRelation<InferModelSchemaProp<I, K, ModelRelation>> & ConsumeId>);
