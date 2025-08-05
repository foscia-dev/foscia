import isAttribute from '@foscia/core/models/old/props/checks/isAttribute';
import isId from '@foscia/core/models/old/props/checks/isId';
import isRelation from '@foscia/core/relations/checks/isRelation';
import { ModelAttribute, ModelId, ModelRelation } from '@foscia/core/models/oldTypes';

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
