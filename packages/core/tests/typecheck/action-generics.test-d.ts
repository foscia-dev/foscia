import {
  Action,
  AdapterI,
  all,
  cachedOr,
  CacheI,
  ConsumeModel,
  context,
  DeserializerI,
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
  oneOrFail,
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
    // @ts-expect-error FIXME Known limitation of instance type inference.
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
});
