import { context, makeActionFactory } from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: context', () => {
  it('should use merged contexts', async () => {
    const action = makeActionFactory()();

    action.updateContext({ foo: 'foo', bar: 'bar' });
    action.use(context({ bar: 'foo', baz: 'baz' }));

    expect(await action.useContext()).toStrictEqual({ foo: 'foo', bar: 'foo', baz: 'baz' });
  });
});
