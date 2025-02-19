import {
  Action,
  ActionFactory,
  AnonymousEnhancer,
  AnonymousRunner,
  FosciaError,
  isWhen,
  runHooks,
  withoutHooks,
} from '@foscia/core';
import {
  Dictionary,
  Middleware,
  sequentialTransform,
  throughMiddlewares,
  value,
} from '@foscia/shared';
import makeActionMock from '@foscia/test/makeActionMock';
import makeActionTestContext from '@foscia/test/makeActionTestContext';
import { ActionFactoryMock, ActionFactoryMockHistoryItem, ActionMock } from '@foscia/test/types';
import UnexpectedActionError from '@foscia/test/unexpectedActionError';

/**
 * Create an action factory mock.
 *
 * @internal
 */
export default <C extends {}>(
  factory: ActionFactory<C>,
) => {
  const mocks = [] as ActionMock[];
  const history = [] as ActionFactoryMockHistoryItem[];

  const unnestRunners = async (
    action: Action<any>,
    runners: AnonymousRunner<any, any>[],
  ): Promise<AnonymousRunner<any, any>[]> => {
    const runner = runners[runners.length - 1];
    if (isWhen(runner)) {
      const callback = await value(runner.meta.args[0] as Function)
        ? runner.meta.args[1]
        : runner.meta.args[2];
      if (!callback) {
        return [...runners, () => undefined];
      }

      if (isWhen(callback)) {
        return unnestRunners(action, [...runners, callback]);
      }

      return [...runners, callback];
    }

    return runners;
  };

  const run = async (
    action: Action<any>,
    enhancers: (AnonymousEnhancer<any, any> | AnonymousRunner<any, any>)[],
  ) => {
    if (enhancers.length === 0) {
      throw new FosciaError('`run` must be called with at least one runner function.');
    }

    const rootRunner = enhancers.pop() as AnonymousRunner<any, any>;

    (action as any).use(...enhancers);

    const { middlewares, ...context } = await action.useContext() as Dictionary;
    action.updateContext(context);

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
      throw new UnexpectedActionError(testContext);
    }

    await runHooks(action, 'running', { action, runner: rootRunner });

    try {
      const result = await throughMiddlewares(
        (middlewares ?? []) as Middleware<Action, unknown>[],
        async (a) => withoutHooks(a, async () => mock.run(testContext)),
      )(action);

      await runHooks(action, 'success', { action, result });

      history.push({ context: testContext, mock, result, error: undefined });

      return result;
    } catch (error) {
      await runHooks(action, 'error', { action, error });

      history.push({ context: testContext, mock, result: undefined, error });

      throw error;
    } finally {
      if (await mock.shouldRemove(testContext)) {
        const mockIndex = mocks.indexOf(mock);
        if (mockIndex !== -1) {
          mocks.splice(mockIndex, 1);
        }
      }

      await runHooks(action, 'finally', { action });
    }
  };

  const make = (
    ...immediateEnhancers: (AnonymousEnhancer<any, any> | AnonymousRunner<any, any>)[]
  ) => {
    const action = new Proxy(factory(), {
      get: (target, property) => (
        property === 'run'
          ? (
            ...enhancers: (AnonymousEnhancer<any, any> | AnonymousRunner<any, any>)[]
          ) => run(target, enhancers)
          : target[property as keyof Action<C>]
      ),
    });

    return immediateEnhancers.length
      ? (action.run as any)(...immediateEnhancers)
      : action;
  };

  const mock = (result?: unknown) => {
    const newMock = makeActionMock().return(result);

    mocks.push(newMock);

    return newMock;
  };

  const reset = () => {
    mocks.length = 0;
    history.length = 0;
  };

  return { history, make, mock, reset } as ActionFactoryMock<C>;
};
