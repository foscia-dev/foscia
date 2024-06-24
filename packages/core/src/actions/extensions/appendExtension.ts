import {
  Action,
  ContextEnhancer,
  ContextRunner,
  WithParsedExtension,
} from '@foscia/core/actions/types';
import { makeDescriptorHolder } from '@foscia/shared';

/**
 * Append extension to a context enhancer.
 *
 * @param name
 * @param factory
 * @param method
 *
 * @since 0.10.0
 *
 * @todo Improve generic typing.
 */
function appendExtension<
  C extends {},
  R extends {},
  K extends string,
  // eslint-disable-next-line max-len
  V extends ((...args: any[]) => ContextEnhancer<C, any, R>) | ((...args: never[]) => ContextEnhancer<C, any, R>),
>(name: K, factory: V, method: 'use'): WithParsedExtension<V, {
  [I in K]: <E extends {}>(this: Action<C, E>, ...args: Parameters<V>) => Action<R, E>;
}>;

/**
 * Append extension to a context runner.
 *
 * @param name
 * @param factory
 * @param method
 *
 * @since 0.10.0
 *
 * @todo Improve generic typing.
 */
function appendExtension<
  C extends {},
  R extends any,
  K extends string,
  // eslint-disable-next-line max-len
  V extends ((...args: any[]) => ContextRunner<C, any, R>) | ((...args: never[]) => ContextRunner<C, any, R>),
>(name: K, factory: V, method: 'run'): WithParsedExtension<V, {
  [I in K]: <E extends {}>(this: Action<C, E>, ...args: Parameters<V>) => R;
}>;

/**
 * Append extension to a context enhancer or runner.
 *
 * @param name
 * @param factory
 * @param method
 *
 * @since 0.10.0
 */
function appendExtension<
  K extends string,
  V extends (...args: any[]) => ContextEnhancer<any, any, any> | ContextRunner<any, any, any>,
>(name: K, factory: V, method: 'use' | 'run'): V {
  // eslint-disable-next-line no-param-reassign
  (factory as any).extension = () => ({
    [name]: makeDescriptorHolder(Object.getOwnPropertyDescriptor({
      [name](this: Action<any>, ...args: any[]) {
        return (this[method] as any)(factory(...args));
      },
    }, name)!),
  });

  return factory;
}

export default appendExtension;
