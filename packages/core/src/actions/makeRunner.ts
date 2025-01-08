import makeContextFunctionFactory from '@foscia/core/actions/makeContextFunctionFactory';
import { ContextRunner } from '@foscia/core/actions/types';
import { SYMBOL_ACTION_CONTEXT_RUNNER } from '@foscia/core/symbols';

type ContextRunnerFactory =
  | ((...args: any[]) => ContextRunner<any, any>)
  | ((...args: never[]) => ContextRunner<any, any>);

/**
 * Make a context runner factory with incorporated metadata (name, arguments).
 *
 * @param name
 * @param factory
 *
 * @category Factories
 */
export default <F extends ContextRunnerFactory>(
  name: string,
  factory: F,
) => makeContextFunctionFactory(SYMBOL_ACTION_CONTEXT_RUNNER, name, factory);
