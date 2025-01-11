import { ContextEnhancer, ContextFunctionType, ContextRunner } from '@foscia/core/actions/types';
import { SYMBOL_ACTION_CONTEXT_FUNCTION_FACTORY } from '@foscia/core/symbols';

type ContextFunctionFactory =
  | ((...args: any[]) => ContextEnhancer<any, any>)
  | ((...args: never[]) => ContextEnhancer<any, any>)
  | ((...args: any[]) => ContextRunner<any, any>)
  | ((...args: never[]) => ContextRunner<any, any>);

/**
 * Make a context function factory with metadata to track its usage.
 *
 * @param type
 * @param name
 * @param originalFactory
 *
 * @internal
 */
export default <F extends ContextFunctionFactory>(
  type: ContextFunctionType,
  name: string,
  originalFactory: F,
) => {
  const factory = (...args: any[]) => {
    const functionWithMetadata = (originalFactory as any)(...args);

    functionWithMetadata.$FOSCIA_TYPE = type;
    functionWithMetadata.meta = { factory, args };

    return functionWithMetadata;
  };

  factory.$FOSCIA_TYPE = SYMBOL_ACTION_CONTEXT_FUNCTION_FACTORY;
  factory.meta = { name };

  return factory as unknown as F;
};
