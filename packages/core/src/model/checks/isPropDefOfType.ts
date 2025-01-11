import { ModelAttribute, ModelId, ModelRelation } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if value is a property definition of the given type.
 *
 * @param value
 * @param propType
 *
 * @internal
 */
export default <P extends ModelId | ModelAttribute | ModelRelation>(
  value: unknown,
  propType: P['$VALUE_PROP_TYPE'],
): value is P => isFosciaType(value, SYMBOL_MODEL_PROP)
  && '$VALUE_PROP_TYPE' in value
  && value.$VALUE_PROP_TYPE === propType;
