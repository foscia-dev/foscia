/* eslint-disable max-classes-per-file */
import { aliasPropKey, attr, hasOne, makeModel, ModelProp } from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe('unit: model keys aliases', () => {
  it('should normalize aliased key', () => {
    const model = makeModel('model', {
      foo: attr().alias('bar'),
    });

    expect(aliasPropKey(model.$schema.foo)).toStrictEqual('bar');
  });

  it('should not normalize when no normalizer', () => {
    const model = makeModel('model', {
      foo: attr(),
    });

    expect(aliasPropKey(model.$schema.foo)).toStrictEqual('foo');
  });

  it('should not normalize with normalizer', () => {
    const normalizer = (p: ModelProp) => `${p.key}foo`;

    const model = makeModel({
      type: 'model',
      guessAlias: normalizer,
    }, {
      foo: attr(),
      bar: hasOne('dummy'),
    });

    expect(aliasPropKey(model.$schema.foo)).toStrictEqual('foofoo');
    expect(aliasPropKey(model.$schema.bar)).toStrictEqual('barfoo');
  });
});
