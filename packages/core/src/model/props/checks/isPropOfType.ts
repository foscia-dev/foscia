import { ModelAttribute, ModelId, ModelRelation } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if value is a property of the given type.
 *
 * @param value
 * @param type
 *
 * @internal
 */
const isPropOfType: {
  (value: unknown, type: ModelId['$VALUE_PROP_KIND']): value is ModelId;
  (value: unknown, type: ModelAttribute['$VALUE_PROP_KIND']): value is ModelAttribute;
  (value: unknown, type: ModelRelation['$VALUE_PROP_KIND']): value is ModelRelation;
} = <P extends ModelId | ModelAttribute | ModelRelation>(
  value: unknown,
  type: P['$VALUE_PROP_KIND'],
): value is P => isFosciaType(value, SYMBOL_MODEL_PROP)
  && '$VALUE_PROP_KIND' in value
  && value.$VALUE_PROP_KIND === type;

export default isPropOfType;
