import {
  Action,
  ActionFactory,
  ContextEnhancer,
  ContextRunner,
  FosciaError,
  isWhenContextFunction,
  runHooks,
} from '@foscia/core';
import { sequentialTransform, value } from '@foscia/shared';
import makeActionMock from '@foscia/test/makeActionMock';
import makeActionTestContext from '@foscia/test/makeActionTestContext';
import { ActionFactoryMock, ActionFactoryMockHistoryItem, ActionMock } from '@foscia/test/types';
import UnexpectedActionError from '@foscia/test/unexpectedActionError';

/**
 * Create an action factory mock.
 *
 * @experimental
 */
export default <A extends any[], C extends {}>(
  factory: ActionFactory<A, C>,
) => {
  const mocks = [] as ActionMock[];
  const history = [] as ActionFactoryMockHistoryItem[];

  const unnestRunners = async (
    action: Action<any>,
    runners: ContextRunner<any, any>[],
  ): Promise<ContextRunner<any, any>[]> => {
    const runner = runners[runners.length - 1];
    if (isWhenContextFunction(runner)) {
      const callback = await value(runner.meta.args[0] as Function)
        ? runner.meta.args[1]
        : runner.meta.args[2];
      if (!callback) {
        return [...runners, () => undefined];
      }

      if (isWhenContextFunction(callback)) {
        return unnestRunners(action, [...runners, callback]);
      }

      return [...runners, callback];
    }

    return runners;
  };

  const run = async (
    action: Action<any>,
    enhancers: (ContextEnhancer<any, any> | ContextRunner<any, any>)[],
  ) => {
    if (enhancers.length === 0) {
      throw new FosciaError('`run` must be called with at least one runner function.');
    }

    const rootRunner = enhancers.pop() as ContextRunner<any, any>;

    (action as any).use(...enhancers);

    const context = await action.useContext();
    const runners = await unnestRunners(action, [rootRunner]);
    const calls = action.calls();
    const testContext = makeActionTestContext(context, calls, runners);

    const mock = await sequentialTransform(mocks.map((next) => async (prev: ActionMock | null) => {
      if (prev) {
        return prev;
      }

      return await next.shouldRun(testContext) ? next : null;
    }), null);
    if (!mock) {
      throw new UnexpectedActionError(context);
    }

    await runHooks(action, 'running', { context, runner: rootRunner });

    try {
      const result = await mock.run(testContext);

      await runHooks(action, 'success', { context, result });

      history.push({ context: testContext, mock, result, error: undefined });

      return result;
    } catch (error) {
      await runHooks(action, 'error', { context, error });

      history.push({ context: testContext, mock, result: undefined, error });

      throw error;
    } finally {
      if (await mock.shouldRemove(testContext)) {
        const mockIndex = mocks.indexOf(mock);
        if (mockIndex !== -1) {
          mocks.splice(mockIndex, 1);
        }
      }

      await runHooks(action, 'finally', { context });
    }
  };

  const make = (...args: A) => new Proxy(factory(...args), {
    get: (target, property) => (
      property === 'run'
        ? (
          ...enhancers: (ContextEnhancer<any, any> | ContextRunner<any, any>)[]
        ) => run(target, enhancers)
        : target[property as keyof Action<C>]
    ),
  });

  const mock = (result?: unknown) => {
    const newMock = makeActionMock().return(result);

    mocks.push(newMock);

    return newMock;
  };

  const reset = () => {
    mocks.length = 0;
    history.length = 0;
  };

  return { history, make, mock, reset } as ActionFactoryMock<A, C>;
};
