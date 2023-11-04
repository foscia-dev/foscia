import { context, when } from '@foscia/core';
import { describe, expect, it } from 'vitest';
import evaluateContext from '../../utils/evaluateContext';

describe.concurrent('unit: when', () => {
  it('should use truthy callback', async () => {
    expect(
      await evaluateContext(when(true, context({ foo: 'true' }), context({ bar: 'false' }))),
    ).toStrictEqual({ foo: 'true' });
    expect(
      await evaluateContext(when(() => 'foo', (a, v) => a.use(context({ foo: v })), context({ bar: 'false' }))),
    ).toStrictEqual({ foo: 'foo' });
  });

  it('should use falsy callback', async () => {
    expect(
      await evaluateContext(when(false, context({ foo: 'true' }), context({ bar: 'false' }))),
    ).toStrictEqual({ bar: 'false' });
    expect(
      await evaluateContext(when(() => 0, context({ foo: 'true' }), (a, v) => a.use(context({ bar: v })))),
    ).toStrictEqual({ bar: 0 });
  });

  it('should use no callback', async () => {
    expect(
      await evaluateContext(when(false, context({ foo: 'true' }))),
    ).toStrictEqual({});
  });
});
