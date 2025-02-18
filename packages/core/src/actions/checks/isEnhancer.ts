import { Enhancer } from '@foscia/core/actions/types';
import { SYMBOL_ACTION_ENHANCER } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if given value is an {@link Enhancer | `Enhancer`} function.
 *
 * @param value
 *
 * @internal
 */
export default (value: unknown): value is Enhancer => (
  isFosciaType(value, SYMBOL_ACTION_ENHANCER)
);
