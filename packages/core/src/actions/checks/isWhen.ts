import { When } from '@foscia/core/actions/types';
import { SYMBOL_ACTION_WHEN } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if given value is a {@link When | `When`} function.
 *
 * @param value
 *
 * @internal
 */
export default (value: unknown): value is When => (
  isFosciaType(value, SYMBOL_ACTION_WHEN)
);
