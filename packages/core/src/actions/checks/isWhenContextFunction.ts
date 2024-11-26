import { ContextWhenFunction } from '@foscia/core/actions/types';
import { SYMBOL_ACTION_CONTEXT_WHEN } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if given value is a `when` context function.
 *
 * @param value
 *
 * @internal
 */
export default (value: unknown): value is ContextWhenFunction => (
  isFosciaType(value, SYMBOL_ACTION_CONTEXT_WHEN)
);
