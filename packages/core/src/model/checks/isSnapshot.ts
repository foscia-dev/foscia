import { ModelLimitedSnapshot, ModelSnapshot } from '@foscia/core/model/types';
import { SYMBOL_MODEL_SNAPSHOT } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if value is a snapshot.
 *
 * @param value
 *
 * @category Utilities
 */
export default (
  value: unknown,
): value is ModelSnapshot | ModelLimitedSnapshot => isFosciaType(value, SYMBOL_MODEL_SNAPSHOT);
