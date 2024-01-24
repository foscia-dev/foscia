import {
  Action,
  context,
  logger,
  makeActionClass,
  onError,
  onFinally,
  onRunning,
  onSuccess,
} from '@foscia/core';
import { describe, expect, it, vi } from 'vitest';

describe('unit: makeActionClass', () => {
  it.concurrent('should make an extended action', async () => {
    const dummyEnhancer = (dummy: string) => (action: Action) => action.updateContext({ dummy });
    const dummyRunner = () => async (action: Action<{ dummy: string }>) => (
      (await action.useContext()).dummy
    );

    const ActionClass = makeActionClass({
      dummyEnhance(dummy: string) {
        return this.use(dummyEnhancer(dummy));
      },
      dummyRun() {
        return (this as unknown as Action<{ dummy: string }>).run(dummyRunner());
      },
    });

    const funcAction = new ActionClass();
    expect(await funcAction.useContext()).toStrictEqual({});
    expect(await funcAction.use(dummyEnhancer('foo')).run(dummyRunner())).toStrictEqual('foo');

    const builderAction = new ActionClass();
    expect(await builderAction.useContext()).toStrictEqual({});
    expect(await builderAction.dummyEnhance('foo').dummyRun()).toStrictEqual('foo');
  });

  it('should trigger hooks', async () => {
    const ActionClass = makeActionClass();

    const loggerDebugMock = vi.spyOn(logger, 'debug').mockImplementation(() => undefined);
    const runningMock = vi.fn();
    const successMock = vi.fn();
    const errorMock = vi.fn();
    const finallyMock = vi.fn();

    const runner = () => 'dummy';

    await expect(
      new ActionClass()
        .use(onRunning(runningMock))
        .use(onSuccess(successMock))
        .use(onError(errorMock))
        .use(onFinally(finallyMock))
        .run(runner),
    ).resolves.toStrictEqual('dummy');

    expect(loggerDebugMock.mock.calls).toStrictEqual([
      ['Action running.', [{ context: {}, runner }]],
      ['Action success.', [{ context: {}, result: 'dummy' }]],
    ]);
    expect(runningMock.mock.calls).toStrictEqual([[{ context: {}, runner }]]);
    expect(successMock.mock.calls).toStrictEqual([[{ context: {}, result: 'dummy' }]]);
    expect(errorMock.mock.calls).toStrictEqual([]);
    expect(finallyMock.mock.calls).toStrictEqual([[{ context: {} }]]);

    loggerDebugMock.mockReset();
    runningMock.mockReset();
    successMock.mockReset();
    errorMock.mockReset();
    finallyMock.mockReset();

    const error = new Error('Dummy error');
    const failingRunner = () => {
      throw error;
    };

    await expect(
      new ActionClass()
        .use(onRunning(runningMock))
        .use(onSuccess(successMock))
        .use(onError(errorMock))
        .use(onFinally(finallyMock))
        .run(failingRunner),
    ).rejects.toThrowError(error);

    expect(loggerDebugMock.mock.calls).toStrictEqual([
      ['Action running.', [{ context: {}, runner: failingRunner }]],
      ['Action error.', [{ context: {}, error }]],
    ]);
    expect(runningMock.mock.calls).toStrictEqual([[{ context: {}, runner: failingRunner }]]);
    expect(successMock.mock.calls).toStrictEqual([]);
    expect(errorMock.mock.calls).toStrictEqual([[{ context: {}, error }]]);
    expect(finallyMock.mock.calls).toStrictEqual([[{ context: {} }]]);

    loggerDebugMock.mockRestore();
  });

  it.concurrent('should dequeue enhancers sequentially', async () => {
    const defineValue = (value: number) => async (action: Action) => {
      action.use(context({ value }));
    };

    const ActionClass = makeActionClass();
    const action = new ActionClass();

    expect(await action.useContext()).toStrictEqual({});

    action.use(defineValue(1));

    expect(await action.useContext()).toStrictEqual({ value: 1 });

    action.use(defineValue(2));
    action.use(defineValue(3));

    expect(await action.useContext()).toStrictEqual({ value: 3 });
  });
});
