import {
  attr,
  forceFill,
  hasMany,
  hasOne,
  makeComposable,
  makeModel,
  makeTransformer,
  ModelInstance,
} from '@foscia/core';
import { makeJsonRestSerializer, RestSerializerConfig } from '@foscia/rest';
import { Awaitable } from '@foscia/shared';
import { Assertion, describe, expect, it } from 'vitest';

describe.concurrent('unit: makeJsonRestSerializer', () => {
  const authored = makeComposable({
    author: hasOne(),
  });

  const Comment = makeModel('comments', {
    authored,
    body: attr(),
    pushOnly: attr().sync('push'),
  });

  const Post = makeModel('posts', {
    authored,
    title: attr(),
    body: attr(),
    comments: hasMany(),
    pullOnly: attr().readOnly().sync('pull'),
  });

  const User = makeModel('users', {
    username: attr(makeTransformer(
      (value: string) => value.toLowerCase(),
      (value: string) => value.toUpperCase(),
    )).alias('userName'),
    posts: hasMany().alias('myPosts'),
  });

  const user1 = forceFill(new User(), {
    id: '1',
    username: 'john',
  });
  const user2 = forceFill(new User(), {
    id: '2',
    username: 'jane',
  });

  const comment1 = forceFill(new Comment(), {
    id: '1',
    body: 'comment from john',
    pushOnly: 'foo',
    author: user1,
  });
  const comment2 = forceFill(new Comment(), {
    id: '2',
    body: 'comment from jane',
    author: user2,
  });

  const post1 = forceFill(new Post(), {
    id: '1',
    title: 'title from john',
    body: 'body from john',
    pullOnly: 'bar',
    author: user1,
    comments: [comment1, comment2],
  });
  const post2 = forceFill(new Post(), {
    id: '2',
    title: 'title from jane',
    body: null,
    author: user2,
  });

  forceFill(user1, { posts: [post1] });
  forceFill(user2, { posts: [post2] });

  type TestDataProvider = [
    ModelInstance,
    Partial<RestSerializerConfig<any, any, any>>,
    {},
    (assertion: Assertion) => Awaitable<void>,
  ];

  it.each([
    [
      post1,
      {},
      {},
      (assertion: Assertion) => assertion.resolves.toStrictEqual({
        id: '1',
        title: 'title from john',
        body: 'body from john',
        author: '1',
        comments: ['1', '2'],
      }),
    ],
    [
      post1,
      {
        serializeType: true,
      },
      {},
      (assertion: Assertion) => assertion.resolves.toStrictEqual({
        id: '1',
        type: 'posts',
        title: 'title from john',
        body: 'body from john',
        author: '1',
        comments: ['1', '2'],
      }),
    ],
    [
      post1,
      {
        createData: (records) => ({ data: records }),
      },
      {},
      (assertion: Assertion) => assertion.resolves.toStrictEqual({
        data: {
          id: '1',
          title: 'title from john',
          body: 'body from john',
          author: '1',
          comments: ['1', '2'],
        },
      }),
    ],
    [
      post1,
      {
        serializeRelation: (context, related, parents) => context.serializer
          .serializeInstance(related, context, parents),
      },
      {},
      (assertion: Assertion) => assertion.resolves.toStrictEqual({
        id: '1',
        title: 'title from john',
        body: 'body from john',
        author: {
          id: '1',
          userName: 'JOHN',
        },
        comments: [
          {
            id: '1',
            body: 'comment from john',
            pushOnly: 'foo',
            author: {
              id: '1',
              userName: 'JOHN',
            },
          },
          {
            id: '2',
            body: 'comment from jane',
            author: {
              id: '2',
              userName: 'JANE',
            },
          },
        ],
      }),
    ],
    [
      post1,
      {
        serializeType: true,
        serializeRelation: (context, related, parents) => context.serializer
          .serializeInstance(related, context, parents),
        circularRelationBehavior: () => 'keep',
      },
      {},
      (assertion: Assertion) => assertion.resolves.toStrictEqual({
        id: '1',
        type: 'posts',
        title: 'title from john',
        body: 'body from john',
        author: {
          id: '1',
          type: 'users',
          userName: 'JOHN',
          myPosts: [
            {
              id: '1',
              type: 'posts',
              title: 'title from john',
              body: 'body from john',
              comments: [
                {
                  id: '1',
                  type: 'comments',
                  body: 'comment from john',
                  pushOnly: 'foo',
                  author: {
                    id: '1',
                    type: 'users',
                    userName: 'JOHN',
                  },
                },
                {
                  id: '2',
                  type: 'comments',
                  body: 'comment from jane',
                  author: {
                    id: '2',
                    type: 'users',
                    userName: 'JANE',
                  },
                },
              ],
            },
          ],
        },
        comments: [
          {
            id: '1',
            type: 'comments',
            body: 'comment from john',
            pushOnly: 'foo',
            author: {
              id: '1',
              type: 'users',
              userName: 'JOHN',
              myPosts: [
                {
                  id: '1',
                  type: 'posts',
                  title: 'title from john',
                  body: 'body from john',
                  author: {
                    id: '1',
                    type: 'users',
                    userName: 'JOHN',
                  },
                },
              ],
            },
          },
          {
            id: '2',
            type: 'comments',
            body: 'comment from jane',
            author: {
              id: '2',
              type: 'users',
              userName: 'JANE',
              myPosts: [
                {
                  id: '2',
                  type: 'posts',
                  title: 'title from jane',
                  body: null,
                  author: {
                    id: '2',
                    type: 'users',
                    userName: 'JANE',
                  },
                },
              ],
            },
          },
        ],
      }),
    ],
    [
      post1,
      {
        circularRelationBehavior: () => 'throw',
        serializeRelation: (context, related, parents) => context.serializer
          .serializeInstance(related, context, parents),
      },
      {},
      (assertion: Assertion) => assertion.rejects.toThrowError(
        '[foscia] Circular relation detected on `posts.author` during serialization. Handling it with behavior `throw`.',
      ),
    ],
  ] as TestDataProvider[])(
    'should serialize instance with configuration',
    async (instance, config, context, expectation) => {
      const { serializer } = makeJsonRestSerializer(config);
      const serialize = async () => serializer.serialize(
        await serializer.serializeInstance(instance, context),
        context,
      );

      await expectation(expect(serialize()));
    },
  );

  it.each([
    [
      post1,
      {},
      {},
      (assertion: Assertion) => assertion.resolves.toStrictEqual('1'),
    ],
    [
      post1,
      {
        serializeRelated: (_, related) => ({
          type: related.$model.$type,
          id: related.id,
        }),
      },
      {},
      (assertion: Assertion) => assertion.resolves.toStrictEqual({
        id: '1',
        type: 'users',
      }),
    ],
    [
      post1,
      {
        serializeRelated: (context, related, parents) => context.serializer
          .serializeInstance(related, context, parents),
      },
      {},
      (assertion: Assertion) => assertion.resolves.toStrictEqual({
        id: '1',
        userName: 'JOHN',
        myPosts: ['1'],
      }),
    ],
  ] as TestDataProvider[])(
    'should serialize relation with configuration',
    async (instance, config, context, expectation) => {
      const { serializer } = makeJsonRestSerializer(config);
      const serialize = async () => serializer.serialize(
        await serializer.serializeRelation(
          instance,
          instance.$model.$schema.author,
          instance.author,
          context,
        ),
        context,
      );

      await expectation(expect(serialize()));
    },
  );

  it('should serialize with advanced configuration', async () => {
    const Model = makeModel('model', {
      foo: attr(() => 'foo'),
      bar: attr(() => 'bar'),
    });

    const instance = new Model();

    const { serializer } = makeJsonRestSerializer({
      shouldSerialize: ({ key }) => key === 'bar',
      serializeKey: ({ key }) => key.toUpperCase(),
      serializeAttribute: ({ value }) => String(value).toUpperCase(),
    });

    await expect(serializer.serializeInstance(instance, {})).resolves.toStrictEqual({
      id: undefined,
      BAR: 'BAR',
    });
  });
});
