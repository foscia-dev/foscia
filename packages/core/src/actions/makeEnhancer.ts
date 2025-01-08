import makeContextFunctionFactory from '@foscia/core/actions/makeContextFunctionFactory';
import { ContextEnhancer } from '@foscia/core/actions/types';
import { SYMBOL_ACTION_CONTEXT_ENHANCER } from '@foscia/core/symbols';

type ContextEnhancerFactory =
  | ((...args: any[]) => ContextEnhancer<any, any>)
  | ((...args: never[]) => ContextEnhancer<any, any>);

/**
 * Make a context enhancer factory with incorporated metadata (name, arguments).
 *
 * @param name
 * @param factory
 *
 * @category Factories
 */
export default (<F extends ContextEnhancerFactory>(
  name: string,
  factory: F,
) => makeContextFunctionFactory(SYMBOL_ACTION_CONTEXT_ENHANCER, name, factory));
