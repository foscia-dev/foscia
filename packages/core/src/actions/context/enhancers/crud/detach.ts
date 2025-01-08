import ActionName from '@foscia/core/actions/actionName';
import updateRelation, {
  UpdateRelationValue,
} from '@foscia/core/actions/context/enhancers/crud/updateRelation';
import makeEnhancer from '@foscia/core/actions/makeEnhancer';
import {
  InferModelSchemaProp,
  ModelInstance,
  ModelRelation,
  ModelRelationKey,
} from '@foscia/core/model/types';

/**
 * Prepare context for a plural relation's update operation.
 * This will remove instances from the previous relation's value.
 *
 * @param instance
 * @param relation
 * @param value
 *
 * @category Enhancers
 * @provideContext model, instance, id, relation
 * @requireContext serializer
 *
 * @example
 * ```typescript
 * import { detach, none } from '@foscia/core';
 *
 * await action().run(detach(post, 'tags', [tag1, tag2]), none());
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('detach', <
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
) => updateRelation<C, I, K, R, Record, Related, Data>(
  instance,
  relation,
  value,
  ActionName.DETACH_RELATION,
));
