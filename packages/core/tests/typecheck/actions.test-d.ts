import {
  AdapterI,
  all,
  associate,
  cachedOr,
  CacheI,
  context,
  create,
  DeserializerI,
  destroy,
  dissociate,
  include,
  makeActionClass,
  one,
  oneOrCurrent,
  oneOrFail,
  query, queryAs,
  raw,
  SerializerI,
  update,
  when,
} from '@foscia/core';
import { expectTypeOf, test } from 'vitest';
import CommentMock from '../mocks/models/comment.mock';
import PostMock from '../mocks/models/post.mock';
import UserMock from '../mocks/models/user.mock';

test('Actions are type safe', async () => {
  const action = () => {
    const ActionClass = makeActionClass().extend({
      ...query.extension(),
      ...queryAs.extension(),
      ...include.extension(),
      ...all.extension(),
      ...oneOrFail.extension(),
      ...cachedOr.extension(),
      ...when.extension(),
      ...create.extension(),
      ...update.extension(),
      ...destroy.extension(),
      ...associate.extension(),
      ...dissociate.extension(),
    });

    return new ActionClass().use(context({
      adapter: null as unknown as AdapterI<Response>,
      cache: null as unknown as CacheI,
      serializer: null as unknown as SerializerI<any, any, any>,
      deserializer: null as unknown as DeserializerI<any>,
    }));
  };

  const postsUsingFunc = await action()
    .use(query(PostMock))
    .use(include('comments.postedBy'))
    .run(all());
  const postsUsingBuild = await action()
    .query(PostMock)
    .include('comments.postedBy')
    .all();
  const postsUsingVariadic = await action()
    .use(query(PostMock), include('comments.postedBy'))
    .run(all());
  const postsUsingRunVariadic = await action().run(
    query(PostMock),
    include('comments.postedBy'),
    all(),
  );
  const manualPostsUsingRunVariadic = await action().run(
    all(),
  ) as PostMock[];

  expectTypeOf(postsUsingFunc).toMatchTypeOf<PostMock[]>();
  expectTypeOf(postsUsingBuild).toMatchTypeOf<PostMock[]>();
  expectTypeOf(postsUsingVariadic).toMatchTypeOf<PostMock[]>();
  expectTypeOf(postsUsingRunVariadic).toMatchTypeOf<PostMock[]>();
  expectTypeOf(manualPostsUsingRunVariadic).toMatchTypeOf<PostMock[]>();

  const postUsingFunc = await action()
    .use(query(new PostMock()))
    .run(cachedOr(oneOrCurrent()));
  const postUsingBuild = await action()
    .query(new PostMock())
    .cachedOr(oneOrCurrent());
  const postUsingVariadic = await action()
    .use(query(new PostMock()))
    .run(cachedOr(oneOrCurrent()));
  const postUsingRunVariadic = await action()
    .run(query(new PostMock()), cachedOr(oneOrCurrent()));

  expectTypeOf(postUsingFunc).toMatchTypeOf<PostMock>();
  expectTypeOf(postUsingBuild).toMatchTypeOf<PostMock>();
  expectTypeOf(postUsingVariadic).toMatchTypeOf<PostMock>();
  expectTypeOf(postUsingRunVariadic).toMatchTypeOf<PostMock>();

  const asPostsUsingFunc = await action()
    .use(queryAs(PostMock))
    .use(include('comments.postedBy'))
    .run(all());
  const asPostsUsingBuild = await action()
    .queryAs(PostMock)
    .include('comments.postedBy')
    .all();
  const asPostsOrCommentsUsingFunc = await action()
    .use(queryAs(PostMock, CommentMock))
    .use(include('images'))
    .run(all());
  const asPostsOrCommentsUsingBuild = await action()
    .queryAs(PostMock, CommentMock)
    .include('images')
    .all();
  const asPostsOrCommentsArrayUsingFunc = await action()
    .use(queryAs([PostMock, CommentMock]))
    .use(include('images'))
    .run(all());
  const asPostsOrCommentsArrayUsingBuild = await action()
    .queryAs([PostMock, CommentMock])
    .include('images')
    .all();

  expectTypeOf(asPostsUsingFunc).toMatchTypeOf<PostMock[]>();
  expectTypeOf(asPostsUsingBuild).toMatchTypeOf<PostMock[]>();
  expectTypeOf(asPostsOrCommentsUsingFunc).toMatchTypeOf<(PostMock | CommentMock)[]>();
  expectTypeOf(asPostsOrCommentsUsingBuild).toMatchTypeOf<(PostMock | CommentMock)[]>();
  expectTypeOf(asPostsOrCommentsArrayUsingFunc).toMatchTypeOf<(PostMock | CommentMock)[]>();
  expectTypeOf(asPostsOrCommentsArrayUsingBuild).toMatchTypeOf<(PostMock | CommentMock)[]>();

  // @ts-expect-error title is not a post relation
  await action().use(queryAs(PostMock), include('title'));
  // @ts-expect-error title is not a post and comment relation
  await action().use(queryAs(PostMock, CommentMock), include('title'));
  // @ts-expect-error comments is not a post and comment relation
  await action().use(queryAs(PostMock, CommentMock), include('comments'));

  const createdPostUsingFunc = await action()
    .use(query(new PostMock()))
    .use(include('comments.postedBy'))
    .run(when(new PostMock().$exists, one()));
  const createdPostUsingBuild = await action()
    .query(new PostMock())
    .include('comments.postedBy')
    .when(new PostMock().$exists, one());
  const createdPostUsingVariadic = await action().run(
    query(new PostMock()),
    include('comments.postedBy'),
    when(new PostMock().$exists, one()),
  );
  const createdPostUsingFuncOrCurrent = await action()
    .use(query(new PostMock()))
    .run(oneOrFail());
  const createdPostUsingBuildOrCurrent = await action()
    .query(new PostMock())
    .oneOrFail();

  expectTypeOf(createdPostUsingFunc).toMatchTypeOf<PostMock | null | void>();
  expectTypeOf(createdPostUsingBuild).toMatchTypeOf<PostMock | null | void>();
  expectTypeOf(createdPostUsingVariadic).toMatchTypeOf<PostMock | null | void>();
  expectTypeOf(createdPostUsingFuncOrCurrent).toMatchTypeOf<PostMock>();
  expectTypeOf(createdPostUsingBuildOrCurrent).toMatchTypeOf<PostMock>();

  expectTypeOf(
    await action()
      .use(create(new PostMock()))
      .run(one()),
  ).toMatchTypeOf<PostMock | null>();
  expectTypeOf(
    await action()
      .use(create(new CommentMock(), new PostMock(), 'comments'))
      .run(one()),
  ).toMatchTypeOf<CommentMock | null>();
  expectTypeOf(
    await action()
      .use(update(new PostMock()))
      .run(one()),
  ).toMatchTypeOf<PostMock | null>();
  expectTypeOf(
    await action()
      .use(destroy(new PostMock()))
      .run(one()),
  ).toMatchTypeOf<PostMock | null>();
  expectTypeOf(
    await action().run(
      associate(new CommentMock(), 'postedBy', new UserMock()),
      one(),
    ),
  ).toMatchTypeOf<UserMock | null>();
  expectTypeOf(
    await action().run(
      dissociate(new CommentMock(), 'postedBy'),
      one(),
    ),
  ).toMatchTypeOf<UserMock | null>();

  expectTypeOf(
    await action().create(new PostMock()).oneOrFail(),
  ).toMatchTypeOf<PostMock>();
  expectTypeOf(
    await action().create(new CommentMock(), new PostMock(), 'comments').oneOrFail(),
  ).toMatchTypeOf<CommentMock>();
  expectTypeOf(
    await action().update(new PostMock()).oneOrFail(),
  ).toMatchTypeOf<PostMock>();
  expectTypeOf(
    await action().destroy(new PostMock()).oneOrFail(),
  ).toMatchTypeOf<PostMock>();
  expectTypeOf(
    await action()
      .associate(new CommentMock(), 'postedBy', new UserMock())
      .oneOrFail(),
  ).toMatchTypeOf<UserMock>();
  expectTypeOf(
    await action()
      .dissociate(new CommentMock(), 'postedBy')
      .oneOrFail(),
  ).toMatchTypeOf<UserMock>();

  // @ts-expect-error title is not a post relation
  await action().use(query(PostMock), include('title'));
  // @ts-expect-error unknown is not a post relation
  await action().use(query(PostMock), include('unknown'));
  // @ts-expect-error postedBy is not a post relation
  await action().use(query(PostMock), include('postedBy'));
  // @ts-expect-error unknown is not a comment relation
  await action().use(query(PostMock), include('comments.unknown'));
  // @ts-expect-error title is not a post relation
  await action().use(query(new PostMock()), include('title'));
  // @ts-expect-error unknown is not a post relation
  await action().use(query(new PostMock()), include('unknown'));
  // @ts-expect-error postedBy is not a post relation
  await action().use(query(new PostMock()), include('postedBy'));
  // @ts-expect-error unknown is not a comment relation
  await action().use(query(new PostMock()), include('comments.unknown'));
  // @ts-expect-error body is not a comment relation
  await action().use(query(new PostMock(), 'comments'), include('body'));
  // @ts-expect-error unknown is not a comment relation
  await action().use(query(new PostMock(), 'comments'), include('unknown'));
  // @ts-expect-error comments is not a comment relation
  await action().use(query(new PostMock(), 'comments'), include('comments'));
  // @ts-expect-error postedBy.unknown is not a comment relation
  await action().use(query(new PostMock(), 'comments'), include('postedBy.unknown'));

  // @ts-expect-error title is not a post relation
  await action().query(PostMock).include('title');
  // @ts-expect-error unknown is not a post relation
  await action().query(PostMock).include('unknown');
  // @ts-expect-error postedBy is not a post relation
  await action().query(PostMock).include('postedBy');
  // @ts-expect-error unknown is not a comment relation
  await action().query(PostMock).include('comments.unknown');
  // @ts-expect-error title is not a post relation
  await action().query(new PostMock()).include('title');
  // @ts-expect-error unknown is not a post relation
  await action().query(new PostMock()).include('unknown');
  // @ts-expect-error postedBy is not a post relation
  await action().query(new PostMock()).include('postedBy');
  // @ts-expect-error unknown is not a comment relation
  await action().query(new PostMock()).include('comments.unknown');
  // @ts-expect-error body is not a comment relation
  await action().query(new PostMock(), 'comments').include('body');
  // @ts-expect-error unknown is not a comment relation
  await action().query(new PostMock(), 'comments').include('unknown');
  // @ts-expect-error comments is not a comment relation
  await action().query(new PostMock(), 'comments').include('comments');
  // @ts-expect-error postedBy.unknown is not a comment relation
  await action().query(new PostMock(), 'comments').include('postedBy.unknown');

  const commentsUsingFunc = await action()
    .use(query(new PostMock(), 'comments'))
    .run(all());
  const commentsUsingBuild = await action()
    .query(new PostMock(), 'comments')
    .all();

  expectTypeOf(commentsUsingFunc).toMatchTypeOf<CommentMock[]>();
  expectTypeOf(commentsUsingBuild).toMatchTypeOf<CommentMock[]>();

  const response = await action().run(raw());

  expectTypeOf(response).toMatchTypeOf<Response>();
  // This will ensure `response` is not `any`.
  expectTypeOf(response).not.toMatchTypeOf<number>();
});
