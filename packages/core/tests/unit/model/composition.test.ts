/* eslint-disable max-classes-per-file */
import {
  attr,
  isInstanceUsing,
  isModelUsing,
  makeComposable,
  makeModel,
  onCreating,
  runHooks,
  toDate,
} from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: composition', () => {
  it('should apply composables to models', () => {
    const ModelWithConnectionDefault = makeModel('posts');
    const ModelWithConnectionV1 = makeModel('apiV1:posts');
    const ModelWithConnectionV2 = makeModel({
      connection: 'apiV2',
      type: 'posts',
    });

    expect(ModelWithConnectionDefault.$connection).toStrictEqual('default');
    expect(ModelWithConnectionDefault.$type).toStrictEqual('posts');
    expect(ModelWithConnectionV1.$connection).toStrictEqual('apiV1');
    expect(ModelWithConnectionV1.$type).toStrictEqual('posts');
    expect(ModelWithConnectionV2.$connection).toStrictEqual('apiV2');
    expect(ModelWithConnectionV2.$type).toStrictEqual('posts');
  });

  it('should apply composables to models', () => {
    const foo = makeComposable({
      foob: false,
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

    const boo = makeComposable({
      baz,
      boo: attr(() => 'boo'),
    });

    class Model extends makeModel('model', { baz }) {
    }

    const model = new Model();
    expect(model).toBeInstanceOf(Model);
    expect(model.$model).toStrictEqual(Model);
    expect(model.foob).toStrictEqual(false);
    expect(model.foo).toStrictEqual('foo');
    expect(model.bar).toStrictEqual('bar');
    expect(model.baz).toStrictEqual('baz');

    expect(isModelUsing(Model, foo)).toBeTruthy();
    expect(isModelUsing(Model, bar)).toBeTruthy();
    expect(isModelUsing(Model, baz)).toBeTruthy();
    expect(isModelUsing(Model, boo)).toBeFalsy();

    expect(isInstanceUsing(model, foo)).toBeTruthy();
    expect(isInstanceUsing(model, bar)).toBeTruthy();
    expect(isInstanceUsing(model, baz)).toBeTruthy();
    expect(isInstanceUsing(model, boo)).toBeFalsy();
  });

  it('should have common hooks', async () => {
    const timestampable = makeComposable({
      timestamps: true,
      createdAt: attr(toDate()),
    });

    onCreating(timestampable, (instance) => {
      if (instance.timestamps) {
        // eslint-disable-next-line no-param-reassign
        instance.createdAt = new Date();
      }
    });

    class Post extends makeModel('posts', { timestampable }) {
    }

    const post1 = new Post();
    await runHooks(post1.$model, ['creating'], post1);
    expect(post1.createdAt).toBeInstanceOf(Date);

    const post2 = new Post();
    post2.timestamps = false;
    await runHooks(post2.$model, ['creating'], post2);
    expect(post2.createdAt).toBeUndefined();
  });
});
