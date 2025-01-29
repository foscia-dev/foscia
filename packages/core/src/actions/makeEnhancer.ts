import makeContextFunctionFactory from '@foscia/core/actions/makeContextFunctionFactory';
import { ContextEnhancer } from '@foscia/core/actions/types';
import { SYMBOL_ACTION_CONTEXT_ENHANCER } from '@foscia/core/symbols';

/**
 * Make a context enhancer factory with incorporated metadata (name, arguments).
 *
 * @param name
 * @param factory
 *
 * @category Factories
 */
// eslint-disable-next-line max-len
export default (<F extends ((...args: any[]) => ContextEnhancer<any, any>) | ((...args: never[]) => ContextEnhancer<any, any>)>(
  name: string,
  factory: F,
) => makeContextFunctionFactory(SYMBOL_ACTION_CONTEXT_ENHANCER, name, factory));
