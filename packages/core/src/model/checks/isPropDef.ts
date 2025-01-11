import isAttributeDef from '@foscia/core/model/checks/isAttributeDef';
import isIdDef from '@foscia/core/model/checks/isIdDef';
import isRelationDef from '@foscia/core/model/checks/isRelationDef';
import { ModelAttribute, ModelId, ModelRelation } from '@foscia/core/model/types';

/**
 * Check if value is a property definition.
 *
 * @param value
 *
 * @internal
 */
export default (
  value: unknown,
): value is ModelId | ModelAttribute | ModelRelation => isIdDef(value)
  || isAttributeDef(value)
  || isRelationDef(value);
