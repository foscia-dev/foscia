import { context, makeActionClass, AdapterI, raw } from '@foscia/core';
import { makeActionFactoryMockable, mockAction, unmockAction } from '@foscia/test';
import { describe, expect, it, vi } from 'vitest';

describe.concurrent('unit: mocking', () => {
  const makeAction = () => {
    const ActionClass = makeActionClass();

    const fetch = vi.fn();

    return {
      fetch,
      action: makeActionFactoryMockable((() => new ActionClass().use(context({
        adapter: {
          execute: async () => {
            const rawData = fetch();

            return { raw: rawData, read: () => rawData.json() };
          },
        } as AdapterI<any>,
      })))),
    };
  };

  it('should mock action indefinitely', async () => {
    const { action, fetch } = makeAction();

    const mock = mockAction(action);
    mock.mockResult('foo');

    expect(await action().run(raw())).toStrictEqual('foo');
    expect(await action().run(raw())).toStrictEqual('foo');

    expect(fetch).not.toHaveBeenCalled();
  });

  it('should mock action n times', async () => {
    const { action, fetch } = makeAction();

    const mock = mockAction(action);
    mock.mockResultOnce('foo');
    mock.mockResultTwice('bar');
    mock.mockResultTimes(1, 'baz');

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
    mock.mockResult('foo', ({ value }) => value === 'foo');
    mock.mockResult('bar', ({ value }) => value === 'bar');

    expect(await action().use(context({ value: 'foo' })).run(raw())).toStrictEqual('foo');
    expect(await action().use(context({ value: 'bar' })).run(raw())).toStrictEqual('bar');
    await expect(() => action().use(context({ value: 'baz' })).run(raw()))
      .rejects.toThrowError('Unexpected mocked action run');

    expect(fetch).not.toHaveBeenCalled();
  });

  it('should mock action and run expectations', async () => {
    const { action, fetch } = makeAction();

    const expectationFn = vi.fn();
    let expectContext: any;

    const mock = mockAction(action);
    mock.mockResult({
      result: 'foo',
      expectation: (c: any) => {
        expectationFn(c);
        expectContext = c;
      },
    });

    expect(await action().use(context({ value: 'foo' })).run(raw())).toStrictEqual('foo');

    expect(expectationFn).toHaveBeenCalledOnce();
    expect(expectationFn).toHaveBeenCalledWith(expectContext);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should support factory function for value', async () => {
    const { action, fetch } = makeAction();

    const mock = mockAction(action);
    mock.mockResult(() => 'foo');

    expect(await action().run(raw())).toStrictEqual('foo');

    expect(fetch).not.toHaveBeenCalled();
  });

  it('should support error bubbling', async () => {
    const { action, fetch } = makeAction();

    const mock = mockAction(action);
    mock.mockResult(() => {
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
    mock.mockResult('foo');

    expect(mock.history.length).toStrictEqual(0);

    await action().use(context({ foo: 'bar' })).run(raw());
    await action().use(context({ foo: 'baz' })).run(raw());

    expect(mock.history.length).toStrictEqual(2);
    expect(mock.history[0].context.foo).toStrictEqual('bar');
    expect(mock.history[1].context.foo).toStrictEqual('baz');

    mock.reset();

    expect(mock.history.length).toStrictEqual(0);
    await expect(() => action().run(raw()))
      .rejects.toThrowError('Unexpected mocked action run');

    unmockAction(action);

    const fetchValue = await action().run(raw());

    expect(fetchValue).toStrictEqual(responseMock);
    expect(fetch).toHaveBeenCalledOnce();
  });
});
