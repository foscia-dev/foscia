import { attr, makeComposable, makeModel } from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: composition', () => {
  it('should compose models', () => {
    const foo = makeComposable({
      foo: attr(() => 'foo'),
    });

    const bar = makeComposable({
      foo,
      bar: attr(() => 'bar'),
    });

    const baz = makeComposable({
      bar,
      baz: attr(() => 'baz'),
    });

    class Model extends makeModel('model', { baz }) {
    }

    const model = new Model();
    expect(model.foo).toStrictEqual('foo');
    expect(model.bar).toStrictEqual('bar');
    expect(model.baz).toStrictEqual('baz');
  });
});
