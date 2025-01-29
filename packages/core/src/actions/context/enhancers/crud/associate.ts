import updateRelation from '@foscia/core/actions/context/enhancers/crud/updateRelation';
import onSuccess from '@foscia/core/actions/context/enhancers/hooks/onSuccess';
import makeEnhancer from '@foscia/core/actions/makeEnhancer';
import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
import fill from '@foscia/core/model/fill';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import {
  ModelInstance,
  ModelRelationKey,
  ModelValues,
  ModelWritableKey,
} from '@foscia/core/model/types';

/**
 * Prepare context for a singular relation's update operation.
 * This will replace the previous relation's value.
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
 * import { associate, none } from '@foscia/core';
 *
 * await action().run(associate(post, 'author', user), none());
 * ```
 */

export default /* @__PURE__ */ makeEnhancer('associate', <
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
) => (action: Action<C & ConsumeSerializer<Record, Related, Data>>) => action.use(
  updateRelation(instance, relation, value),
  onSuccess(() => {
    fill(instance, { [relation]: value } as unknown as Partial<ModelValues<I>>);
    markSynced(instance, relation);
  }),
));
