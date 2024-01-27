import {
  AdapterI,
  all,
  cachedOr,
  CacheI,
  context,
  forInstance,
  forModel,
  forRelation,
  include,
  makeActionClass,
  DeserializerI,
  one,
  oneOrCurrent,
  oneOrFail,
  raw,
  when,
} from '@foscia/core';
import { expectTypeOf, test } from 'vitest';
import CommentMock from '../mocks/models/comment.mock';
import PostMock from '../mocks/models/post.mock';

test('Actions are type safe', async () => {
  const action = () => {
    const ActionClass = makeActionClass().extend({
      ...forModel.extension,
      ...forInstance.extension,
      ...forRelation.extension,
      ...include.extension,
      ...all.extension,
      ...oneOrFail.extension,
      ...cachedOr.extension,
      ...when.extension,
    });

    return new ActionClass().use(context({
      adapter: null as unknown as AdapterI<Response>,
      cache: null as unknown as CacheI,
      deserializer: null as unknown as DeserializerI<any>,
    }));
  };

  const postsUsingFunc = await action()
    .use(forModel(PostMock))
    .use(include('comments.postedBy'))
    .run(all());
  const postsUsingBuild = await action()
    .forModel(PostMock)
    .include('comments.postedBy')
    .all();
  const postsUsingVariadic = await action()
    .use(forModel(PostMock), include('comments.postedBy'))
    .run(all());

  expectTypeOf(postsUsingFunc).toMatchTypeOf<PostMock[]>();
  expectTypeOf(postsUsingBuild).toMatchTypeOf<PostMock[]>();
  expectTypeOf(postsUsingVariadic).toMatchTypeOf<PostMock[]>();

  const postUsingFunc = await action()
    .use(forInstance(new PostMock()))
    .run(cachedOr(oneOrCurrent()));
  const postUsingBuild = await action()
    .forInstance(new PostMock())
    .cachedOr(oneOrCurrent());

  expectTypeOf(postUsingFunc).toMatchTypeOf<PostMock>();
  expectTypeOf(postUsingBuild).toMatchTypeOf<PostMock>();

  const createdPostUsingFunc = await action()
    .use(forInstance(new PostMock()))
    .use(include('comments.postedBy'))
    .run(when(new PostMock().$exists, one()));
  const createdPostUsingBuild = await action()
    .forInstance(new PostMock())
    .include('comments.postedBy')
    .when(new PostMock().$exists, one());
  const createdPostUsingFuncOrCurrent = await action()
    .use(forInstance(new PostMock()))
    .run(oneOrFail());
  const createdPostUsingBuildOrCurrent = await action()
    .forInstance(new PostMock())
    .oneOrFail();

  expectTypeOf(createdPostUsingFunc).toMatchTypeOf<PostMock | null | void>();
  expectTypeOf(createdPostUsingBuild).toMatchTypeOf<PostMock | null | void>();
  expectTypeOf(createdPostUsingFuncOrCurrent).toMatchTypeOf<PostMock>();
  expectTypeOf(createdPostUsingBuildOrCurrent).toMatchTypeOf<PostMock>();

  // @ts-expect-error title is not a post relation
  await action().use(forModel(PostMock), include('title'));
  // @ts-expect-error unknown is not a post relation
  await action().use(forModel(PostMock), include('unknown'));
  // @ts-expect-error postedBy is not a post relation
  await action().use(forModel(PostMock), include('postedBy'));
  // @ts-expect-error unknown is not a comment relation
  await action().use(forModel(PostMock), include('comments.unknown'));
  // @ts-expect-error title is not a post relation
  await action().use(forInstance(new PostMock()), include('title'));
  // @ts-expect-error unknown is not a post relation
  await action().use(forInstance(new PostMock()), include('unknown'));
  // @ts-expect-error postedBy is not a post relation
  await action().use(forInstance(new PostMock()), include('postedBy'));
  // @ts-expect-error unknown is not a comment relation
  await action().use(forInstance(new PostMock()), include('comments.unknown'));
  // @ts-expect-error body is not a comment relation
  await action().use(forRelation(new PostMock(), 'comments'), include('body'));
  // @ts-expect-error unknown is not a comment relation
  await action().use(forRelation(new PostMock(), 'comments'), include('unknown'));
  // @ts-expect-error comments is not a comment relation
  await action().use(forRelation(new PostMock(), 'comments'), include('comments'));
  // @ts-expect-error postedBy.unknown is not a comment relation
  await action().use(forRelation(new PostMock(), 'comments'), include('postedBy.unknown'));

  // @ts-expect-error title is not a post relation
  await action().forModel(PostMock).include('title');
  // @ts-expect-error unknown is not a post relation
  await action().forModel(PostMock).include('unknown');
  // @ts-expect-error postedBy is not a post relation
  await action().forModel(PostMock).include('postedBy');
  // @ts-expect-error unknown is not a comment relation
  await action().forModel(PostMock).include('comments.unknown');
  // @ts-expect-error title is not a post relation
  await action().forInstance(new PostMock()).include('title');
  // @ts-expect-error unknown is not a post relation
  await action().forInstance(new PostMock()).include('unknown');
  // @ts-expect-error postedBy is not a post relation
  await action().forInstance(new PostMock()).include('postedBy');
  // @ts-expect-error unknown is not a comment relation
  await action().forInstance(new PostMock()).include('comments.unknown');
  // @ts-expect-error body is not a comment relation
  await action().forRelation(new PostMock(), 'comments').include('body');
  // @ts-expect-error unknown is not a comment relation
  await action().forRelation(new PostMock(), 'comments').include('unknown');
  // @ts-expect-error comments is not a comment relation
  await action().forRelation(new PostMock(), 'comments').include('comments');
  // @ts-expect-error postedBy.unknown is not a comment relation
  await action().forRelation(new PostMock(), 'comments').include('postedBy.unknown');

  const commentsUsingFunc = await action()
    .use(forRelation(new PostMock(), 'comments'))
    .run(all());
  const commentsUsingBuild = await action()
    .forRelation(new PostMock(), 'comments')
    .all();

  expectTypeOf(commentsUsingFunc).toMatchTypeOf<CommentMock[]>();
  expectTypeOf(commentsUsingBuild).toMatchTypeOf<CommentMock[]>();

  const response = await action().run(raw());

  expectTypeOf(response).toMatchTypeOf<Response>();
  // This will ensure `response` is not `any`.
  expectTypeOf(response).not.toMatchTypeOf<number>();
});
