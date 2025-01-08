import {
  Adapter,
  all,
  associate,
  attach,
  cached,
  cachedOr,
  InstancesCache,
  create,
  Deserializer,
  destroy,
  dissociate,
  include,
  makeActionFactory,
  one,
  oneOrCurrent,
  oneOrFail,
  query,
  queryAs,
  raw,
  Serializer,
  update,
  when,
} from '@foscia/core';
import { expectTypeOf, test } from 'vitest';
import CommentMock from '../mocks/models/comment.mock';
import PostMock from '../mocks/models/post.mock';
import UserMock from '../mocks/models/user.mock';

test('Actions are type safe', async () => {
  const action = makeActionFactory({
    adapter: null as unknown as Adapter<Response>,
    cache: null as unknown as InstancesCache,
    serializer: null as unknown as Serializer<any, any, any>,
    deserializer: null as unknown as Deserializer<any>,
  });

  const postsUsingFunc = await action()
    .use(query(PostMock))
    .use(include('comments.postedBy'))
    .run(all());
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

  expectTypeOf(postsUsingFunc).toEqualTypeOf<PostMock[]>();
  expectTypeOf(postsUsingVariadic).toEqualTypeOf<PostMock[]>();
  expectTypeOf(postsUsingRunVariadic).toEqualTypeOf<PostMock[]>();
  expectTypeOf(manualPostsUsingRunVariadic).toEqualTypeOf<PostMock[]>();

  const postNullUsingFunc = await action()
    .use(query(new PostMock()))
    .run(cached());
  const postUsingFunc = await action()
    .use(query(new PostMock()))
    .run(cachedOr(oneOrCurrent()));
  const postUsingRunVariadic = await action()
    .run(query(new PostMock()), cachedOr(oneOrCurrent()));

  expectTypeOf(postNullUsingFunc).toEqualTypeOf<PostMock | null>();
  expectTypeOf(postUsingFunc).toEqualTypeOf<PostMock>();
  expectTypeOf(postUsingRunVariadic).toEqualTypeOf<PostMock>();

  const asPostsUsingFunc = await action()
    .use(queryAs(PostMock))
    .use(include('comments.postedBy'))
    .run(all());
  const asPostsOrCommentsUsingFunc = await action()
    .use(queryAs(PostMock, CommentMock))
    .use(include('images'))
    .run(all());
  const asPostsOrCommentsArrayUsingFunc = await action()
    .use(queryAs([PostMock, CommentMock]))
    .use(include('images'))
    .run(all());

  expectTypeOf(asPostsUsingFunc).toEqualTypeOf<PostMock[]>();
  expectTypeOf(asPostsOrCommentsUsingFunc).toEqualTypeOf<(PostMock | CommentMock)[]>();
  expectTypeOf(asPostsOrCommentsArrayUsingFunc).toEqualTypeOf<(PostMock | CommentMock)[]>();

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
  const createdPostUsingVariadic = await action().run(
    query(new PostMock()),
    include('comments.postedBy'),
    when(new PostMock().$exists, one()),
  );
  const createdPostUsingFuncOrCurrent = await action()
    .use(query(new PostMock()))
    .run(oneOrFail());

  expectTypeOf(createdPostUsingFunc).toEqualTypeOf<PostMock | null | void>();
  expectTypeOf(createdPostUsingVariadic).toEqualTypeOf<PostMock | null | void>();
  expectTypeOf(createdPostUsingFuncOrCurrent).toEqualTypeOf<PostMock>();

  expectTypeOf(
    await action()
      .use(create(new PostMock()))
      .run(one()),
  ).toEqualTypeOf<PostMock | null>();
  expectTypeOf(
    await action()
      .use(create(new CommentMock(), new PostMock(), 'comments'))
      .run(one()),
  ).toEqualTypeOf<CommentMock | null>();
  expectTypeOf(
    await action()
      .use(update(new PostMock()))
      .run(one()),
  ).toEqualTypeOf<PostMock | null>();
  expectTypeOf(
    await action()
      .use(destroy(new PostMock()))
      .run(one()),
  ).toEqualTypeOf<PostMock | null>();
  expectTypeOf(
    await action().run(
      associate(new CommentMock(), 'postedBy', new UserMock()),
      one(),
    ),
  ).toEqualTypeOf<UserMock | null>();
  expectTypeOf(
    await action().run(
      dissociate(new CommentMock(), 'postedBy'),
      one(),
    ),
  ).toEqualTypeOf<UserMock | null>();

  expectTypeOf(
    await action().run(
      associate(new CommentMock(), 'postedBy', new UserMock()),
      oneOrFail(),
    ),
  ).toEqualTypeOf<UserMock>();
  expectTypeOf(
    await action().run(
      dissociate(new CommentMock(), 'postedBy'),
      oneOrFail(),
    ),
  ).toEqualTypeOf<UserMock>();
  expectTypeOf(
    await action().run(
      attach(new PostMock(), 'comments', new CommentMock()),
      oneOrFail(),
    ),
  ).toEqualTypeOf<CommentMock>();
  expectTypeOf(
    await action().run(
      attach(new PostMock(), 'comments', [new CommentMock(), new CommentMock()]),
      oneOrFail(),
    ),
  ).toEqualTypeOf<CommentMock>();

  await action().use(query(PostMock), include(
    // Placing the expectation here ensure the error comes
    // from the parameter and not from the function typing.
    // @ts-expect-error title is not a post relation
    'title',
  ));
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
  // @ts-expect-error PostMock not assignable to UserMock
  await action().use(associate(new CommentMock(), 'postedBy', new PostMock()));
  // @ts-expect-error [PostMock] not assignable to UserMock
  await action().use(associate(new CommentMock(), 'postedBy', [new PostMock()]));
  // @ts-expect-error [UserMock] not assignable to UserMock
  await action().use(associate(new CommentMock(), 'postedBy', [new UserMock()]));
  // @ts-expect-error PostMock not assignable to CommentMock
  await action().use(attach(new PostMock(), 'comments', new PostMock()));
  // @ts-expect-error PostMock not assignable to CommentMock
  await action().use(attach(new PostMock(), 'comments', [new PostMock()]));

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

  expectTypeOf(commentsUsingFunc).toEqualTypeOf<CommentMock[]>();

  const response = await action().run(raw());

  expectTypeOf(response).toEqualTypeOf<Response>();
  // This will ensure `response` is not `any`.
  expectTypeOf(response).not.toEqualTypeOf<number>();
});
