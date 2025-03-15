import isInstance from '@foscia/core/model/checks/isInstance';
import isRelation from '@foscia/core/model/props/checks/isRelation';
import { ModelInstance, ModelRelationDotKey } from '@foscia/core/model/types';
import { Arrayable, wrap } from '@foscia/shared';

/**
 * Check if given relations are loaded on model.
 *
 * It will also check for sub relations through each related instances.
 *
 * @param instance
 * @param relations
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { loaded } from '@foscia/core';
 *
 * const isFullyLoaded = loaded(post, ['comments', 'comments.author']);
 * if (!isFullyLoaded) {
 * }
 * ```
 */
const loaded = <I extends ModelInstance>(
  instance: I,
  relations: Arrayable<ModelRelationDotKey<I>>,
): boolean => wrap(relations).every((dotKey) => {
  const [currentKey, ...subKeys] = dotKey.split('.');
  if (!isRelation(instance.$model.$schema[currentKey])) {
    return true;
  }

  if (!instance.$loaded[currentKey]) {
    return false;
  }

  const subDotKey = subKeys.join('.');
  if (!subDotKey) {
    return true;
  }

  const related = instance[currentKey];
  if (Array.isArray(related)) {
    return related.every((r) => loaded<ModelInstance>(r, subDotKey));
  }

  return isInstance(related) ? loaded<ModelInstance>(related, subDotKey) : true;
});

export default loaded;
