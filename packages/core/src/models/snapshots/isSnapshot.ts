import { ModelShallowSnapshot, ModelSnapshot } from '@foscia/core/models/types';
import { SYMBOL_MODEL_SNAPSHOT } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if value is a snapshot.
 *
 * @param value
 *
 * @category Utilities
 */
export default function isSnapshot<S extends ModelSnapshot<any> | ModelShallowSnapshot<any>>(
  value: unknown,
): value is S {
  return isFosciaType(value, SYMBOL_MODEL_SNAPSHOT);
}
