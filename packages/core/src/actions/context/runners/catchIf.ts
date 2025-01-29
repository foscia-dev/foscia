import makeRunner from '@foscia/core/actions/makeRunner';
import { Action, ContextRunner } from '@foscia/core/actions/types';
import { Awaitable } from '@foscia/shared';

export default makeRunner('catchIf', (<C extends {}, RD, CD = null>(
  runner: ContextRunner<C, Awaitable<RD>>,
  catchCallback: (error: unknown) => Awaitable<ContextRunner<C, Awaitable<CD>> | boolean>,
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
}) as {
  /**
   * Run given runner and catch all errors to return null.
   *
   * @param runner
   *
   * @category Runners
   *
   * @example
   * ```typescript
   * import { catchIf, oneOrFail, query } from '@foscia/core';
   *
   * const postOrNull = await action().run(
   *   query(Post, '123'),
   *   catchIf(oneOrFail()),
   * );
   * ```
   */<C extends {}, T>(
    runner: ContextRunner<C, Awaitable<T>>,
  ): ContextRunner<C, T | null>;
  /**
   * Run given runner and catch errors to `null` if catch callback returns a truthy value.
   * If the catch callback returns another action runner, it will run it.
   *
   * @param runner
   * @param catchCallback
   *
   * @category Runners
   *
   * @example
   * ```typescript
   * import { catchIf, oneOrFail, query } from '@foscia/core';
   *
   * const postOrNull = await action().run(
   *   query(Post, '123'),
   *   catchIf(oneOrFail(), (error) => error instanceof ErrorToCatch),
   * );
   * ```
   */<C extends {}, T, U = null>(
    runner: ContextRunner<C, Awaitable<T>>,
    catchCallback: (error: unknown) => Awaitable<ContextRunner<C, Awaitable<U>> | boolean>,
  ): ContextRunner<C, T | U>;
});
