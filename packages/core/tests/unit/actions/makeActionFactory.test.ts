import {
  Action,
  ActionCall,
  appendActionMiddlewares,
  cachedOr,
  context,
  isEnhancer,
  isRunner,
  isWhen,
  logger,
  makeActionFactory,
  makeCache,
  makeModel,
  onError,
  onFinally,
  onRunning,
  onSuccess,
  prependActionMiddlewares,
  query,
  SYMBOL_ACTION_ENHANCER,
  SYMBOL_ACTION_RUNNER,
  SYMBOL_ACTION_WHEN,
  when,
} from '@foscia/core';
import { describe, expect, it, vi } from 'vitest';

describe('unit: makeActionFactory', () => {
  it('should trigger hooks', async () => {
    const loggerDebugMock = vi.spyOn(logger, 'debug').mockImplementation(() => undefined);
    const runningMock = vi.fn();
    const successMock = vi.fn();
    const errorMock = vi.fn();
    const finallyMock = vi.fn();

    const runner = () => 'dummy';

    let action = makeActionFactory()();

    await expect(
      action
        .use(onRunning(runningMock))
        .use(onSuccess(successMock))
        .use(onError(errorMock))
        .use(onFinally(finallyMock))
        .run(runner),
    ).resolves.toStrictEqual('dummy');

    expect(loggerDebugMock.mock.calls).toStrictEqual([
      ['Action running.', { action, runner }],
      ['Action success.', { action, result: 'dummy' }],
    ]);
    expect(runningMock.mock.calls).toStrictEqual([[{ action, runner }]]);
    expect(successMock.mock.calls).toStrictEqual([[{ action, result: 'dummy' }]]);
    expect(errorMock.mock.calls).toStrictEqual([]);
    expect(finallyMock.mock.calls).toStrictEqual([[{ action }]]);

    loggerDebugMock.mockReset();
    runningMock.mockReset();
    successMock.mockReset();
    errorMock.mockReset();
    finallyMock.mockReset();

    const error = new Error('Dummy error');
    const failingRunner = () => {
      throw error;
    };

    action = makeActionFactory()();

    await expect(
      action
        .use(onRunning(runningMock))
        .use(onSuccess(successMock))
        .use(onError(errorMock))
        .use(onFinally(finallyMock))
        .run(failingRunner),
    ).rejects.toThrowError(error);

    expect(loggerDebugMock.mock.calls).toStrictEqual([
      ['Action running.', { action, runner: failingRunner }],
      ['Action error.', { action, error }],
    ]);
    expect(runningMock.mock.calls).toStrictEqual([[{ action, runner: failingRunner }]]);
    expect(successMock.mock.calls).toStrictEqual([]);
    expect(errorMock.mock.calls).toStrictEqual([[{ action, error }]]);
    expect(finallyMock.mock.calls).toStrictEqual([[{ action }]]);

    loggerDebugMock.mockRestore();
  });

  it('should trigger middlewares', async () => {
    const action = makeActionFactory()();
    const result = await action
      .use(context({ value: 'foo' }))
      .use(appendActionMiddlewares([
        async (a, next) => {
          a.use(context({ value: `${(await a.useContext()).value}1` }));

          const r = await next(a);

          return `${r}2`;
        },
        async (a, next) => {
          a.use(context({ value: `${(await a.useContext()).value}2` }));

          const r = await next(a);

          return `${r}1`;
        },
      ]))
      .use(prependActionMiddlewares(async (a, next) => `${await next(a)}3`))
      .run(() => 'bar');

    expect(result).toEqual('bar123');
    expect(await action.useContext()).toMatchObject({ value: 'foo12' });
  });

  it('should keep actionConnectionId', async () => {
    const action = makeActionFactory();

    expect(action.connectionId).toBeTypeOf('string');
    expect(await action().useContext()).toStrictEqual({ actionConnectionId: action.connectionId });
    expect(await action().useContext()).toStrictEqual({ actionConnectionId: action.connectionId });

    const otherAction = makeActionFactory();
    expect(action.connectionId).not.toStrictEqual(otherAction.connectionId);
  });

  it('should dequeue enhancers sequentially', async () => {
    const concatFoo = (value: string) => async (
      action: Action<{ foo: string; }>,
    ) => action.use(context({
      foo: `${(await action.useContext()).foo}${value}`,
    }));

    const action = makeActionFactory({ foo: 'foo' })();

    expect(await action.useContext()).toMatchObject({ foo: 'foo' });

    action.use(concatFoo('1'));

    expect(await action.useContext()).toMatchObject({ foo: 'foo1' });

    action.use(concatFoo('2'));
    action.use((a) => {
      a.use(concatFoo('3'));
    });
    action.use(concatFoo('4'));

    expect(await action.useContext()).toMatchObject({ foo: 'foo1234' });
  });

  it('should store calls correctly', async () => {
    const Post = makeModel('posts');

    const firstWhenPredicate = async () => true;
    const firstWhenEnhancer = context({ baz: 'baz' });
    const secondWhenPredicate = () => true;
    const secondWhenEnhancer = (a: any) => a.use(context({ boo: 'boo' }));
    const cachedOrRunner = () => null;

    const { cache } = makeCache();
    const action = makeActionFactory({ cache })();
    const result = await action
      .use(
        query(Post, 1),
        context({ foo: 'foo' }),
      )
      .use(when(firstWhenPredicate, firstWhenEnhancer))
      .use(context({ bar: 'bar' }))
      .run(
        when(secondWhenPredicate, secondWhenEnhancer),
        cachedOr(cachedOrRunner),
      );

    expect(result).toBeNull();
    expect(await action.useContext()).toMatchObject({
      cache,
      model: Post,
      id: 1,
      foo: 'foo',
      baz: 'baz',
      bar: 'bar',
      boo: 'boo',
    });

    const calls = action.calls();

    type FormattedCall = {
      type: symbol;
      name: string;
      args: unknown[];
      calls: FormattedCall[];
    } | {
      calls: FormattedCall[];
    };
    const formatCall = (call: ActionCall): FormattedCall => (
      isEnhancer(call.call) || isRunner(call.call) || isWhen(call.call) ? {
        type: call.call.$FOSCIA_TYPE,
        name: call.call.meta.name,
        args: call.call.meta.args,
        calls: call.calls.map(formatCall),
      } : { calls: call.calls.map(formatCall) }
    );

    expect(calls.map(formatCall)).toMatchObject([
      {
        type: SYMBOL_ACTION_ENHANCER,
        name: 'query',
        args: [Post, 1],
        calls: [
          {
            type: SYMBOL_ACTION_ENHANCER,
            name: 'context',
            args: [{ model: Post, id: 1 }],
            calls: [],
          },
        ],
      },
      {
        type: SYMBOL_ACTION_ENHANCER,
        name: 'context',
        args: [{ foo: 'foo' }],
        calls: [],
      },
      {
        type: SYMBOL_ACTION_WHEN,
        name: 'when',
        args: [firstWhenPredicate, firstWhenEnhancer],
        calls: [
          {
            type: SYMBOL_ACTION_ENHANCER,
            name: 'context',
            args: [{ baz: 'baz' }],
            calls: [],
          },
        ],
      },
      {
        type: SYMBOL_ACTION_ENHANCER,
        name: 'context',
        args: [{ bar: 'bar' }],
        calls: [],
      },
      {
        type: SYMBOL_ACTION_WHEN,
        name: 'when',
        args: [secondWhenPredicate, secondWhenEnhancer],
        calls: [
          {
            calls: [
              {
                type: SYMBOL_ACTION_ENHANCER,
                name: 'context',
                args: [{ boo: 'boo' }],
                calls: [],
              },
            ],
          },
        ],
      },
      {
        type: SYMBOL_ACTION_RUNNER,
        name: 'cachedOr',
        args: [cachedOrRunner],
        calls: [
          {
            calls: [],
          },
        ],
      },
    ]);
  });
});
