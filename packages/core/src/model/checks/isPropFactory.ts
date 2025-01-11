import { ModelPropFactory } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_FACTORY } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if value is a property definition factory.
 *
 * @param value
 *
 * @internal
 */
export default (
  value: unknown,
): value is ModelPropFactory => isFosciaType(value, SYMBOL_MODEL_PROP_FACTORY);
