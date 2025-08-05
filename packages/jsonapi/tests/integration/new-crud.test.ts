import {
  all,
  attr,
  belongsTo,
  foreign,
  hasMany,
  makeActionFactory,
  makeComposable,
  makeModel,
  ModelForeign,
  ModelPrimary,
  ModelRelation,
  oneOrFail,
  primary,
  query,
  toDateTime,
} from '@foscia/core';
import {
  makeJsonApiAdapter,
  makeJsonApiDeserializer,
  makeJsonApiSerializer,
} from '@foscia/jsonapi';
import { expect, it } from 'vitest';
import mockFetch from '../../../../tests/mocks/mockFetch';

describe('integration: JSON:API', () => {
  const stringId = makeComposable((model) => class extends model {
    @primary() id!: ModelPrimary<string>;
  });

  const model = makeModel({
    composables: [stringId],
  });

  @model('comments')
  class Comment extends model.base() {
    @attr() body!: string;

    @foreign() postId!: ModelForeign<Post['id']>;

    @belongsTo(() => Post) post!: ModelRelation<Post>;
  }

  @model('posts')
  class Post extends model.base() {
    @attr() title!: string;

    @attr() body!: string | null;

    @attr(toDateTime()) readonly publishedAt!: Date | null;

    @hasMany(() => Comment, {
      foreignKey: 'postId',
      localKey: 'id',
      inverse: 'post',
    }) comments!: ModelRelation<Comment[]>;
  }

  const action = makeActionFactory({
    adapter: makeJsonApiAdapter({ baseURL: 'https://example.com/api/v1' }),
    serializer: makeJsonApiSerializer(),
    deserializer: makeJsonApiDeserializer(),
  });

  it('should retrieve many records', async () => {
    const { unMockFetch } = mockFetch([
      ['https://example.com/api/v1/posts', {
        data: [
          {
            type: 'posts',
            id: '1',
            attributes: { title: 'Foo', body: 'Foo Body', publishedAt: '2023-10-24T10:00:00.000Z' },
            relationships: {
              comments: { data: [{ type: 'comments', id: '1' }, { type: 'comments', id: '2' }] },
            },
          },
          {
            type: 'posts',
            id: '2',
            attributes: { title: 'Bar', body: 'Bar Body', publishedAt: null },
            relationships: {
              comments: { data: [] },
            },
          },
        ],
        included: [
          {
            type: 'comments',
            id: '1',
            attributes: { body: 'Foo Comment' },
          },
          {
            type: 'comments',
            id: '2',
            attributes: { body: 'Bar Comment' },
          },
        ],
      }],
    ]);

    const posts = await action(
      query(Post),
      all(),
    );

    expect(posts).toHaveLength(2);

    expect(posts[0]).toBeInstanceOf(Post);
    expect(posts[0].$exists).toStrictEqual(true);
    expect(posts[0].id).toStrictEqual('1');
    expect(posts[0].title).toStrictEqual('Foo');
    expect(posts[0].body).toStrictEqual('Foo Body');
    expect(posts[0].publishedAt!.toISOString()).toStrictEqual('2023-10-24T10:00:00.000Z');
    expect(posts[0].comments).toHaveLength(2);
    expect(posts[0].comments[0].$exists).toStrictEqual(true);
    expect(posts[0].comments[0]).toBeInstanceOf(Comment);
    expect(posts[0].comments[0].id).toStrictEqual('1');
    expect(posts[0].comments[0].body).toStrictEqual('Foo Comment');
    expect(posts[0].comments[0].post).toStrictEqual(posts[0]);
    expect(posts[0].comments[1].$exists).toStrictEqual(true);
    expect(posts[0].comments[1]).toBeInstanceOf(Comment);
    expect(posts[0].comments[1].id).toStrictEqual('2');
    expect(posts[0].comments[1].body).toStrictEqual('Bar Comment');
    expect(posts[0].comments[1].post).toStrictEqual(posts[0]);

    expect(posts[1]).toBeInstanceOf(Post);
    expect(posts[1].$exists).toStrictEqual(true);
    expect(posts[1].id).toStrictEqual('2');
    expect(posts[1].title).toStrictEqual('Bar');
    expect(posts[1].body).toStrictEqual('Bar Body');
    expect(posts[1].publishedAt).toBeNull();
    expect(posts[1].comments).toHaveLength(0);

    unMockFetch();
  });

  it('should retrieve one record', async () => {
    const { unMockFetch } = mockFetch([
      ['https://example.com/api/v1/posts/1', {
        data: {
          type: 'posts',
          id: '1',
          attributes: { title: 'Foo', body: 'Foo Body', publishedAt: '2023-10-24T10:00:00.000Z' },
        },
      }],
    ]);

    const post = await action(
      query(Post, '1'),
      oneOrFail(),
    );

    expect(post).toBeInstanceOf(Post);
    expect(post.$exists).toStrictEqual(true);
    expect(post.id).toStrictEqual('1');
    expect(post.title).toStrictEqual('Foo');
    expect(post.body).toStrictEqual('Foo Body');
    expect(post.publishedAt!.toISOString()).toStrictEqual('2023-10-24T10:00:00.000Z');

    unMockFetch();
  });
});
