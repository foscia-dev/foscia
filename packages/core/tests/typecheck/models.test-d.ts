import { attr, fill, makeModel, normalizeDotRelations } from '@foscia/core';
import { expectTypeOf, test } from 'vitest';
import CommentMock from '../mocks/models/comment.mock';
import FileMock from '../mocks/models/file.mock';
import PostMock from '../mocks/models/post.mock';
import TagMock from '../mocks/models/tag.mock';
import UserMock from '../mocks/models/user.mock';

test('Models are type safe', () => {
  const post = new PostMock();

  expectTypeOf(post.id).toMatchTypeOf<string | number | null>();
  expectTypeOf(post.lid).toMatchTypeOf<string | number | null>();
  expectTypeOf(post.title).toMatchTypeOf<string>();
  expectTypeOf(post.body).toMatchTypeOf<string | null>();
  expectTypeOf(post.publishedAt).toMatchTypeOf<Date | null>();
  expectTypeOf(post.comments).toMatchTypeOf<CommentMock[]>();
  expectTypeOf(post.published).toMatchTypeOf<boolean>();

  post.title = 'Hello World';
  // @ts-expect-error publishedAt is readonly
  post.publishedAt = new Date();
  // @ts-expect-error published is readonly
  post.published = false;

  fill(post, { title: 'Hello World' });
  // @ts-expect-error publishedAt is readonly
  fill(post, { publishedAt: new Date() });
  // @ts-expect-error published is not a model's value
  fill(post, { published: false });

  const comment = new CommentMock();

  expectTypeOf(comment.id).toMatchTypeOf<number | null>();
  expectTypeOf(comment.lid).toMatchTypeOf<string>();
  expectTypeOf(comment.body).toMatchTypeOf<string>();
  expectTypeOf(comment.postedAt).toMatchTypeOf<Date>();
  expectTypeOf(comment.postedBy).toMatchTypeOf<UserMock>();

  fill(comment, { body: 'Hello World', postedAt: new Date() });
  // @ts-expect-error id is a number
  comment.id = 'foo';
  // @ts-expect-error lid is a string
  comment.lid = 42;
  // @ts-expect-error body is a string
  fill(comment, { body: new Date() });
  // @ts-expect-error postedAt is a date
  fill(comment, { postedAt: 'Hello World' });

  normalizeDotRelations(PostMock, ['comments']);
  normalizeDotRelations(PostMock, ['comments.postedBy']);
  // @ts-expect-error unknown is not a Post relation
  normalizeDotRelations(PostMock, ['unknown']);
  // @ts-expect-error unknown is not a Comment relation
  normalizeDotRelations(PostMock, ['comments.unknown']);

  const tag = new TagMock();
  expectTypeOf(tag.taggables).toMatchTypeOf<(PostMock | UserMock)[]>();

  const file = new FileMock();
  expectTypeOf(file.parent).toMatchTypeOf<FileMock>();
  expectTypeOf(file.children).toMatchTypeOf<FileMock[]>();

  class ChainedModel extends makeModel('chained', { name: attr<string | null>() })
    .configure({ strict: true })
    .extend({ email: attr<string>() })
    .extend({ age: attr<number>() })
    .configure({ path: 'chained' }) {
  }

  const chained = new ChainedModel();
  expectTypeOf(chained.name).toMatchTypeOf<string | null>();
  expectTypeOf(chained.email).toMatchTypeOf<string>();
  expectTypeOf(chained.age).toMatchTypeOf<number>();
});
