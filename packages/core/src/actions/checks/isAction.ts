import { Action } from '@foscia/core/actions/types';
import { SYMBOL_ACTION } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if given value is an {@link Action | `Action`}.
 *
 * @param value
 *
 * @internal
 */
export default (value: unknown): value is Action => (
  isFosciaType(value, SYMBOL_ACTION)
);
