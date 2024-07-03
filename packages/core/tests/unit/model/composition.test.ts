/* eslint-disable max-classes-per-file */
import {
  attr,
  isInstanceUsing,
  isModelUsing,
  makeComposable,
  makeModel,
  onBoot,
  onCreating,
  onDestroying,
  onUpdating,
  runHooks,
  toDate,
} from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: composition', () => {
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

  it('should extend models', () => {
    const BaseModel = makeModel('base');

    class FooModel extends BaseModel.extend({
      foo: attr(() => 'foo'),
      get getSomething() {
        return this.foo;
      },
    }) {
    }

    onBoot(FooModel, () => undefined);
    onCreating(FooModel, () => 'foo');

    const BarModel = FooModel.extend({
      bar: attr(() => 'bar'),
      get getSomething() {
        return this.bar;
      },
    });

    onBoot(BarModel, () => undefined);
    onUpdating(BarModel, () => undefined);

    class BazModel extends BarModel.extend({
      baz: attr(() => 'baz'),
      get getSomething() {
        return this.baz;
      },
    }) {
    }

    onBoot(BazModel, () => undefined);
    onDestroying(BazModel, () => undefined);

    expect(Object.values(FooModel.$hooks!).length).toStrictEqual(2);
    expect(FooModel.$hooks!.boot!.length).toStrictEqual(1);
    expect(FooModel.$hooks!.creating!.length).toStrictEqual(1);
    expect(Object.values(BarModel.$hooks!).length).toStrictEqual(3);
    expect(BarModel.$hooks!.boot!.length).toStrictEqual(2);
    expect(BarModel.$hooks!.updating!.length).toStrictEqual(1);
    expect(Object.values(BazModel.$hooks!).length).toStrictEqual(4);
    expect(BazModel.$hooks!.boot!.length).toStrictEqual(3);
    expect(FooModel.$hooks!.creating!.length).toStrictEqual(1);
    expect(BarModel.$hooks!.updating!.length).toStrictEqual(1);
    expect(BazModel.$hooks!.destroying!.length).toStrictEqual(1);

    const base = new BaseModel();
    // @ts-expect-error property does not exist
    expect(base.foo).toBeUndefined();
    // @ts-expect-error property does not exist
    expect(base.bar).toBeUndefined();
    // @ts-expect-error property does not exist
    expect(base.baz).toBeUndefined();
    // @ts-expect-error property does not exist
    expect(base.getSomething).toBeUndefined();
    expect(base).toBeInstanceOf(BaseModel);

    const foo = new FooModel();
    expect(foo.foo).toStrictEqual('foo');
    // @ts-expect-error property does not exist
    expect(foo.bar).toBeUndefined();
    // @ts-expect-error property does not exist
    expect(foo.baz).toBeUndefined();
    expect(foo.getSomething).toStrictEqual('foo');
    expect(foo).toBeInstanceOf(BaseModel);
    expect(foo).toBeInstanceOf(FooModel);

    const bar = new BarModel();
    expect(bar.foo).toStrictEqual('foo');
    expect(bar.bar).toStrictEqual('bar');
    // @ts-expect-error property does not exist
    expect(bar.baz).toBeUndefined();
    expect(bar.getSomething).toStrictEqual('bar');
    expect(bar).toBeInstanceOf(BaseModel);
    expect(bar).toBeInstanceOf(FooModel);
    expect(bar).toBeInstanceOf(BarModel);

    const baz = new BazModel();
    expect(baz.foo).toStrictEqual('foo');
    expect(baz.bar).toStrictEqual('bar');
    expect(baz.baz).toStrictEqual('baz');
    expect(baz.getSomething).toStrictEqual('baz');
    expect(baz).toBeInstanceOf(BaseModel);
    expect(baz).toBeInstanceOf(FooModel);
    expect(baz).toBeInstanceOf(BarModel);
    expect(baz).toBeInstanceOf(BazModel);
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
