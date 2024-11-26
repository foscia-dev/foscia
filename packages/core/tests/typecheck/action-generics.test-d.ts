import {
  Action,
  AdapterI,
  CacheI,
  ConsumeInstance,
  ConsumeModel,
  DeserializerI,
  include,
  makeActionFactory,
  Model,
  ModelIdType,
  ModelInstance,
  ModelRelationDotKey,
  oneOrFail,
  query,
  save,
  SerializerI,
} from '@foscia/core';
import { expectTypeOf, test } from 'vitest';
import PostMock from '../mocks/models/post.mock';

test('Actions generics are type safe', async () => {
  const action = makeActionFactory({
    adapter: null as unknown as AdapterI<Response>,
    cache: null as unknown as CacheI,
    deserializer: null as unknown as DeserializerI<any>,
    serializer: null as unknown as SerializerI<any, any, any>,
  });

  const normalFindModel = (
    model: Model,
    id: ModelIdType,
    relations: string[],
  ) => action().use(query(model, id), include(relations)).run(oneOrFail());
  const genericFindModel = <M extends Model>(
    model: M,
    id: ModelIdType,
    relations: ModelRelationDotKey<M>[],
  ) => action().use(query(model, id), include(relations)).run(oneOrFail());
  const genericCallbackFindModel = <M extends Model>(
    model: M,
    id: ModelIdType,
    tap: (action: Action<ConsumeModel<M>>) => void,
  ) => action().use(query(model, id)).use(tap).run(oneOrFail());

  expectTypeOf(await normalFindModel(PostMock, '1', ['comments'])).toEqualTypeOf<any>();
  expectTypeOf(await normalFindModel(PostMock, '1', ['postedBy'])).toEqualTypeOf<any>();
  expectTypeOf(await normalFindModel(PostMock, '1', ['foo'])).toEqualTypeOf<any>();
  expectTypeOf(await genericFindModel(PostMock, '1', ['comments'])).toEqualTypeOf<PostMock>();
  expectTypeOf(
    await genericCallbackFindModel(PostMock, '1', (a) => a.use(include('comments'))),
  ).toEqualTypeOf<PostMock>();

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
  const genericCallbackSaveInstance = <I extends ModelInstance>(
    instance: I,
    tap: (action: Action<ConsumeInstance<I>>) => void,
  ) => action().use(save(instance)).use(tap).run(oneOrFail());

  expectTypeOf(await normalSaveInstance(new PostMock(), ['comments'])).toEqualTypeOf<ModelInstance>();
  expectTypeOf(await normalSaveInstance(new PostMock(), ['postedBy'])).toEqualTypeOf<ModelInstance>();
  expectTypeOf(await normalSaveInstance(new PostMock(), ['foo'])).toEqualTypeOf<ModelInstance>();
  expectTypeOf(await genericSaveInstance(new PostMock(), ['comments'])).toEqualTypeOf<PostMock>();
  expectTypeOf(
    await genericCallbackSaveInstance(new PostMock(), (a) => a.use(include('comments'))),
  ).toEqualTypeOf<PostMock>();

  // @ts-expect-error foo is not a relation of PostMock
  await genericSaveInstance(new PostMock(), ['foo']);
  // @ts-expect-error postedBy is not a relation of PostMock
  await genericSaveInstance(new PostMock(), ['postedBy']);
});
