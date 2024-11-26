import {
  attr,
  makeComposable,
  makeModel,
  ModelInstanceUsing,
  ModelUsing,
  onBoot,
  onInit,
  onPropertyWrite,
  onSaving,
  toDateTime,
} from '@foscia/core';
import { expectTypeOf, test } from 'vitest';

test('Models compositions are type safe', () => {
  const foo = makeComposable({
    foo: attr<string>(),
  });
  const bar = makeComposable({
    foo,
    bar: attr<number>(),
  });
  const baz = makeComposable({
    bar,
    baz: attr<boolean>(),
  });

  onBoot(foo, () => undefined);
  onInit(foo, (instance) => {
    expectTypeOf(instance.foo).toEqualTypeOf<string>();
    // @ts-expect-error property does not exist
    expectTypeOf(instance.bar).toEqualTypeOf<any>();
  });
  onPropertyWrite(foo, 'foo', ({ instance }) => {
    expectTypeOf(instance.foo).toEqualTypeOf<string>();
    // @ts-expect-error property does not exist
    expectTypeOf(instance.bar).toEqualTypeOf<any>();
  });
  // @ts-expect-error property does not exist
  onPropertyWrite(foo, 'bar', () => undefined);

  const Model = makeModel('model', { baz });

  onBoot(Model, () => undefined);
  onInit(Model, (instance) => {
    expectTypeOf(instance.foo).toEqualTypeOf<string>();
    expectTypeOf(instance.baz).toEqualTypeOf<boolean>();
    // @ts-expect-error property does not exist
    expectTypeOf(instance.unknown).toEqualTypeOf<any>();
  });
  onPropertyWrite(Model, 'foo', ({ instance }) => {
    expectTypeOf(instance.foo).toEqualTypeOf<string>();
    expectTypeOf(instance.baz).toEqualTypeOf<boolean>();
    // @ts-expect-error property does not exist
    expectTypeOf(instance.unknown).toEqualTypeOf<any>();
  });
  onPropertyWrite(Model, 'baz', () => undefined);
  // @ts-expect-error property does not exist
  onPropertyWrite(Model, 'unknown', () => undefined);

  expectTypeOf(Model).toMatchTypeOf<ModelUsing<typeof foo>>();
  expectTypeOf(Model).toMatchTypeOf<ModelUsing<typeof bar>>();
  expectTypeOf(Model).toMatchTypeOf<ModelUsing<typeof baz>>();

  const model = new Model();

  expectTypeOf(model).toMatchTypeOf<ModelInstanceUsing<typeof foo>>();
  expectTypeOf(model).toMatchTypeOf<ModelInstanceUsing<typeof bar>>();
  expectTypeOf(model).toMatchTypeOf<ModelInstanceUsing<typeof baz>>();
  expectTypeOf(model.foo).toEqualTypeOf<string>();
  expectTypeOf(model.bar).toEqualTypeOf<number>();
  expectTypeOf(model.baz).toEqualTypeOf<boolean>();
  // @ts-expect-error property cannot be null
  expectTypeOf(model.foo).toEqualTypeOf<null>();
  // @ts-expect-error property cannot be null
  expectTypeOf(model.bar).toEqualTypeOf<null>();
  // @ts-expect-error property cannot be null
  expectTypeOf(model.baz).toEqualTypeOf<null>();

  const ModelUsingType = null as unknown as ModelUsing<typeof baz>;
  const modelUsingType = new ModelUsingType();
  expectTypeOf(modelUsingType.foo).toEqualTypeOf<string>();
  expectTypeOf(modelUsingType.bar).toEqualTypeOf<number>();
  expectTypeOf(modelUsingType.baz).toEqualTypeOf<boolean>();
  // @ts-expect-error property cannot be null
  expectTypeOf(modelUsingType.foo).toEqualTypeOf<null>();
  // @ts-expect-error property cannot be null
  expectTypeOf(modelUsingType.bar).toEqualTypeOf<null>();
  // @ts-expect-error property cannot be null
  expectTypeOf(modelUsingType.baz).toEqualTypeOf<null>();

  const instanceUsingType = null as unknown as ModelInstanceUsing<typeof baz>;
  expectTypeOf(instanceUsingType.foo).toEqualTypeOf<string>();
  expectTypeOf(instanceUsingType.bar).toEqualTypeOf<number>();
  expectTypeOf(instanceUsingType.baz).toEqualTypeOf<boolean>();
  // @ts-expect-error property cannot be null
  expectTypeOf(instanceUsingType.foo).toEqualTypeOf<null>();
  // @ts-expect-error property cannot be null
  expectTypeOf(instanceUsingType.bar).toEqualTypeOf<null>();
  // @ts-expect-error property cannot be null
  expectTypeOf(instanceUsingType.baz).toEqualTypeOf<null>();

  const timestamps = makeComposable({
    timestamps: true,
    createdAt: attr(toDateTime()),
    updatedAt: attr(toDateTime()),
  });

  onSaving(timestamps, (instance) => {
    if (instance.timestamps) {
      // eslint-disable-next-line no-param-reassign
      instance.updatedAt = new Date();
      if (!instance.$exists) {
        // eslint-disable-next-line no-param-reassign
        instance.createdAt = instance.updatedAt;
      }
    }
  });
});
