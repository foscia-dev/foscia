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
    expectTypeOf(instance.foo).toMatchTypeOf<string>();
    // @ts-expect-error property does not exist
    expectTypeOf(instance.bar).toMatchTypeOf<any>();
  });
  onPropertyWrite(foo, 'foo', ({ instance }) => {
    expectTypeOf(instance.foo).toMatchTypeOf<string>();
    // @ts-expect-error property does not exist
    expectTypeOf(instance.bar).toMatchTypeOf<any>();
  });
  // @ts-expect-error property does not exist
  onPropertyWrite(foo, 'bar', () => undefined);

  const Model = makeModel('model', { baz });

  onBoot(Model, () => undefined);
  onInit(Model, (instance) => {
    expectTypeOf(instance.foo).toMatchTypeOf<string>();
    expectTypeOf(instance.baz).toMatchTypeOf<boolean>();
    // @ts-expect-error property does not exist
    expectTypeOf(instance.unknown).toMatchTypeOf<any>();
  });
  onPropertyWrite(Model, 'foo', ({ instance }) => {
    expectTypeOf(instance.foo).toMatchTypeOf<string>();
    expectTypeOf(instance.baz).toMatchTypeOf<boolean>();
    // @ts-expect-error property does not exist
    expectTypeOf(instance.unknown).toMatchTypeOf<any>();
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
  expectTypeOf(model.foo).toMatchTypeOf<string>();
  expectTypeOf(model.bar).toMatchTypeOf<number>();
  expectTypeOf(model.baz).toMatchTypeOf<boolean>();
  // @ts-expect-error property cannot be null
  expectTypeOf(model.foo).toMatchTypeOf<null>();
  // @ts-expect-error property cannot be null
  expectTypeOf(model.bar).toMatchTypeOf<null>();
  // @ts-expect-error property cannot be null
  expectTypeOf(model.baz).toMatchTypeOf<null>();

  const ModelUsingType = null as unknown as ModelUsing<typeof baz>;
  const modelUsingType = new ModelUsingType();
  expectTypeOf(modelUsingType.foo).toMatchTypeOf<string>();
  expectTypeOf(modelUsingType.bar).toMatchTypeOf<number>();
  expectTypeOf(modelUsingType.baz).toMatchTypeOf<boolean>();
  // @ts-expect-error property cannot be null
  expectTypeOf(modelUsingType.foo).toMatchTypeOf<null>();
  // @ts-expect-error property cannot be null
  expectTypeOf(modelUsingType.bar).toMatchTypeOf<null>();
  // @ts-expect-error property cannot be null
  expectTypeOf(modelUsingType.baz).toMatchTypeOf<null>();

  const instanceUsingType = null as unknown as ModelInstanceUsing<typeof baz>;
  expectTypeOf(instanceUsingType.foo).toMatchTypeOf<string>();
  expectTypeOf(instanceUsingType.bar).toMatchTypeOf<number>();
  expectTypeOf(instanceUsingType.baz).toMatchTypeOf<boolean>();
  // @ts-expect-error property cannot be null
  expectTypeOf(instanceUsingType.foo).toMatchTypeOf<null>();
  // @ts-expect-error property cannot be null
  expectTypeOf(instanceUsingType.bar).toMatchTypeOf<null>();
  // @ts-expect-error property cannot be null
  expectTypeOf(instanceUsingType.baz).toMatchTypeOf<null>();

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
