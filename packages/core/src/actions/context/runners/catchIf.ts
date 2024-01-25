import makeRunnersExtension from '@foscia/core/actions/extensions/makeRunnersExtension';
import { Action, ActionParsedExtension, ContextRunner } from '@foscia/core/actions/types';
import { Awaitable } from '@foscia/shared';

export type CatchCallback<C extends {}, E extends {}, CD> = (
  error: unknown,
) => Awaitable<ContextRunner<C, E, Awaitable<CD>> | boolean>;

/**
 * Run given runner and catch errors using catchCallback.
 * If catchCallback is omitted, will return null on error.
 * If catchCallback returns a function, will run it as an action's runner.
 * Else, will ignore error and return null only if callback for error is truthy.
 *
 * @param runner
 * @param catchCallback
 *
 * @category Runners
 */
export default function catchIf<C extends {}, E extends {}, RD, CD = null>(
  runner: ContextRunner<C, E, Awaitable<RD>>,
  catchCallback?: CatchCallback<C, E, CD>,
) {
  return async (action: Action<C, E>): Promise<RD | CD> => {
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
  };
}

type RunnerExtension = ActionParsedExtension<{
  catchIf<C extends {}, E extends {}, RD, CD = null>(
    this: Action<C, E>,
    runner: ContextRunner<C, E, Awaitable<RD>>,
    catchCallback?: CatchCallback<C, E, CD>,
  ): Promise<Awaited<RD> | Awaited<CD>>;
}>;

catchIf.extension = makeRunnersExtension({ catchIf }) as RunnerExtension;
