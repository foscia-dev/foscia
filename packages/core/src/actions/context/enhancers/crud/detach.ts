import ActionKind from '@foscia/core/actions/context/actionKind';
import updateRelation from '@foscia/core/actions/context/enhancers/crud/updateRelation';
import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import {
  ModelInstance,
  ModelRelationKey,
  ModelValues,
  ModelWritableKey,
} from '@foscia/core/model/types';
import { Itemable, wrap } from '@foscia/shared';

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
 * await action(detach(post, 'tags', [tag1, tag2]), none());
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('detach', <
  C extends {},
  I extends ModelInstance,
  K extends ModelWritableKey<I> & ModelRelationKey<I>,
  Record,
  Related,
  Data,
>(
  instance: I,
  relation: K,
  value: Itemable<ModelValues<I>[K]>,
) => updateRelation<C, I, K, Record, Related, Data>(
  instance,
  relation,
  wrap(value) as ModelValues<I>[K],
  ActionKind.DETACH_RELATION,
));
