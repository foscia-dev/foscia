import associate from '@foscia/core/actions/context/enhancers/crud/associate';
import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import { ModelInstance, ModelRelationKey, ModelWritableKey } from '@foscia/core/model/types';

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
 * await action(dissociate(post, 'author'), none());
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('dissociate', <
  C extends {},
  I extends ModelInstance,
  K extends ModelWritableKey<I> & ModelRelationKey<I>,
  Record,
  Related,
  Data,
>(
  instance: I,
  relation: K,
) => associate<C, I, K, Record, Related, Data>(
  instance,
  relation,
  null as any,
));
