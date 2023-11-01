import { attr, hasOne, makeModel, normalizeKey } from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: normalizeKey', () => {
  it('should normalize aliased key', () => {
    const model = makeModel('model', {
      foo: attr().alias('bar'),
    });

    expect(normalizeKey(model, 'foo')).toStrictEqual('bar');
  });

  it('should not normalize when no normalizer', () => {
    const model = makeModel('model', {
      foo: attr(),
    });

    expect(normalizeKey(model, 'foo')).toStrictEqual('foo');
  });

  it('should not normalize with normalizer', () => {
    const normalizer = (v: string) => `${v}foo`;

    const model = makeModel({
      type: 'model',
      guessAlias: normalizer,
    }, {
      foo: attr(),
      bar: hasOne(),
    });

    expect(normalizeKey(model, 'foo')).toStrictEqual('foofoo');
    expect(normalizeKey(model, 'bar')).toStrictEqual('barfoo');
  });
});
