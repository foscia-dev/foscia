import associate from '@foscia/core/actions/context/enhancers/crud/associate';
import makeEnhancer from '@foscia/core/actions/makeEnhancer';
import {
  InferModelSchemaProp,
  ModelInstance,
  ModelRelation,
  ModelRelationKey,
} from '@foscia/core/model/types';

/**
 * Prepare context for a singular relation's update operation.
 * This will remove the previous relation's value.
 *
 * @param instance
 * @param relation
 *
 * @category Enhancers
 * @provideContext model, instance, id, relation
 * @requireContext serializer
 *
 * @example
 * ```typescript
 * import { dissociate, none } from '@foscia/core';
 *
 * await action().run(dissociate(post, 'author'), none());
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('dissociate', <
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
) => associate<C, I, K, R, Record, Related, Data>(
  instance,
  relation,
  null as any,
));
