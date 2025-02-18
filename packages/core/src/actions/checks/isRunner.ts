import { Runner } from '@foscia/core/actions/types';
import { SYMBOL_ACTION_RUNNER } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if given value is a {@link Runner | `Runner`} function.
 *
 * @param value
 *
 * @internal
 */
export default (value: unknown): value is Runner => (
  isFosciaType(value, SYMBOL_ACTION_RUNNER)
);
