import { ModelRelationProp } from '@foscia/core/models/types';
import { wrap } from '@foscia/shared';

/**
 * Resolve related models of a relation.
 *
 * @param relation
 *
 * @internal
 */
export default async function resolveRelatedModels(relation: ModelRelationProp) {
  return wrap(await relation.model());
}
