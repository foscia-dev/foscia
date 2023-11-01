import { context } from '@foscia/core';
import { describe, expect, it } from 'vitest';
import makeFakeAction from '../../../../mocks/makeFakeAction.mock';

describe.concurrent('unit: context', () => {
  it('should use merged contexts', async () => {
    const action = makeFakeAction();

    action.updateContext({ foo: 'foo', bar: 'bar' });
    action.use(context({ bar: 'foo', baz: 'baz' }));

    expect(await action.useContext()).toStrictEqual({ foo: 'foo', bar: 'foo', baz: 'baz' });
  });
});
