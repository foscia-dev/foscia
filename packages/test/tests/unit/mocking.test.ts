import { AdapterI, context, makeActionFactory, makeModel, query, raw, when } from '@foscia/core';
import { makeActionFactoryMockable, mockAction, unmockAction } from '@foscia/test';
import { describe, expect, it, vi } from 'vitest';

describe.concurrent('unit: mocking', () => {
  const makeAction = () => {
    const fetch = vi.fn();

    return {
      fetch,
      action: makeActionFactoryMockable(makeActionFactory({
        adapter: {
          execute: async () => {
            const rawData = fetch();

            return { raw: rawData, read: () => rawData.json() };
          },
        } as AdapterI<any>,
      })),
    };
  };

  it('should mock action indefinitely', async () => {
    const { action, fetch } = makeAction();

    const mock = mockAction(action);
    mock.mock('foo');

    expect(await action().run(raw())).toStrictEqual('foo');
    expect(await action().run(raw())).toStrictEqual('foo');

    expect(fetch).not.toHaveBeenCalled();
  });

  it('should mock action n times', async () => {
    const { action, fetch } = makeAction();

    const mock = mockAction(action);
    mock.mock('foo').once();
    mock.mock('bar').twice();
    mock.mock('baz').times(1);

    expect(await action().run(raw())).toStrictEqual('foo');
    expect(await action().run(raw())).toStrictEqual('bar');
    expect(await action().run(raw())).toStrictEqual('bar');
    expect(await action().run(raw())).toStrictEqual('baz');
    await expect(() => action().run(raw()))
      .rejects.toThrowError('Unexpected mocked action run');

    expect(fetch).not.toHaveBeenCalled();
  });

  it('should mock action conditionally', async () => {
    const { action, fetch } = makeAction();

    const mock = mockAction(action);
    mock.mock('foo').when((ctx) => ctx.context.value === 'foo');
    mock.mock('bar').when((ctx) => ctx.context.value === 'bar');

    expect(await action().use(context({ value: 'foo' })).run(raw())).toStrictEqual('foo');
    expect(await action().use(context({ value: 'bar' })).run(raw())).toStrictEqual('bar');
    await expect(() => action().use(context({ value: 'baz' })).run(raw()))
      .rejects.toThrowError('Unexpected mocked action run');

    expect(fetch).not.toHaveBeenCalled();
  });

  it('should mock action conditionally with variadic', async () => {
    const { action, fetch } = makeAction();

    const mock = mockAction(action);
    mock.mock('foo').when((ctx) => ctx.context.value === 'foo');
    mock.mock('bar').when((ctx) => ctx.context.value === 'bar');

    expect(await action().run(context({ value: 'foo' }), raw())).toStrictEqual('foo');
    expect(await action().run(context({ value: 'bar' }), raw())).toStrictEqual('bar');
    await expect(() => action().run(context({ value: 'baz' }), raw()))
      .rejects.toThrowError('Unexpected mocked action run');

    expect(fetch).not.toHaveBeenCalled();
  });

  it('should mock action and run expectations', async () => {
    const { action, fetch } = makeAction();

    const expectationFn = vi.fn();
    let expectContext: any;

    const mock = mockAction(action);
    mock.mock('foo').expect((ctx) => {
      expectationFn(ctx.context);
      expectContext = ctx.context;
    });

    expect(await action().use(context({ value: 'foo' })).run(raw())).toStrictEqual('foo');

    expect(expectationFn).toHaveBeenCalledOnce();
    expect(expectationFn).toHaveBeenCalledWith(expectContext);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should support factory function for value', async () => {
    const { action, fetch } = makeAction();

    const mock = mockAction(action);
    mock.mock(() => 'foo');

    expect(await action().run(raw())).toStrictEqual('foo');

    expect(fetch).not.toHaveBeenCalled();
  });

  it('should support error bubbling', async () => {
    const { action, fetch } = makeAction();

    const mock = mockAction(action);
    mock.mock(() => {
      throw new Error('dummy error');
    });

    await expect(() => action().run(raw()))
      .rejects.toThrowError('dummy error');

    expect(fetch).not.toHaveBeenCalled();
  });

  it('should support history, reset and stop', async () => {
    const { action, fetch } = makeAction();
    const responseMock = { status: 204 };
    fetch.mockImplementation(() => responseMock);

    const mock = mockAction(action);
    mock.mock('foo');

    expect(mock.history.length).toStrictEqual(0);

    await action().use(context({ foo: 'bar' })).run(raw());
    await action().use(context({ foo: 'baz' })).run(raw());

    expect(mock.history.length).toStrictEqual(2);
    expect(mock.history[0].context.context.foo).toStrictEqual('bar');
    expect(mock.history[1].context.context.foo).toStrictEqual('baz');

    mock.reset();

    expect(mock.history.length).toStrictEqual(0);
    await expect(() => action().run(raw()))
      .rejects.toThrowError('Unexpected mocked action run');

    unmockAction(action);

    const fetchValue = await action().run(raw());

    expect(fetchValue).toStrictEqual(responseMock);
    expect(fetch).toHaveBeenCalledOnce();
  });

  it('should support enhancers and runners inspection', async () => {
    const Post = makeModel('posts');
    let expectContext: any;

    const { action, fetch } = makeAction();

    const mock = mockAction(action);
    mock.mock(() => 'foo').expect((ctx) => {
      expect(ctx.calls.size()).toStrictEqual(4);

      expect(ctx.calls.has('create')).toStrictEqual(false);
      expect(ctx.calls.find('create')).toStrictEqual(null);
      expect(ctx.calls.args('create')).toStrictEqual([]);

      expect(ctx.calls.has('query')).toStrictEqual(true);
      expect(ctx.calls.find('query')!.depth).toStrictEqual(0);
      expect(ctx.calls.find('query')!.args).toStrictEqual([Post, 1]);
      expect(ctx.calls.find((c) => c.name === 'query'))
        .toStrictEqual(ctx.calls.find('query'));

      expect(ctx.calls.has('context')).toStrictEqual(true);
      expect(ctx.calls.findAll('context').length).toStrictEqual(1);
      expect(ctx.calls.find('context')!.depth).toStrictEqual(3);
      expect(ctx.calls.args('context')).toStrictEqual([{ bar: 'bar' }]);

      expect(ctx.calls.findAll('when').length).toStrictEqual(5);
      expect(ctx.calls.findAll('when')[0].depth).toStrictEqual(0);
      expect(ctx.calls.findAll('when')[1].depth).toStrictEqual(0);
      expect(ctx.calls.findAll('when')[2].depth).toStrictEqual(1);
      expect(ctx.calls.findAll('when')[3].depth).toStrictEqual(0);
      expect(ctx.calls.findAll('when')[4].depth).toStrictEqual(1);

      expect(ctx.calls.find('raw')!.args).toStrictEqual([]);
      expect(ctx.calls.find('raw')!.depth).toStrictEqual(2);

      expect(ctx.calls.tree().length).toStrictEqual(4);
      expect(ctx.calls.all().length).toStrictEqual(9);
      expect(ctx.calls.originals().length).toStrictEqual(4);

      expectContext = ctx.context;
    });

    expect(
      await action().run(
        query(Post, 1),
        when(async () => false, context({ foo: 'foo' })),
        when(true, when(() => true, (a) => a.use(context({ bar: 'bar' })))),
        when(async () => false, () => null, when(() => true, raw())),
      ),
    ).toStrictEqual('foo');

    expect(fetch).not.toHaveBeenCalled();
    expect(expectContext).toStrictEqual({
      adapter: expectContext.adapter,
      bar: 'bar',
      model: Post,
      id: 1,
    });
  });
});
