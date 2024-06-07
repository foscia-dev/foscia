/* eslint-disable max-classes-per-file */
import {
  attr,
  isInstanceUsing,
  isModelUsing,
  makeComposable,
  makeModel,
  onCreating, onDestroying, onUpdating,
} from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: composition', () => {
  it('should apply composables to models', () => {
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

    const boo = makeComposable({
      baz,
      boo: attr(() => 'boo'),
    });

    class Model extends makeModel('model', { baz }) {
    }

    const model = new Model();
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
    }).setup({ boot: () => undefined }) {
    }

    onCreating(FooModel, () => 'foo');

    const BarModel = FooModel.extend({
      bar: attr(() => 'bar'),
      get getSomething() {
        return this.bar;
      },
    }).setup({ boot: () => undefined });

    onUpdating(BarModel, () => undefined);

    class BazModel extends BarModel.extend({
      baz: attr(() => 'baz'),
      get getSomething() {
        return this.baz;
      },
    }).setup({ boot: () => undefined }) {
    }

    onDestroying(BazModel, () => undefined);

    expect(Object.values(FooModel.$hooks!).length).toStrictEqual(1);
    expect(FooModel.$hooks!.creating!.length).toStrictEqual(1);
    expect(Object.values(BarModel.$hooks!).length).toStrictEqual(1);
    expect(BarModel.$hooks!.updating!.length).toStrictEqual(1);
    expect(Object.values(BazModel.$hooks!).length).toStrictEqual(1);
    expect(BazModel.$hooks!.destroying!.length).toStrictEqual(1);
    expect(FooModel.$setup.boot.length).toStrictEqual(1);
    expect(BarModel.$setup.boot.length).toStrictEqual(2);
    expect(BazModel.$setup.boot.length).toStrictEqual(3);

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
});
