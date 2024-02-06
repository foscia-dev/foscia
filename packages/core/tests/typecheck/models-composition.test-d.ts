import { attr, makeComposable, makeModel, ModelInstanceUsing, ModelUsing } from '@foscia/core';
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

  const Model = makeModel('model', { baz });

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
});
