import {
  Action,
  AdapterI,
  all,
  cachedOr,
  CacheI,
  ConsumeInstance,
  ConsumeModel,
  context,
  find,
  forInstance,
  forModel,
  forRelation,
  include,
  makeActionClass,
  Model,
  ModelIdType,
  ModelInstance,
  ModelRelationDotKey,
  DeserializerI,
  oneOrFail,
  save,
  SerializerI,
  when,
} from '@foscia/core';
import { expectTypeOf, test } from 'vitest';
import PostMock from '../mocks/models/post.mock';

test('Actions generics are type safe', async () => {
  const action = () => {
    const ActionClass = makeActionClass().extend({
      ...forModel.extension,
      ...forInstance.extension,
      ...forRelation.extension,
      ...include.extension,
      ...all.extension,
      ...cachedOr.extension,
      ...when.extension,
    });

    return new ActionClass().use(context({
      adapter: null as unknown as AdapterI<Response>,
      cache: null as unknown as CacheI,
      deserializer: null as unknown as DeserializerI<any>,
      serializer: null as unknown as SerializerI<any, any, any>,
    }));
  };

  const normalFindModel = (
    model: Model,
    id: ModelIdType,
    relations: string[],
  ) => action().use(find(model, id), include(relations)).run(oneOrFail());
  const genericFindModel = <M extends Model>(
    model: M,
    id: ModelIdType,
    relations: ModelRelationDotKey<M>[],
  ) => action().use(find(model, id), include(relations)).run(oneOrFail());
  const genericCallbackFindModel = <M extends Model>(
    model: M,
    id: ModelIdType,
    tap: (action: Action<ConsumeModel<M>>) => void,
  ) => action().use(find(model, id)).use(tap).run(oneOrFail());

  expectTypeOf(await normalFindModel(PostMock, '1', ['comments'])).toMatchTypeOf<ModelInstance>();
  expectTypeOf(await normalFindModel(PostMock, '1', ['postedBy'])).toMatchTypeOf<ModelInstance>();
  expectTypeOf(await normalFindModel(PostMock, '1', ['foo'])).toMatchTypeOf<ModelInstance>();
  expectTypeOf(await genericFindModel(PostMock, '1', ['comments'])).toMatchTypeOf<PostMock>();
  expectTypeOf(
    await genericCallbackFindModel(PostMock, '1', (a) => a.use(include('comments'))),
  ).toMatchTypeOf<PostMock>();

  // @ts-expect-error foo is not a relation of PostMock
  await genericFindModel(PostMock, '1', ['foo']);
  // @ts-expect-error postedBy is not a relation of PostMock
  await genericFindModel(PostMock, '1', ['postedBy']);

  const normalSaveInstance = (
    instance: ModelInstance,
    relations: string[],
  ) => action().use(save(instance), include(relations)).run(oneOrFail());
  const genericSaveInstance = <I extends ModelInstance>(
    instance: I,
    relations: ModelRelationDotKey<I>[],
  ) => action().use(save(instance), include(relations)).run(oneOrFail());
  const genericCallbackSaveInstance = <D extends {}, I extends ModelInstance<D>>(
    instance: I,
    tap: (action: Action<ConsumeInstance<I>>) => void,
  ) => action().use(save(instance)).use(tap).run(oneOrFail());

  expectTypeOf(await normalSaveInstance(new PostMock(), ['comments'])).toMatchTypeOf<ModelInstance>();
  expectTypeOf(await normalSaveInstance(new PostMock(), ['postedBy'])).toMatchTypeOf<ModelInstance>();
  expectTypeOf(await normalSaveInstance(new PostMock(), ['foo'])).toMatchTypeOf<ModelInstance>();
  expectTypeOf(await genericSaveInstance(new PostMock(), ['comments'])).toMatchTypeOf<PostMock>();
  expectTypeOf(
    await genericCallbackSaveInstance(new PostMock(), (a) => a.use(include('comments'))),
  ).toMatchTypeOf<PostMock>();

  // @ts-expect-error foo is not a relation of PostMock
  await genericSaveInstance(new PostMock(), ['foo']);
  // @ts-expect-error postedBy is not a relation of PostMock
  await genericSaveInstance(new PostMock(), ['postedBy']);
});
