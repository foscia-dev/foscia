import { ActionFactory } from '@foscia/core';
import type ActionFactoryMock from '@foscia/test/actionFactoryMock';
import { Awaitable } from '@foscia/shared';

/**
 * Mocked action run result definition (factory function or raw value).
 */
export type ActionMockedResult<Context extends {} = any> =
  | unknown
  | ((context: Context) => Awaitable<unknown>);

/**
 * Mocked action run predicate to ensure the right context is intercepted.
 */
export type ActionMockedPredicate<Context extends {} = any> =
  (context: Context) => Awaitable<boolean | void>;

/**
 * Mocked action run expectation to run before returning result.
 */
export type ActionMockedExpectation<Context extends {} = any> =
  (context: Context) => Awaitable<void>;

/**
 * Options to configure a mocked action run.
 */
export type ActionMockedRunOptions<Context extends {} = any> = {
  result?: ActionMockedResult<Context>;
  predicate?: ActionMockedPredicate<Context>;
  expectation?: ActionMockedExpectation<Context>;
  times?: number;
};

/**
 * Proxy of an action factory which can easily be mocked.
 */
export type ActionMockableFactory<Args extends any[], Context extends {}, Extension extends {}> = {
  $mock: ActionFactoryMock<Args, Context, Extension> | null;
  $real: ActionFactory<Args, Context, Extension>;
} & ActionFactory<Args, Context, Extension>;
