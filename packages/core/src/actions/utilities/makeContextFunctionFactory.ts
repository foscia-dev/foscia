import { AnonymousEnhancer, AnonymousRunner } from '@foscia/core/actions/types';
import {
  SYMBOL_ACTION_ENHANCER,
  SYMBOL_ACTION_RUNNER,
  SYMBOL_ACTION_WHEN,
} from '@foscia/core/symbols';

export default ((
  type: symbol,
) => (
  name: string,
  originalFactory: Function,
) => {
  const factory = (...args: any[]) => {
    const functionWithMeta = (originalFactory as any)(...args);

    functionWithMeta.$FOSCIA_TYPE = type;
    functionWithMeta.meta = { factory, name, args };

    return functionWithMeta;
  };

  return factory;
}) as {
  /**
   * Make context function factory for enhancers.
   *
   * @param type
   *
   * @internal
   */
  (type: typeof SYMBOL_ACTION_ENHANCER): <
    // eslint-disable-next-line max-len
    F extends ((...args: any[]) => AnonymousEnhancer<any, any>) | ((...args: never[]) => AnonymousEnhancer<any, any>),
  >(name: string, factory: F) => F;
  /**
   * Make context function factory for runners.
   *
   * @param type
   *
   * @internal
   */
  (type: typeof SYMBOL_ACTION_RUNNER): <
    // eslint-disable-next-line max-len
    F extends ((...args: any[]) => AnonymousRunner<any, any>) | ((...args: never[]) => AnonymousRunner<any, any>),
  >(name: string, factory: F) => F;
  /**
   * Make context function factory for when.
   *
   * @param type
   *
   * @internal
   */
  (type: typeof SYMBOL_ACTION_WHEN): <
    // eslint-disable-next-line max-len
    F extends ((...args: any[]) => AnonymousEnhancer<any, any>) | ((...args: never[]) => AnonymousEnhancer<any, any>) | ((...args: any[]) => AnonymousRunner<any, any>) | ((...args: never[]) => AnonymousRunner<any, any>),
  >(name: string, factory: F) => F;
};
