import { Action, ActionFactory } from '@foscia/core';
import { sequentialTransform } from '@foscia/shared';
import makeActionMockedHistoryItem from '@foscia/test/makeActionMockedHistoryItem';
import makeActionMockedRun from '@foscia/test/makeActionMockedRun';
import {
  ActionFactoryMock,
  ActionMockedHistoryItem,
  ActionMockedPredicate,
  ActionMockedResult,
  ActionMockedRun,
  ActionMockedRunOptions,
} from '@foscia/test/types';
import UnexpectedMockedRunError from '@foscia/test/unexpectedMockedRunError';

export default function makeActionFactoryMock<A extends any[], C extends {}, E extends {}>(
  factory: ActionFactory<A, C, E>,
): ActionFactoryMock<A, C, E> {
  const mocks = [] as ActionMockedRun[];
  const history = [] as ActionMockedHistoryItem[];

  const makeMockedRun = <RC extends {}>(
    result?: ActionMockedResult<RC> | ActionMockedRunOptions<RC>,
    predicate?: ActionMockedPredicate<RC>,
  ) => {
    const options = result !== null && typeof result === 'object' ? result : { result, predicate };

    return makeActionMockedRun(options);
  };

  const findMockedRun = <RC extends {}>(context: RC) => sequentialTransform(
    mocks.map((mockedRun) => async (prev: ActionMockedRun<RC> | null) => {
      if (prev) {
        return prev;
      }

      return await mockedRun.shouldRun(context) ? mockedRun : null;
    }),
    null,
  );

  const forgetMockedRun = async <RC extends {}>(mockedRun: ActionMockedRun<RC>) => {
    if (await mockedRun.shouldForget()) {
      const index = mocks.indexOf(mockedRun);
      if (index !== -1) {
        mocks.splice(index, 1);
      }
    }
  };

  const runMockedRun = async <RC extends {}, RE extends {}>(action: Action<RC, RE>) => {
    const context = await action.useContext();

    history.push(makeActionMockedHistoryItem(context));

    const mockedRun = await findMockedRun(context);
    if (!mockedRun) {
      throw new UnexpectedMockedRunError(context);
    }

    try {
      const result = await mockedRun.run(context);

      await forgetMockedRun(mockedRun);

      return result;
    } catch (error) {
      await forgetMockedRun(mockedRun);

      throw error;
    }
  };

  const makeAction = (...args: A) => new Proxy(factory(...args), {
    get: (target, property) => (
      property === 'run'
        ? () => runMockedRun(target)
        : target[property as keyof Action<C, E>]
    ),
  });

  const mockResult = <RC extends {} = any>(
    result?: ActionMockedResult<RC> | ActionMockedRunOptions<RC>,
    predicate?: ActionMockedPredicate<RC>,
  ) => {
    const mockedRun = makeMockedRun(result, predicate);

    mocks.push(mockedRun);
  };

  const mockResultOnce = <RC extends {} = any>(
    result?: ActionMockedResult<RC>,
    predicate?: ActionMockedPredicate<RC>,
    options?: ActionMockedRunOptions<RC>,
  ) => mockResult({ ...options, result, predicate, times: 1 });

  /**
   * Mock result to given value for only 2 times.
   *
   * @param result
   * @param predicate
   * @param options
   */
  const mockResultTwice = <RC extends {} = any>(
    result?: ActionMockedResult<RC>,
    predicate?: ActionMockedPredicate<RC>,
    options?: ActionMockedRunOptions<RC>,
  ) => mockResult({ ...options, result, predicate, times: 2 });

  /**
   * Mock result to given value for only "n" times.
   *
   * @param times
   * @param result
   * @param predicate
   * @param options
   */
  const mockResultTimes = <RC extends {} = any>(
    times: number,
    result?: ActionMockedResult<RC>,
    predicate?: ActionMockedPredicate<RC>,
    options?: ActionMockedRunOptions<RC>,
  ) => mockResult({ ...options, result, predicate, times });

  /**
   * Reset the given mocks.
   */
  const resetMocks = () => {
    mocks.length = 0;
  };

  /**
   * Reset the ran contexts history.
   */
  const resetHistory = () => {
    history.length = 0;
  };

  /**
   * Reset both mocked runs and ran contexts history.
   */
  const reset = () => {
    resetMocks();
    resetHistory();
  };

  return {
    get history(): readonly ActionMockedHistoryItem[] {
      return history;
    },
    makeAction,
    mockResult,
    mockResultOnce,
    mockResultTwice,
    mockResultTimes,
    resetMocks,
    resetHistory,
    reset,
  };
}
