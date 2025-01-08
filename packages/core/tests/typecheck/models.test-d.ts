import { attr, fill, makeModel, normalizeDotRelations } from '@foscia/core';
import { expectTypeOf, test } from 'vitest';
import CommentMock from '../mocks/models/comment.mock';
import FileMock from '../mocks/models/file.mock';
import PostMock from '../mocks/models/post.mock';
import TagMock from '../mocks/models/tag.mock';
import UserMock from '../mocks/models/user.mock';

test('Models are type safe', () => {
  const post = new PostMock();

  expectTypeOf(post.id).toEqualTypeOf<string | number | null>();
  expectTypeOf(post.lid).toEqualTypeOf<string | number | null>();
  expectTypeOf(post.title).toEqualTypeOf<string>();
  expectTypeOf(post.body).toEqualTypeOf<string | null>();
  expectTypeOf(post.publishedAt).toEqualTypeOf<Date | null>();
  expectTypeOf(post.comments).toEqualTypeOf<CommentMock[]>();
  expectTypeOf(post.published).toEqualTypeOf<boolean>();

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

  expectTypeOf(comment.id).toEqualTypeOf<number | null>();
  expectTypeOf(comment.lid).toEqualTypeOf<string>();
  expectTypeOf(comment.body).toEqualTypeOf<string>();
  expectTypeOf(comment.postedAt).toEqualTypeOf<Date>();
  expectTypeOf(comment.postedBy).toEqualTypeOf<UserMock>();

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
  expectTypeOf(tag.taggables).toEqualTypeOf<(PostMock | UserMock)[]>();

  const file = new FileMock();
  expectTypeOf(file.parent).toEqualTypeOf<FileMock>();
  expectTypeOf(file.children).toEqualTypeOf<FileMock[]>();

  class ChainedModel extends makeModel('chained', { name: attr<string | null>() })
    .configure({ strict: true })
    .extend({ email: attr<string>() })
    .extend({ age: attr<number>() })
    .configure({ path: 'chained' }) {
  }

  const chained = new ChainedModel();
  expectTypeOf(chained.name).toEqualTypeOf<string | null>();
  expectTypeOf(chained.email).toEqualTypeOf<string>();
  expectTypeOf(chained.age).toEqualTypeOf<number>();
});
