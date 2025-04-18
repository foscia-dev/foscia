import {
  attr,
  fill,
  filled,
  hasMany,
  hasOne,
  makeActionFactory,
  makeComposable,
  makeModel,
  makeRegistry,
  makeTransformer,
  Model,
} from '@foscia/core';
import { makeRestDeserializer } from '@foscia/rest';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: makeRestDeserializer', () => {
  (() => {
    const input = [{
      id: '1',
      userName: 'JOHN',
      myPosts: [
        {
          id: '1',
          title: 'Foo',
          body: 'Foo body',
          'pull-only': 'pull',
          author: {
            id: '1',
            userName: 'JOHN',
          },
          comments: [
            {
              id: '1',
              body: 'Foo body',
              'push-only': 'push',
            },
            {
              id: '2',
              body: 'Bar body',
              'push-only': 'push',
            },
          ],
        },
      ],
    }, {
      id: '2',
      userName: 'JANE',
      myPosts: [
        {
          id: '1',
          title: 'Foo',
          body: 'Foo body',
          'pull-only': 'pull',
          author: {
            id: '1',
            userName: 'JOHN',
          },
        },
      ],
    }];

    const expectations = (User: Model, Comment: Model, Post: Model, instances: any) => {
      expect(instances).toHaveLength(2);
      expect(instances[0]).toBeInstanceOf(User);
      expect(instances[0].$exists).toStrictEqual(true);
      expect(instances[0].id).toStrictEqual('1');
      expect(instances[0].username).toStrictEqual('john');
      expect(instances[0].posts).toHaveLength(1);
      expect(instances[0].posts[0]).toBeInstanceOf(Post);
      expect(instances[0].posts[0].$exists).toStrictEqual(true);
      expect(instances[0].posts[0].id).toStrictEqual('1');
      expect(instances[0].posts[0].title).toStrictEqual('Foo');
      expect(instances[0].posts[0].body).toStrictEqual('Foo body');
      expect(instances[0].posts[0].pullOnly).toStrictEqual('pull');
      expect(instances[0].posts[0].comments).toHaveLength(2);
      expect(instances[0].posts[0].comments[0]).toBeInstanceOf(Comment);
      expect(instances[0].posts[0].comments[0].$exists).toStrictEqual(true);
      expect(instances[0].posts[0].comments[0].id).toStrictEqual('1');
      expect(instances[0].posts[0].comments[0].body).toStrictEqual('Foo body');
      expect(instances[0].posts[0].comments[0].pushOnly).toBeUndefined();
      expect(instances[0].posts[0].comments[1]).toBeInstanceOf(Comment);
      expect(instances[0].posts[0].comments[1].$exists).toStrictEqual(true);
      expect(instances[0].posts[0].comments[1].id).toStrictEqual('2');
      expect(instances[0].posts[0].comments[1].body).toStrictEqual('Bar body');
      expect(instances[0].posts[0].comments[1].pushOnly).toBeUndefined();
      expect(instances[0].posts[0].author === instances[0]).toBeTruthy();

      expect(instances[1]).toBeInstanceOf(User);
      expect(instances[1].$exists).toStrictEqual(true);
      expect(instances[1].id).toStrictEqual('2');
      expect(instances[1].username).toStrictEqual('jane');
      expect(instances[1].posts).toHaveLength(1);
      expect(instances[0].posts[0] === instances[1].posts[0]).toBeTruthy();
    };

    (() => {
      let User: Model;
      const authored = makeComposable({
        author: hasOne(() => User),
      });

      const Comment = makeModel('comments', {
        authored,
        body: attr(),
        pushOnly: attr().alias('push-only').sync('push'),
      });

      const Post = makeModel('posts', {
        authored,
        title: attr(),
        body: attr(),
        comments: hasMany(() => Comment),
        pullOnly: attr().alias('pull-only').readOnly().sync('pull'),
      });

      User = makeModel('users', {
        username: attr(makeTransformer(
          (value: string) => value.toLowerCase(),
          (value: string) => value.toUpperCase(),
        )).alias('userName'),
        posts: hasMany(() => Post).alias('myPosts'),
      });

      it.each([
        [{ model: User }],
        [{ model: User, instance: new User() }],
        [{ model: Post, instance: new Post(), relation: Post.$schema.author }],
      ])('should deserialize using various models context and no registry', async (context) => {
        const { deserializer } = makeRestDeserializer();

        const { instances } = await deserializer.deserialize(input, makeActionFactory(context)());

        expectations(User, Comment, Post, instances);
      });
    })();

    (() => {
      const authored = makeComposable({
        author: hasOne('users'),
      });

      const Comment = makeModel('comments', {
        authored,
        body: attr(),
        pushOnly: attr().alias('push-only').sync('push'),
      });

      const Post = makeModel('posts', {
        authored,
        title: attr(),
        body: attr(),
        comments: hasMany('comments'),
        pullOnly: attr().alias('pull-only').readOnly().sync('pull'),
      });

      const User = makeModel('users', {
        username: attr(makeTransformer(
          (value: string) => value.toLowerCase(),
          (value: string) => value.toUpperCase(),
        )).alias('userName'),
        posts: hasMany('posts').alias('myPosts'),
      });

      const { registry } = makeRegistry([User, Post, Comment]);

      it.each([
        [{ registry, model: User }],
        [{ registry, model: User, instance: new User() }],
        [{ registry, model: Post, instance: new Post(), relation: Post.$schema.author }],
      ])('should deserialize using various models context and registry', async (context) => {
        const { deserializer } = makeRestDeserializer();

        const { instances } = await deserializer.deserialize(input, makeActionFactory(context)());

        expectations(User, Comment, Post, instances);
      });
    })();
  })();

  it('should fail when no model found using context only', async () => {
    const { deserializer } = makeRestDeserializer();

    await expect(
      deserializer.deserialize({ id: '1' }, makeActionFactory({})()),
    ).rejects.toThrow(
      /Could not resolve model for type `undefined`/,
    );
  });

  it('should fail when no model found using context and type', async () => {
    const { deserializer } = makeRestDeserializer();

    await expect(
      deserializer.deserialize({ id: '1', type: 'categories' }, makeActionFactory({})()),
    ).rejects.toThrow(
      /Could not resolve model for type `categories`/,
    );
  });

  it('should fail when model found but not matching', async () => {
    const model = makeModel('comments');

    const { deserializer } = makeRestDeserializer();

    await expect(
      deserializer.deserialize({ id: '1', type: 'categories' }, makeActionFactory({ model })()),
    ).rejects.toThrow(
      /Could not resolve model for type `categories`/,
    );
  });

  it('should deserialize unique records only once', async () => {
    const User = makeModel('users', {
      name: attr(),
    });
    const Post = makeModel('posts', {
      author: hasOne(() => User),
    });

    const { deserializer } = makeRestDeserializer();
    const { instances } = await deserializer.deserialize([
      {
        id: '1',
        type: 'posts',
        author: {
          id: '3',
          type: 'users',
        },
      },
      {
        id: '2',
        type: 'posts',
        author: {
          id: '3',
          type: 'users',
        },
      },
    ], makeActionFactory({ model: Post })());

    expect(instances).toHaveLength(2);
    expect(instances[0]).toBeInstanceOf(Post);
    expect(instances[0].author).toBeInstanceOf(User);
    expect(instances[1]).toBeInstanceOf(Post);
    expect(instances[1].author).toBeInstanceOf(User);
    expect(instances[0] !== instances[1]).toBeTruthy();
    expect(instances[0].author === instances[1].author).toBeTruthy();
  });

  it('should deserialize related relations and check for filled instances', async () => {
    const User = makeModel('users', {
      name: attr(),
    });
    const Post = makeModel('posts', {
      author: hasOne(() => User),
    });

    const { deserializer } = makeRestDeserializer();
    const { instances } = await deserializer.deserialize([
      {
        id: '1',
        type: 'posts',
        author: {
          id: '3',
          type: 'users',
          name: 'John',
        },
      },
      {
        id: '2',
        type: 'posts',
        author: '4',
      },
    ], makeActionFactory({ model: Post })());

    expect(instances).toHaveLength(2);
    expect(instances[0]).toBeInstanceOf(Post);
    expect(instances[0].author).toBeInstanceOf(User);
    expect(filled(instances[0].author)).toBeTruthy();
    expect(instances[1]).toBeInstanceOf(Post);
    expect(instances[1].author).toBeInstanceOf(User);
    expect(filled(instances[1].author)).toBeFalsy();
  });

  it('should deserialize creating instance', async () => {
    const Post = makeModel('posts');
    const post = new Post();

    const { deserializer } = makeRestDeserializer();
    const { instances } = await deserializer.deserialize({
      id: '1',
      type: 'posts',
    }, makeActionFactory({ model: Post, instance: post, actionKind: 'create' })());

    expect(instances).toHaveLength(1);
    expect(instances[0]).toBeInstanceOf(Post);
    expect(instances[0] === post).toBeTruthy();
  });

  it('should deserialize updating instance', async () => {
    const Post = makeModel('posts');
    const post = fill(new Post(), { id: '1' });

    const { deserializer } = makeRestDeserializer();
    const { instances } = await deserializer.deserialize({
      id: '1',
      type: 'posts',
    }, makeActionFactory({ model: Post, instance: post, actionKind: 'update' })());

    expect(instances).toHaveLength(1);
    expect(instances[0]).toBeInstanceOf(Post);
    expect(instances[0] === post).toBeTruthy();
  });
});
