import { Action, ActionFactory } from '@foscia/core';
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
 * Mocked action run configuration for mocked action factory.
 */
export type ActionMockedRun<Context extends {} = any> = {
  shouldRun: (context: Context) => Promise<boolean>;
  shouldForget: () => Promise<boolean>;
  run: (context: Context) => Promise<void>;
};

/**
 * History item wrapper for a ran context.
 */
export type ActionMockedHistoryItem = {
  context: any;
};

/**
 * Mock for an action factory with mocked results and ran context history.
 */
export interface ActionFactoryMock<Args extends any[], Context extends {}, Extension extends {}> {
  readonly history: readonly ActionMockedHistoryItem[];
  makeAction: (...args: Args) => Action<Context, Extension>;
  mockResult: <RC extends {} = any>(
    result?: ActionMockedResult<RC> | ActionMockedRunOptions<RC>,
    predicate?: ActionMockedPredicate<RC>,
  ) => void;
  mockResultOnce: <RC extends {} = any>(
    result?: ActionMockedResult<RC>,
    predicate?: ActionMockedPredicate<RC>,
    options?: ActionMockedRunOptions<RC>,
  ) => void;
  mockResultTwice: <RC extends {} = any>(
    result?: ActionMockedResult<RC>,
    predicate?: ActionMockedPredicate<RC>,
    options?: ActionMockedRunOptions<RC>,
  ) => void;
  mockResultTimes: <RC extends {} = any>(
    times: number,
    result?: ActionMockedResult<RC>,
    predicate?: ActionMockedPredicate<RC>,
    options?: ActionMockedRunOptions<RC>,
  ) => void;
  resetMocks: () => void;
  resetHistory: () => void;
  reset: () => void;
}

/**
 * Proxy of an action factory which can easily be mocked.
 */
export type ActionMockableFactory<Args extends any[], Context extends {}, Extension extends {}> = {
  $mock: ActionFactoryMock<Args, Context, Extension> | null;
  $real: ActionFactory<Args, Context, Extension>;
} & ActionFactory<Args, Context, Extension>;
