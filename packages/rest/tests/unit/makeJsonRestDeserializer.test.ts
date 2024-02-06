import {
  attr,
  hasMany,
  hasOne,
  makeComposable,
  makeModel,
  makeRegistry,
  makeTransformer,
  Model,
} from '@foscia/core';
import { makeJsonRestDeserializer } from '@foscia/rest';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: makeJsonRestSerializer', () => {
  (() => {
    const input = [{
      id: '1',
      userName: 'JOHN',
      myPosts: [
        {
          id: '1',
          title: 'Foo',
          body: 'Foo body',
          pullOnly: 'pull',
          author: {
            id: '1',
            userName: 'JOHN',
          },
          comments: [
            {
              id: '1',
              body: 'Foo body',
              pushOnly: 'push',
            },
            {
              id: '2',
              body: 'Bar body',
              pushOnly: 'push',
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
          pullOnly: 'pull',
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
      expect(instances[0].posts[0].comments[0].pullOnly).toBeUndefined();
      expect(instances[0].posts[0].comments[1]).toBeInstanceOf(Comment);
      expect(instances[0].posts[0].comments[1].$exists).toStrictEqual(true);
      expect(instances[0].posts[0].comments[1].id).toStrictEqual('2');
      expect(instances[0].posts[0].comments[1].body).toStrictEqual('Bar body');
      expect(instances[0].posts[0].comments[1].pullOnly).toBeUndefined();
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
        pushOnly: attr().sync('push'),
      });

      const Post = makeModel('posts', {
        authored,
        title: attr(),
        body: attr(),
        comments: hasMany(() => Comment),
        pullOnly: attr().readOnly().sync('pull'),
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
        const { deserializer } = makeJsonRestDeserializer();

        const { instances } = await deserializer.deserialize(input, context);

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

      const { registry } = makeRegistry([User, Post, Comment]);

      it.each([
        [{ registry, model: User }],
        [{ registry, model: User, instance: new User() }],
        [{ registry, model: Post, instance: new Post(), relation: Post.$schema.author }],
      ])('should deserialize using various models context and registry', async (context) => {
        const { deserializer } = makeJsonRestDeserializer();

        const { instances } = await deserializer.deserialize(input, context);

        expectations(User, Comment, Post, instances);
      });
    })();
  })();
});
