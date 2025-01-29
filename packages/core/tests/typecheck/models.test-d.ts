/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import {
  attr,
  fill,
  hasMany,
  hasOne,
  makeComposable,
  makeModel,
  Model,
  ModelIdType,
  ModelInstance,
  ModelLimitedSnapshot,
  ModelSnapshot,
  normalizeDotRelations,
  takeSnapshot,
  toString,
} from '@foscia/core';
import { expectTypeOf, test } from 'vitest';
import CommentMock from '../mocks/models/comment.mock';
import FileMock from '../mocks/models/file.mock';
import PostMock from '../mocks/models/post.mock';
import TagMock from '../mocks/models/tag.mock';
import UserMock from '../mocks/models/user.mock';

test('Models are type safe', () => {
  const anyInstance = {} as unknown as ModelInstance;

  expectTypeOf(anyInstance.id).toEqualTypeOf<any>();
  expectTypeOf(anyInstance.anything).toEqualTypeOf<any>();
  expectTypeOf(anyInstance.anything.toUpperCase()).toEqualTypeOf<any>();
  // @ts-expect-error id is any
  expectTypeOf(anyInstance.id).toEqualTypeOf<unknown>();
  // @ts-expect-error anything is any
  expectTypeOf(anyInstance.anything).toEqualTypeOf<unknown>();
  // @ts-expect-error id is any
  expectTypeOf(anyInstance.id).toEqualTypeOf<never>();
  // @ts-expect-error anything is any
  expectTypeOf(anyInstance.anything).toEqualTypeOf<never>();

  fill(anyInstance, { anything: 'hello world' });

  const anySnapshot1 = {} as unknown as ModelSnapshot;
  const anySnapshot2 = takeSnapshot(anyInstance);

  expectTypeOf(anySnapshot1.$values.id).toEqualTypeOf<any>();
  expectTypeOf(anySnapshot1.$values.anything).toEqualTypeOf<any>();
  expectTypeOf(anySnapshot1.$values.anything.toUpperCase()).toEqualTypeOf<any>();
  // @ts-expect-error id is any
  expectTypeOf(anySnapshot1.$values.id).toEqualTypeOf<unknown>();
  // @ts-expect-error anything is any
  expectTypeOf(anySnapshot1.$values.anything).toEqualTypeOf<unknown>();
  // @ts-expect-error id is any
  expectTypeOf(anySnapshot1.$values.id).toEqualTypeOf<never>();
  // @ts-expect-error anything is any
  expectTypeOf(anySnapshot1.$values.anything).toEqualTypeOf<never>();

  expectTypeOf(anySnapshot2.$values.id).toEqualTypeOf<any>();
  expectTypeOf(anySnapshot2.$values.anything).toEqualTypeOf<any>();
  expectTypeOf(anySnapshot2.$values.anything.toUpperCase()).toEqualTypeOf<any>();
  // @ts-expect-error id is any
  expectTypeOf(anySnapshot2.$values.id).toEqualTypeOf<unknown>();
  // @ts-expect-error anything is any
  expectTypeOf(anySnapshot2.$values.anything).toEqualTypeOf<unknown>();
  // @ts-expect-error id is any
  expectTypeOf(anySnapshot2.$values.id).toEqualTypeOf<never>();
  // @ts-expect-error anything is any
  expectTypeOf(anySnapshot2.$values.anything).toEqualTypeOf<never>();

  const anyInstanceCast: ModelInstance = new PostMock();
  expectTypeOf(anyInstanceCast.anything).toEqualTypeOf<any>();

  normalizeDotRelations(anyInstanceCast.$model, ['anything']);

  const post = new PostMock();

  expectTypeOf(post.id).toEqualTypeOf<string | number | null>();
  expectTypeOf(post.lid).toEqualTypeOf<string | number | null>();
  expectTypeOf(post.title).toEqualTypeOf<string>();
  expectTypeOf(post.body).toEqualTypeOf<string | null>();
  expectTypeOf(post.publishedAt).toEqualTypeOf<Date | null>();
  expectTypeOf(post.comments).toEqualTypeOf<CommentMock[]>();
  expectTypeOf(post.commentsCount).toEqualTypeOf<number>();
  expectTypeOf(post.published).toEqualTypeOf<boolean>();

  post.title = 'Hello World';
  // @ts-expect-error publishedAt is readonly
  post.publishedAt = new Date();
  // @ts-expect-error commentsCount is readonly
  post.commentsCount = 1;
  // @ts-expect-error published is readonly
  post.published = false;

  fill(post, { title: 'Hello World' });
  // @ts-expect-error publishedAt is readonly
  fill(post, { publishedAt: new Date() });
  // @ts-expect-error publishedAt is readonly
  fill(post, { commentsCount: 1 });
  // @ts-expect-error published is not a model's value
  fill(post, { published: false });

  const postSnapshot = takeSnapshot(post);

  expectTypeOf(postSnapshot.$values.id).toEqualTypeOf<string | number | null | undefined>();
  expectTypeOf(postSnapshot.$values.lid).toEqualTypeOf<string | number | null | undefined>();
  expectTypeOf(postSnapshot.$values.title).toEqualTypeOf<string | undefined>();
  expectTypeOf(postSnapshot.$values.body).toEqualTypeOf<string | null | undefined>();
  expectTypeOf(postSnapshot.$values.publishedAt).toEqualTypeOf<Date | null | undefined>();
  expectTypeOf(postSnapshot.$values.commentsCount).toEqualTypeOf<number | undefined>();
  // eslint-disable-next-line max-len
  expectTypeOf(postSnapshot.$values.comments).toEqualTypeOf<(ModelSnapshot<CommentMock> | ModelLimitedSnapshot<CommentMock>)[] | undefined>();
  // @ts-expect-error notFound property does not exists
  postSnapshot.$values.notFound;
  // @ts-expect-error published property does not exists
  postSnapshot.$values.published;
  // @ts-expect-error title is readonly
  postSnapshot.$values.title = 'Hello World';

  expectTypeOf(postSnapshot.$values.comments![0].$values.id)
    .toEqualTypeOf<number | null | undefined>();
  expectTypeOf(postSnapshot.$values.comments![0].$values.lid).toEqualTypeOf<string | undefined>();

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

  const commentSnapshot = takeSnapshot(comment);

  expectTypeOf(commentSnapshot.$values.id).toEqualTypeOf<number | null | undefined>();
  expectTypeOf(commentSnapshot.$values.lid).toEqualTypeOf<string | undefined>();
  expectTypeOf(commentSnapshot.$values.body).toEqualTypeOf<string | undefined>();
  expectTypeOf(commentSnapshot.$values.postedAt).toEqualTypeOf<Date | undefined>();
  expectTypeOf(commentSnapshot.$values.postedBy)
    .toEqualTypeOf<(ModelSnapshot<UserMock> | ModelLimitedSnapshot<UserMock>) | undefined>();

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

  class ModelProps extends makeModel('model-props', {
    attr1: attr('', { readOnly: true }),
    attr2: attr(toString(), { default: null }),
    attr3: attr(toString(), { readOnly: true }),
    rel1: hasOne<PostMock>('posts'),
    rel2: hasOne<PostMock | CommentMock, true>({ readOnly: true }),
    rel3: hasOne(() => PostMock, { readOnly: true }),
  }) {
  }

  const modelProps = new ModelProps();

  expectTypeOf(modelProps.attr1).toEqualTypeOf<string>();
  // @ts-expect-error attr3 is readonly
  modelProps.attr1 = 'hello';
  expectTypeOf(modelProps.attr2).toEqualTypeOf<string | null>();
  modelProps.attr2 = 'hello';
  expectTypeOf(modelProps.attr3).toEqualTypeOf<string>();
  // @ts-expect-error attr3 is readonly
  modelProps.attr3 = 'hello';

  expectTypeOf(modelProps.rel1).toEqualTypeOf<PostMock>();
  modelProps.rel1 = new PostMock();
  expectTypeOf(modelProps.rel2).toEqualTypeOf<PostMock | CommentMock>();
  // @ts-expect-error rel2 is readonly
  modelProps.rel2 = new CommentMock();
  expectTypeOf(modelProps.rel3).toEqualTypeOf<PostMock>();
  // @ts-expect-error rel3 is readonly
  modelProps.rel3 = new CommentMock();

  class ModelComposite extends makeModel('model-composite', {
    user: makeComposable({
      user: hasOne<UserMock>(),
      userId: attr<ModelIdType>(),
    }),
  }) {
  }

  const modelComposite = new ModelComposite();

  expectTypeOf(modelComposite.user).toEqualTypeOf<UserMock>();
  expectTypeOf(modelComposite.userId).toEqualTypeOf<ModelIdType>();

  class ModelInverse extends makeModel('model-inverse', {
    comments1: hasMany(() => CommentMock, { inverse: 'postedBy' }),
    comments2: hasMany(() => CommentMock).inverse('postedBy'),
    comments3: hasMany<CommentMock[]>().inverse('postedBy'),

    any1: hasMany(() => CommentMock as Model, { inverse: 'postedBy' }),
    any2: hasMany(() => CommentMock as Model).inverse('postedBy'),
    any3: hasMany<any[]>().inverse('postedBy'),
    any4: hasMany<ModelInstance[]>().inverse('postedBy'),

    // @ts-expect-error postedAt is not a relation
    attrInvalid1: hasMany(() => CommentMock, { inverse: 'postedAt' }),
    // @ts-expect-error postedAt is not a relation
    attrInvalid2: hasMany(() => CommentMock).inverse('postedAt'),
    // @ts-expect-error postedAt is not a relation
    attrInvalid3: hasMany<CommentMock[]>().inverse('postedAt'),

    relShouldFail1: hasOne(() => UserMock, { inverse: 'comments' }),
    relShouldFail2: hasOne(() => UserMock).inverse('comments'),
    relShouldFail3: hasOne<UserMock[]>().inverse('comments'),
  }) {
  }

  expectTypeOf(new ModelInverse()).toEqualTypeOf<ModelInverse>();
});
