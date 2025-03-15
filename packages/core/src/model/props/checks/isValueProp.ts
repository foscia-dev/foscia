import isAttribute from '@foscia/core/model/props/checks/isAttribute';
import isId from '@foscia/core/model/props/checks/isId';
import isRelation from '@foscia/core/model/props/checks/isRelation';
import { ModelAttribute, ModelId, ModelRelation } from '@foscia/core/model/types';

/**
 * Check if value is an ID, attribute or relation.
 *
 * @param value
 *
 * @internal
 */
export default (
  value: unknown,
): value is ModelId | ModelAttribute | ModelRelation => isId(value)
  || isAttribute(value)
  || isRelation(value);
