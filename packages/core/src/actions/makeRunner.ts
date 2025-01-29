import makeContextFunctionFactory from '@foscia/core/actions/makeContextFunctionFactory';
import { ContextRunner } from '@foscia/core/actions/types';
import { SYMBOL_ACTION_CONTEXT_RUNNER } from '@foscia/core/symbols';

/**
 * Make a context runner factory with incorporated metadata (name, arguments).
 *
 * @param name
 * @param factory
 *
 * @category Factories
 */
// eslint-disable-next-line max-len
export default <F extends ((...args: any[]) => ContextRunner<any, any>) | ((...args: never[]) => ContextRunner<any, any>)>(
  name: string,
  factory: F,
) => makeContextFunctionFactory(SYMBOL_ACTION_CONTEXT_RUNNER, name, factory);
