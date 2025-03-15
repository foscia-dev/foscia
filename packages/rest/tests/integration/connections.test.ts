/* eslint-disable max-classes-per-file */
import {
  all,
  attr,
  configureFoscia,
  consumeModel,
  hasMany,
  hasOne,
  include,
  isPluralRelation,
  makeActionFactory,
  makeCache,
  makeFilteredLazyLoader,
  makeModel,
  makeRegistry,
  makeSmartLoader,
  ModelIdType,
  ModelInstance,
  query,
} from '@foscia/core';
import { deepParamsSerializer, param } from '@foscia/http';
import {
  makeRestAdapter,
  makeRestDeserializer,
  makeRestEagerLoader,
  makeRestSerializer,
} from '@foscia/rest';
import { singularize, uniqueValues, wrap } from '@foscia/shared';
import { describe, expect, it } from 'vitest';
import mockFetch from '../../../../tests/mocks/mockFetch';

describe('integration: REST with multiple connections', () => {
  it('should manage multiple connections', async () => {
    class Image extends makeModel('v1:images', {
      userId: attr<string>(),
    }) {
    }

    class Payment extends makeModel('v1:payments', {
      // TODO polymorphic.
      payableType: attr<string>(),
      payableId: attr<string>(),
      payable: hasOne(['v2:purchases', 'v1:subscriptions']),
    }) {
    }

    class Purchase extends makeModel('v2:purchases', {
      payment: hasOne(() => Payment),
    }) {
    }

    class Subscription extends makeModel('v1:subscriptions', {
      payment: hasOne(() => Payment),
      userId: attr<string>(),
    }) {
    }

    class User extends makeModel('v1:users', {
      // TODO Not belongs to, keep as hasOne.
      avatar: hasOne(() => Image, { nullable: true }),
      avatarId: attr<string | null>(),
      activeSubscriptions: hasMany(() => Subscription, {
        include: 'payment',
        query: (action) => action(param('active', true)),
      }),
      pastSubscriptions: hasMany(() => Subscription, {
        query: (action) => action(param('active', false)),
      }),
    }) {
    }

    class Comment extends makeModel('v2:comments', {
      author: hasOne(() => User),
      authorId: attr<string>(),
      postId: attr<string>(),
    }) {
    }

    class Post extends makeModel('v1:posts', {
      author: hasOne(() => User),
      authorId: attr<string>(),
      comments: hasMany(() => Comment),
    }) {
    }

    const commonContext = {
      ...makeCache(),
      ...makeRegistry([Purchase, Subscription]),
      ...makeRestDeserializer(),
      ...makeRestSerializer(),
      ...makeSmartLoader({
        eagerLoader: makeRestEagerLoader({ param: 'with' }),
        lazyLoader: makeFilteredLazyLoader({
          extract: async (instance, relation) => {
            const type = wrap((await relation.model?.()) ?? [])[0]?.$type!;
            if (isPluralRelation(relation)) {
              const key = singularize(relation.parent.$type);

              return { relation, type, key: `${key}Id`, param: key, id: instance.id };
            }

            const value = instance[`${relation.key}Id`];

            return value !== null && value !== undefined
              ? { relation, type, key: 'id', param: 'id', id: instance[`${relation.key}Id`] }
              : null;
          },
          prepare: async (action, references) => {
            const model = await consumeModel(action);
            const params = new Map<string, ModelIdType[]>();
            references.forEach((ref) => {
              if (ref.type === model.$type) {
                params.set(ref.param, [...(params.get(ref.param) ?? []), ref.id]);
              }
            });
            if (!params.size) {
              return false;
            }

            params.forEach((ids, key) => action(param(key, uniqueValues(ids).join(','))));

            return true;
          },
          remap: (references, related) => new Map(references.reduce((entries, reference) => {
            const entry = [reference, []] as [any, ModelInstance[]];

            related.forEach((instance) => {
              if (
                instance.$model.$type === reference.type
                && (
                  isPluralRelation(reference.relation)
                    ? instance[reference.key] === reference.id
                    : instance.id === reference.id
                )
              ) {
                entry[1].push(instance);
              }
            });

            return [...entries, entry];
          }, [] as [any, ModelInstance[]][])),
        }),
      }),
    };

    const v1Action = makeActionFactory({
      ...commonContext,
      ...makeRestAdapter({
        baseURL: 'https://example.com/api/v1',
        serializeParams: deepParamsSerializer,
      }),
    });

    const v2Action = makeActionFactory({
      ...commonContext,
      ...makeRestAdapter({
        baseURL: 'https://example.com/api/v2',
        serializeParams: deepParamsSerializer,
      }),
    });

    configureFoscia({ connections: { v1: v1Action, v2: v2Action } });

    const { unMockFetch } = mockFetch([
      [
        'https://example.com/api/v1/posts?with=author',
        [
          {
            id: 'post:1',
            author: {
              id: 'user:1',
              name: 'Foo',
            },
          },
          {
            id: 'post:2',
            author: {
              id: 'user:2',
              name: 'Bar',
            },
          },
        ],
      ],
      [
        `https://example.com/api/v2/comments?post=${encodeURIComponent('post:1,post:2')}`,
        [
          {
            id: 'comment:1',
            authorId: 'user:1',
            postId: 'post:1',
          },
          {
            id: 'comment:2',
            authorId: 'user:2',
            postId: 'post:1',
          },
          {
            id: 'comment:3',
            authorId: 'user:3',
            postId: 'post:2',
          },
        ],
      ],
      [
        `https://example.com/api/v1/users?id=${encodeURIComponent('user:1,user:2,user:3')}`,
        [
          {
            id: 'user:1',
            avatarId: 'image:1',
          },
          {
            id: 'user:2',
            avatarId: 'image:2',
          },
          {
            id: 'user:3',
            avatarId: null,
          },
        ],
      ],
      [
        `https://example.com/api/v1/images?public=true&id=${encodeURIComponent('image:1,image:2')}`,
        [
          {
            id: 'image:1',
            userId: 'user:1',
          },
          {
            id: 'image:2',
            userId: 'user:2',
          },
        ],
      ],
      [
        `https://example.com/api/v1/subscriptions?active=true&user=${encodeURIComponent('user:1,user:2,user:3')}&with=payment`,
        [
          {
            id: 'subscription:1',
            userId: 'user:2',
            payment: {
              id: 'payment:1',
            },
          },
          {
            id: 'subscription:2',
            userId: 'user:2',
            payment: {
              id: 'payment:2',
            },
          },
        ],
      ],
      [
        `https://example.com/api/v1/subscriptions?active=false&user=${encodeURIComponent('user:1,user:2,user:3')}`,
        [
          {
            id: 'subscription:3',
            userId: 'user:1',
          },
          {
            id: 'subscription:4',
            userId: 'user:2',
          },
        ],
      ],
      [
        'https://example.com/api/v1/payments',
        [
          {
            id: 'payment:1',
            payableType: 'subscriptions',
            payableId: 'subscription:1',
          },
          {
            id: 'payment:2',
            payableType: 'subscriptions',
            payableId: 'subscription:2',
          },
          {
            id: 'payment:3',
            payableType: 'purchases',
            payableId: 'purchase:1',
          },
          {
            id: 'payment:4',
            payableType: 'purchases',
            payableId: 'purchase:2',
          },
        ],
      ],
    ]);

    const posts = await v1Action(
      query(Post),
      include([
        'author',
        'comments.author',
        'comments.author.activeSubscriptions',
        'comments.author.pastSubscriptions',
        // TODO comments.author.activeSubscriptions.payments
      ]),
      include([
        // @ts-expect-error Entries are not supported for now.
        ['comments.author.avatar', (action) => action(param('public', true))],
      ]),
      all(),
    );

    const payments = await v1Action(
      query(Payment),
      include('payable'),
      all(),
    );

    unMockFetch();

    const mapIds = (instances: ModelInstance[]) => instances.map(({ id }) => id);

    expect(mapIds(posts)).toStrictEqual(['post:1', 'post:2']);

    expect(posts[0].author.id).toStrictEqual('user:1');
    expect(mapIds(posts[0].comments)).toStrictEqual(['comment:1', 'comment:2']);
    expect(mapIds(posts[0].comments.map((c) => c.author))).toStrictEqual(['user:1', 'user:2']);

    expect(posts[1].author.id).toStrictEqual('user:2');
    expect(mapIds(posts[1].comments)).toStrictEqual(['comment:3']);
    expect(mapIds(posts[1].comments.map((c) => c.author))).toStrictEqual(['user:3']);

    const user1 = posts[0].comments[0].author;
    const user2 = posts[0].comments[1].author;
    const user3 = posts[1].comments[0].author;

    expect(user1.avatar!.id).toStrictEqual('image:1');
    expect(mapIds(user1.activeSubscriptions)).toStrictEqual([]);
    expect(mapIds(user1.pastSubscriptions)).toStrictEqual(['subscription:3']);

    expect(user2.avatar!.id).toStrictEqual('image:2');
    expect(mapIds(user2.activeSubscriptions)).toStrictEqual(['subscription:1', 'subscription:2']);
    expect(mapIds(user2.activeSubscriptions.map((s) => s.payment))).toStrictEqual(['payment:1', 'payment:2']);
    expect(mapIds(user2.pastSubscriptions)).toStrictEqual(['subscription:4']);

    expect(user3.avatar).toStrictEqual(null);
    expect(user3.activeSubscriptions).toStrictEqual([]);
    expect(user3.pastSubscriptions).toStrictEqual([]);

    expect(mapIds(payments)).toStrictEqual(['payment:1', 'payment:2', 'payment:3', 'payment:4']);
  });
});
