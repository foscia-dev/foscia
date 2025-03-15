/* eslint-disable max-classes-per-file */

import {
  applyDefinition,
  attr,
  hasOne,
  id,
  makeComposable,
  makeComposableFactory,
  makeDefinition,
  makeModel,
  ModelAttribute,
  ModelAttributeFactory,
  ModelComposable,
  ModelHasOneFactory,
  ModelIdFactory,
  ModelIdType,
  ModelInstance,
  ModelInstanceUsing,
  ModelUsing,
  onBoot,
  onCreated,
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
  onBoot(foo, () => true);
  onCreated(foo, () => true);
  onCreated(foo, async () => true);
  onInit(foo, (instance) => {
    expectTypeOf(instance.foo).toEqualTypeOf<string>();
    // @ts-expect-error property does not exist
    expectTypeOf(instance.bar).toEqualTypeOf<any>();
  });
  onPropertyWrite(foo, 'foo', ({ instance, prop }) => {
    expectTypeOf(prop).toEqualTypeOf<ModelAttribute<string, false>>();
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
  onPropertyWrite(Model, 'foo', ({ instance, prop }) => {
    expectTypeOf(prop).toEqualTypeOf<ModelAttribute<string, false>>();
    expectTypeOf(instance.foo).toEqualTypeOf<string>();
    expectTypeOf(instance.baz).toEqualTypeOf<boolean>();
    // @ts-expect-error property does not exist
    expectTypeOf(instance.unknown).toEqualTypeOf<any>();
  });
  onPropertyWrite(Model, 'baz', () => undefined);
  // @ts-expect-error property does not exist
  onPropertyWrite(Model, 'unknown', () => undefined);

  expectTypeOf(Model).toExtend<ModelUsing<typeof foo>>();
  expectTypeOf(Model).toExtend<ModelUsing<typeof bar>>();
  expectTypeOf(Model).toExtend<ModelUsing<typeof baz>>();

  const model = new Model();

  expectTypeOf(model).toExtend<ModelInstanceUsing<typeof foo>>();
  expectTypeOf(model).toExtend<ModelInstanceUsing<typeof bar>>();
  expectTypeOf(model).toExtend<ModelInstanceUsing<typeof baz>>();
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

  class User extends makeModel('users', {
    id: id<string>(),
  }) {
  }

  class Image extends makeModel('images', {}) {
  }

  type ImageableDefinition<K extends string> =
    & Record<K, ModelHasOneFactory<Image, false>>
    & Record<`${K}URL`, ModelAttributeFactory<string, true>>;

  interface Imageable extends ModelComposable {
    readonly _type: ImageableDefinition<this['key']>;
  }

  const imageable = makeComposable<Imageable>(({ key }) => ({
    [key]: hasOne(() => Image),
    [`${key}URL`]: attr(() => '', { readOnly: true }),
  }));

  type IdOf<T, D = ModelIdType | null> = 'id' extends keyof T
    ? T['id'] extends ModelIdType | null ? T['id']
      : D : D;

  type BelongsTo<K extends string, T extends ModelInstance | null> =
    & Record<K, ModelHasOneFactory<T, false>>
    & Record<`${K}Id`, ModelIdFactory<IdOf<T>, false>>;

  interface BelongsToComposable<T extends ModelInstance | null>
    extends ModelComposable {
    readonly _type: BelongsTo<this['key'], T>;
  }

  const belongsTo = <
    T extends ModelInstance | null,
  >() => makeComposableFactory<BelongsToComposable<T>>({
    bind: (composable) => {
      applyDefinition(composable.parent, makeDefinition({
        [composable.key]: hasOne('dummy'),
        [`${composable.key}Id`]: attr(),
      }));
    },
  });

  class Post extends makeModel('posts', {
    mainImage: belongsTo<Image>(),
    user: belongsTo<User>(),
    userImage: imageable,
  }) {
  }

  const post = new Post();

  expectTypeOf(post.user).toEqualTypeOf<User>();
  expectTypeOf(post.userId).toEqualTypeOf<string>();
  expectTypeOf(post.mainImage).toEqualTypeOf<Image>();
  expectTypeOf(post.mainImageId).toEqualTypeOf<string | number | null>();
  expectTypeOf(post.userImage).toEqualTypeOf<Image>();
  expectTypeOf(post.userImageURL).toEqualTypeOf<string>();
});
