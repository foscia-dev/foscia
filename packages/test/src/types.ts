import {
  Action,
  ActionCall,
  ActionFactory,
  AnonymousEnhancer,
  AnonymousRunner,
} from '@foscia/core';
import { Dictionary } from '@foscia/shared';

/**
 * Action test call with parsed properties from enhancer or runner
 * (name, arguments).
 *
 * @internal
 */
export type ActionTestNamedCall = {
  name: string;
  args: any[];
  depth: number;
  calls: ActionTestCall[];
  original: ActionCall;
};

/**
 * Action test call without parsed properties from anonymous enhancer or runner.
 *
 * @internal
 */
export type ActionTestAnonymousCall = {
  name: null;
  args: null;
  depth: number;
  calls: ActionTestCall[];
  original: ActionCall;
};

/**
 * Action test call with parsed properties when available (name, arguments).
 *
 * @internal
 */
export type ActionTestCall =
  | ActionTestNamedCall
  | ActionTestAnonymousCall;

/**
 * Test context wrapper used to create callbacks, predicates and expectations.
 *
 * @internal
 */
export type ActionTestContext = {
  /**
   * Context which was computed just before action run.
   *
   * @experimental
   */
  context: Dictionary<any>;
  /**
   * Helper to inspect enhancers and runners calls.
   *
   * @experimental
   */
  calls: {
    /**
     * Check if call stack contain a given enhancer or runner call.
     *
     * @param predicate
     *
     * @experimental
     */
    has(predicate: ((testCall: ActionTestCall) => boolean) | string): boolean;
    /**
     * Get arguments for a given enhancer or runner call.
     *
     * @param predicate
     *
     * @experimental
     */
    args(predicate: ((testCall: ActionTestCall) => boolean) | string): any[];
    /**
     * Find a named enhancer or runner call using its name.
     *
     * @param predicate
     *
     * @experimental
     */
    find(predicate: string): ActionTestNamedCall | null;
    /**
     * Find an enhancer or runner call using a predicate.
     *
     * @param predicate
     *
     * @experimental
     */
    find(predicate: (testCall: ActionTestCall) => boolean): ActionTestCall | null;
    /**
     * Find named enhancers or runners calls using their common name.
     *
     * @param predicate
     *
     * @experimental
     */
    findAll(predicate: string): ActionTestNamedCall[];
    /**
     * Find enhancers or runners calls using a predicate.
     *
     * @param predicate
     *
     * @experimental
     */
    findAll(predicate: (testCall: ActionTestCall) => boolean): ActionTestCall[];
    /**
     * Get the size of the root calls stack.
     *
     * @experimental
     */
    size(): number;
    /**
     * Get the root calls stack.
     *
     * @experimental
     */
    tree(): ActionTestCall[];
    /**
     * Get the flattened calls stack.
     *
     * @experimental
     */
    all(): ActionTestCall[];
    /**
     * Get the original action calls.
     *
     * @experimental
     */
    originals(): ActionCall[];
  };
};

/**
 * Mock of one or many action.
 *
 * @internal
 */
export type ActionMock = {
  /**
   * Tells the mock to only run once.
   *
   * @experimental
   */
  once(): ActionMock;
  /**
   * Tells the mock to only run twice.
   *
   * @experimental
   */
  twice(): ActionMock;
  /**
   * Tells the mock to only run `n` times.
   *
   * @experimental
   */
  times(n: number): ActionMock;
  /**
   * Tells the mock to only run when predicate is truthy.
   *
   * @param predicate
   *
   * @experimental
   */
  when(predicate: (context: ActionTestContext) => unknown): ActionMock;
  /**
   * Tells the mock to return given value when action runs.
   *
   * @param value
   *
   * @experimental
   */
  return(value: unknown | ((context: ActionTestContext) => unknown)): ActionMock;
  /**
   * Schedule expectation callback to run on action run.
   *
   * @param expectation
   *
   * @experimental
   */
  expect(expectation: (context: ActionTestContext) => unknown): ActionMock;
  /**
   * Check if the mock should run.
   *
   * @param context
   *
   * @internal
   */
  shouldRun(context: ActionTestContext): Promise<boolean>;
  /**
   * Check if the mock should be removed from available action mocks.
   *
   * @param context
   *
   * @internal
   */
  shouldRemove(context: ActionTestContext): Promise<boolean>;
  /**
   * Run the mock.
   *
   * @param context
   *
   * @internal
   */
  run(context: ActionTestContext): Promise<unknown>;
};

/**
 * Action factory mock history item.
 *
 * @internal
 */
export type ActionFactoryMockHistoryItem = {
  /**
   * Action test context which was created for this run.
   *
   * @experimental
   */
  context: ActionTestContext;
  /**
   * Action mock which handled this run.
   *
   * @experimental
   */
  mock: ActionMock;
  /**
   * Result returned by the action when it succeeded.
   *
   * @experimental
   */
  result?: unknown;
  /**
   * Error thrown by the action when it failed.
   *
   * @experimental
   */
  error?: unknown;
};

/**
 * Action factory mock.
 *
 * @experimental
 */
export type ActionFactoryMock<C extends {}> = {
  /**
   * History of action test context which were ran.
   *
   * @experimental
   */
  readonly history: ActionFactoryMockHistoryItem[];
  /**
   * Make an action object.
   *
   * @internal
   */
  make(
    ...immediateEnhancers: (AnonymousEnhancer<any, any> | AnonymousRunner<any, any>)[]
  ): Action<C>;
  /**
   * Make an action mock.
   *
   * @param value
   *
   * @experimental
   */
  mock(value?: unknown | ((context: ActionTestContext) => unknown)): ActionMock;
  /**
   * Reset all configured mocks and history.
   *
   * @experimental
   */
  reset(): void;
};

/**
 * Proxy of an action factory which can easily be mocked.
 *
 * @internal
 */
export type ActionMockableFactory<Context extends {}> = {
  /**
   * Mock when mocking actions is activated.
   *
   * @internal
   */
  $mock: ActionFactoryMock<Context> | null;
  /**
   * Real implementation of action factory.
   *
   * @internal
   */
  $real: ActionFactory<Context>;
} & ActionFactory<Context>;
