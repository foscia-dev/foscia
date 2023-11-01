import { Action, ActionFactory } from '@foscia/core';
import ActionMockedHistoryItem from '@foscia/test/actionMockedHistoryItem';
import ActionMockedRun from '@foscia/test/actionMockedRun';
import {
  ActionMockedPredicate,
  ActionMockedResult,
  ActionMockedRunOptions,
} from '@foscia/test/types';
import UnexpectedMockedRunError from '@foscia/test/unexpectedMockedRunError';
import { sequentialTransform } from '@foscia/shared';

/**
 * Mock for an action factory with mocked results and ran contexts history.
 */
export default class ActionFactoryMock<A extends any[], C extends {}, E extends {}> {
  /**
   * The factory which is currently mocked.
   */
  private readonly factory: ActionFactory<A, C, E>;

  /**
   * The mocks for run results.
   */
  private readonly mocks: ActionMockedRun[];

  /**
   * The history of ran contexts.
   */
  private readonly history: ActionMockedHistoryItem[];

  /**
   * ActionFactoryMock constructor.
   *
   * @param factory
   */
  public constructor(factory: ActionFactory<A, C, E>) {
    this.factory = factory;
    this.mocks = [];
    this.history = [];
  }

  /**
   * Make a proxy of action built using mocked factory.
   *
   * @param args
   */
  public makeAction(...args: A) {
    return new Proxy(this.factory(...args), {
      get: (target, property) => (
        property === 'run'
          ? () => this.runMockedRun(target)
          : target[property as keyof Action<C, E>]
      ),
    });
  }

  /**
   * Mock result to given value for indeterminate time.
   *
   * @param result
   * @param predicate
   */
  public mockResult<RC extends {} = any>(
    result?: ActionMockedResult<RC> | ActionMockedRunOptions<RC>,
    predicate?: ActionMockedPredicate<RC>,
  ) {
    const mockedRun = this.makeMockedRun(result, predicate);

    this.mocks.push(mockedRun);

    return this;
  }

  /**
   * Mock result to given value for only 1 time.
   *
   * @param result
   * @param predicate
   * @param options
   */
  public mockResultOnce<RC extends {} = any>(
    result?: ActionMockedResult<RC>,
    predicate?: ActionMockedPredicate<RC>,
    options?: ActionMockedRunOptions<RC>,
  ) {
    return this.mockResult({ ...options, result, predicate, times: 1 });
  }

  /**
   * Mock result to given value for only 2 times.
   *
   * @param result
   * @param predicate
   * @param options
   */
  public mockResultTwice<RC extends {} = any>(
    result?: ActionMockedResult<RC>,
    predicate?: ActionMockedPredicate<RC>,
    options?: ActionMockedRunOptions<RC>,
  ) {
    return this.mockResult({ ...options, result, predicate, times: 2 });
  }

  /**
   * Mock result to given value for only "n" times.
   *
   * @param times
   * @param result
   * @param predicate
   * @param options
   */
  public mockResultTimes<RC extends {} = any>(
    times: number,
    result?: ActionMockedResult<RC>,
    predicate?: ActionMockedPredicate<RC>,
    options?: ActionMockedRunOptions<RC>,
  ) {
    return this.mockResult({ ...options, result, predicate, times });
  }

  /**
   * Reset the given mocks.
   */
  public resetMocks() {
    this.mocks.length = 0;

    return this;
  }

  /**
   * Get the number of ran contexts in history.
   */
  public get historyCount() {
    return this.history.length;
  }

  /**
   * Get the whole ran contexts history.
   */
  public get allHistory() {
    return [...this.history];
  }

  /**
   * Get the context of the "n" ran context.
   *
   * @param index
   */
  public historyAt(index: number): ActionMockedHistoryItem | null {
    return this.history[index] ?? null;
  }

  /**
   * Reset the ran contexts history.
   */
  public resetHistory() {
    this.history.length = 0;

    return this;
  }

  /**
   * Reset both mocked runs and ran contexts history.
   */
  public reset() {
    return this
      .resetMocks()
      .resetHistory();
  }

  private makeMockedRun<RC extends {}>(
    result?: ActionMockedResult<RC> | ActionMockedRunOptions<RC>,
    predicate?: ActionMockedPredicate<RC>,
  ) {
    return result !== null && typeof result === 'object'
      ? new ActionMockedRun(result)
      : new ActionMockedRun({ result, predicate });
  }

  private async runMockedRun<RC extends {}, RE extends {}>(action: Action<RC, RE>) {
    const context = await action.useContext();

    this.history.push(new ActionMockedHistoryItem(context));

    const mockedRun = await this.findMockedRun(context);
    if (!mockedRun) {
      throw new UnexpectedMockedRunError(context);
    }

    try {
      const result = await mockedRun.run(context);

      await this.forgetMockedRun(mockedRun);

      return result;
    } catch (error) {
      await this.forgetMockedRun(mockedRun);

      throw error;
    }
  }

  private findMockedRun<RC extends {}>(context: RC) {
    return sequentialTransform(
      this.mocks.map((mockedRun) => async (prev: ActionMockedRun<RC> | null) => {
        if (prev) {
          return prev;
        }

        return await mockedRun.shouldRun(context) ? mockedRun : null;
      }),
      null,
    );
  }

  private async forgetMockedRun<RC extends {}>(mockedRun: ActionMockedRun<RC>) {
    if (await mockedRun.shouldForget()) {
      const index = this.mocks.indexOf(mockedRun);
      if (index !== -1) {
        this.mocks.splice(index, 1);
      }
    }
  }
}
