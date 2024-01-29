import { Hookable, registerHook, runHooks, unregisterHook, withoutHooks } from '@foscia/core';
import { Awaitable } from '@foscia/shared';
import { describe, expect, it, vi } from 'vitest';

describe.concurrent('unit: hooks', () => {
  const dummyHookable = {
    $hooks: {},
  } as Hookable<{ dummy: (value: string) => Awaitable<void> }>;

  it('should run hooks sequentially when registered', async () => {
    let dummyValue = '';
    const firstHookMock = vi.fn(async (value: string) => {
      dummyValue = `${dummyValue}>${value}1`;
    });
    const secondHookMock = vi.fn(async (value: string) => {
      dummyValue = `${dummyValue}>${value}2`;
    });

    await runHooks(dummyHookable, 'dummy', 'foo');

    expect(dummyValue).toStrictEqual('');
    expect(firstHookMock).not.toHaveBeenCalled();
    expect(secondHookMock).not.toHaveBeenCalled();

    const unregisterFirst = registerHook(dummyHookable, 'dummy', firstHookMock);
    registerHook(dummyHookable, 'dummy', secondHookMock);

    await runHooks(dummyHookable, 'dummy', 'foo');

    expect(dummyValue).toStrictEqual('>foo1>foo2');
    expect(firstHookMock).toHaveBeenCalledOnce();
    expect(secondHookMock).toHaveBeenCalledOnce();

    unregisterFirst();
    unregisterHook(dummyHookable, 'dummy', () => {
      // Non-existing callback.
    });

    withoutHooks(dummyHookable, () => {
      registerHook(dummyHookable, 'dummy', firstHookMock);
      unregisterHook(dummyHookable, 'dummy', secondHookMock);
    });

    await runHooks(dummyHookable, 'dummy', 'foo');

    expect(dummyValue).toStrictEqual('>foo1>foo2>foo2');
    expect(firstHookMock).toHaveBeenCalledOnce();
    expect(secondHookMock).toHaveBeenCalledTimes(2);

    await withoutHooks(dummyHookable, async () => {
      await runHooks(dummyHookable, 'dummy', 'foo');
    });

    expect(dummyValue).toStrictEqual('>foo1>foo2>foo2');
    expect(firstHookMock).toHaveBeenCalledOnce();
    expect(secondHookMock).toHaveBeenCalledTimes(2);
  });
});
