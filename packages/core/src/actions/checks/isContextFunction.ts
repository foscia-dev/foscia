import isWhenContextFunction from '@foscia/core/actions/checks/isWhenContextFunction';
import { ContextFunction } from '@foscia/core/actions/types';
import {
  SYMBOL_ACTION_CONTEXT_ENHANCER,
  SYMBOL_ACTION_CONTEXT_RUNNER,
} from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if given value is a context function with name and arguments.
 *
 * @param value
 *
 * @internal
 */
export default (value: unknown): value is ContextFunction => (
  isWhenContextFunction(value)
  || isFosciaType(value, SYMBOL_ACTION_CONTEXT_ENHANCER)
  || isFosciaType(value, SYMBOL_ACTION_CONTEXT_RUNNER)
);
