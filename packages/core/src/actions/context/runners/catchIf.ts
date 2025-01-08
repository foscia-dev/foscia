import makeRunner from '@foscia/core/actions/makeRunner';
import { Action, ContextRunner } from '@foscia/core/actions/types';
import { Awaitable } from '@foscia/shared';

export type CatchCallback<C extends {}, CD> = (
  error: unknown,
) => Awaitable<ContextRunner<C, Awaitable<CD>> | boolean>;

/**
 * Run given runner and catch errors using catchCallback.
 * If catchCallback is omitted, it will return null on any error.
 * If catchCallback returns a function, will run it as an action's runner.
 * Else, will ignore error and return null only if callback for error is truthy.
 *
 * @param runner
 * @param catchCallback
 *
 * @category Runners
 *
 * @example
 * ```typescript
 * import { catchIf, one, query } from '@foscia/core';
 *
 * const postOrNull = await action().run(
 *   query(Post, '123'),
 *   catchIf(one(), (error) => error instanceof ErrorToCatch),
 * );
 * ```
 */
export default makeRunner('catchIf', <C extends {}, RD, CD = null>(
  runner: ContextRunner<C, Awaitable<RD>>,
  catchCallback?: CatchCallback<C, CD>,
) => async (action: Action<C>): Promise<RD | CD> => {
  try {
    return await action.run(runner);
  } catch (error) {
    const catchRunner = await (catchCallback ?? (() => true))(error);
    if (typeof catchRunner === 'function') {
      return action.run(catchRunner);
    }

    if (!catchRunner) {
      throw error;
    }

    return null as any;
  }
});
