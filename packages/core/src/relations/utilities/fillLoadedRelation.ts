import forceFill from '@foscia/core/model/utilities/forceFill';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import { ModelInstance, ModelRelationKey } from '@foscia/core/model/types';

/**
 * Fill and mark a relation's value as loaded on an instance.
 *
 * @param instance
 * @param relation
 * @param value
 *
 * @category Utilities
 * @internal
 */
export default <I extends ModelInstance>(
  instance: I,
  relation: ModelRelationKey<I>,
  value: I[ModelRelationKey<I>],
) => {
  forceFill(instance, { [relation]: value } as any);
  markSynced(instance, relation);
  // eslint-disable-next-line no-param-reassign
  instance.$loaded[relation] = true;
};
