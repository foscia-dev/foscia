/* eslint-disable max-classes-per-file */
import {
  Action,
  hasMany,
  hasOne,
  makeActionFactory,
  makeComposable,
  makeModel,
  makeRegistry,
  Model,
  parseRawInclude,
  toParsedRawInclude,
} from '@foscia/core';
import { Dictionary } from '@foscia/shared';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: parseRawInclude', () => {
  const callback = () => {
  };

  it('should handle unresolved relations', async () => {
    class User extends makeModel('users', {
      dummy: hasOne('dummy'),
      avatar: hasOne('files'),
    }) {
    }

    class Comment extends makeModel('comments', {
      author: hasOne('users'),
    }) {
    }

    class Post extends makeModel('posts', {
      dummy: hasMany('dummy'),
      author: hasOne('users'),
      comments: hasMany('comments'),
    }) {
    }

    const action = makeActionFactory({
      ...makeRegistry([User, Comment, Post]),
    })();

    await expect(() => parseRawInclude(action, [], [toParsedRawInclude('author')]))
      .rejects.toThrow('[foscia] Could not include relation `author`: no related models resolved.');
    await expect(() => parseRawInclude(action, [Post], [toParsedRawInclude('dummy')]))
      .rejects.toThrow('[foscia] Could not include relation `dummy`: no related models resolved.');
    await expect(() => parseRawInclude(action, [Post], [toParsedRawInclude('author.dummy')]))
      .rejects.toThrow('[foscia] Could not include relation `dummy`: no related models resolved.');
    await expect(() => parseRawInclude(action, [Post], [toParsedRawInclude('author.dummy.something')]))
      .rejects.toThrow('[foscia] Could not include relation `dummy`: no related models resolved.');
    await expect(() => parseRawInclude(action, [Post], [toParsedRawInclude('author.avatar')]))
      .rejects.toThrow('[foscia] Could not include relation `avatar`: no related models resolved.');
    await expect(() => parseRawInclude(action, [Post], [toParsedRawInclude('comments.author.avatar')]))
      .rejects.toThrow('[foscia] Could not include relation `avatar`: no related models resolved.');
  });

  it('should handle with or without queries and includes', async () => {
    class User extends makeModel('users', {}) {
    }

    class Comment extends makeModel('comments', {
      author: hasOne(() => User),
    }) {
    }

    class Post extends makeModel('posts', {
      comments: hasMany(() => Comment, {
        include: 'author',
        query: callback,
      }),
    }) {
    }

    const action = makeActionFactory()();

    expect(await parseRawInclude(action, [Post], [
      toParsedRawInclude('comments'),
    ])).toStrictEqual(new Map([
      [Post.$schema.comments, {
        requested: true,
        customQuery: null,
        relationQuery: callback,
        models: [Comment],
        include: new Map([
          [Comment.$schema.author, {
            requested: true,
            customQuery: null,
            relationQuery: null,
            models: [User],
            include: new Map(),
          }],
        ]),
      }],
    ]));

    expect(await parseRawInclude(action, [Post], [
      toParsedRawInclude('comments', { withoutInclude: false, withoutQuery: false }),
    ])).toStrictEqual(new Map([
      [Post.$schema.comments, {
        requested: true,
        customQuery: null,
        relationQuery: callback,
        models: [Comment],
        include: new Map([
          [Comment.$schema.author, {
            requested: true,
            customQuery: null,
            relationQuery: null,
            models: [User],
            include: new Map(),
          }],
        ]),
      }],
    ]));

    expect(await parseRawInclude(action, [Post], [
      toParsedRawInclude('comments', { withoutInclude: true, withoutQuery: false }),
    ])).toStrictEqual(new Map([
      [Post.$schema.comments, {
        requested: true,
        customQuery: null,
        relationQuery: callback,
        models: [Comment],
        include: new Map(),
      }],
    ]));

    expect(await parseRawInclude(action, [Post], [
      toParsedRawInclude('comments', { withoutInclude: false, withoutQuery: true }),
    ])).toStrictEqual(new Map([
      [Post.$schema.comments, {
        requested: true,
        customQuery: null,
        relationQuery: null,
        models: [Comment],
        include: new Map([
          [Comment.$schema.author, {
            requested: true,
            customQuery: null,
            relationQuery: null,
            models: [User],
            include: new Map(),
          }],
        ]),
      }],
    ]));
  });

  const shouldParseForModels = async (
    { File, User, Comment, Post, Tag }: Dictionary<Model>,
    action: Action,
  ) => ([
    [[
      [[Post], [await parseRawInclude(action, [Post], [toParsedRawInclude('author')])]],
    ], [
      [Post.$schema.author, {
        requested: true,
        customQuery: null,
        relationQuery: null,
        models: [User],
        include: new Map(),
      }],
    ]],
    [[
      [[Post], [toParsedRawInclude('author')]],
      [[Post], [toParsedRawInclude(['author'])]],
      [[Post], [toParsedRawInclude({ author: null })]],
    ], [
      [Post.$schema.author, {
        requested: true,
        customQuery: null,
        relationQuery: null,
        models: [User],
        include: new Map(),
      }],
    ]],
    [[
      [[Post, Comment], [toParsedRawInclude('author')]],
      [[Post, Comment], [toParsedRawInclude(['author'])]],
      [[Post, Comment], [toParsedRawInclude({ author: null })]],
    ], [
      [Post.$schema.author, {
        requested: true,
        customQuery: null,
        relationQuery: null,
        models: [User],
        include: new Map(),
      }],
      [Comment.$schema.author, {
        requested: true,
        customQuery: null,
        relationQuery: null,
        models: [User],
        include: new Map(),
      }],
    ]],
    [[
      [[Post, Comment], [toParsedRawInclude('images')]],
      [[Post, Comment], [toParsedRawInclude(['images'])]],
      [[Post, Comment], [toParsedRawInclude({ images: null })]],
    ], [
      [Post.$schema.images, {
        requested: true,
        customQuery: null,
        relationQuery: null,
        models: [File],
        include: new Map(),
      }],
      [Comment.$schema.images, {
        requested: true,
        customQuery: null,
        relationQuery: null,
        models: [File],
        include: new Map(),
      }],
    ]],
    [[
      [[Tag], [toParsedRawInclude('taggables')]],
      [[Tag], [toParsedRawInclude(['taggables'])]],
      [[Tag], [toParsedRawInclude({ taggables: null })]],
    ], [
      [Tag.$schema.taggables, {
        requested: true,
        customQuery: null,
        relationQuery: null,
        models: [Comment, Post],
        include: new Map(),
      }],
    ]],
    [[
      [[Post], [toParsedRawInclude(['comments.author', 'author'])]],
      [[Post], [toParsedRawInclude({ 'comments.author': null, author: null })]],
    ], [
      [Post.$schema.comments, {
        requested: false,
        customQuery: null,
        relationQuery: null,
        models: [Comment],
        include: new Map([
          [Comment.$schema.author, {
            requested: true,
            customQuery: null,
            relationQuery: null,
            models: [User],
            include: new Map(),
          }],
        ]),
      }],
      [Post.$schema.author, {
        requested: true,
        customQuery: null,
        relationQuery: null,
        models: [User],
        include: new Map(),
      }],
    ]],
    [[
      [[Post], [toParsedRawInclude(['comments.author', 'author', ['files', callback]])]],
      [[Post], [toParsedRawInclude({ 'comments.author': null, author: null, files: callback })]],
    ], [
      [Post.$schema.comments, {
        requested: false,
        customQuery: null,
        relationQuery: null,
        models: [Comment],
        include: new Map([
          [Comment.$schema.author, {
            requested: true,
            customQuery: null,
            relationQuery: null,
            models: [User],
            include: new Map(),
          }],
        ]),
      }],
      [Post.$schema.author, {
        requested: true,
        customQuery: null,
        relationQuery: null,
        models: [User],
        include: new Map(),
      }],
      [Post.$schema.files, {
        requested: true,
        customQuery: callback,
        relationQuery: null,
        models: [File],
        include: new Map(),
      }],
    ]],
    [[
      [[Post, Comment], [toParsedRawInclude(['author', ['files', callback]])]],
      [[Post, Comment], [toParsedRawInclude({ author: null, files: callback })]],
    ], [
      [Comment.$schema.author, {
        requested: true,
        customQuery: null,
        relationQuery: null,
        models: [User],
        include: new Map(),
      }],
      [Post.$schema.author, {
        requested: true,
        customQuery: null,
        relationQuery: null,
        models: [User],
        include: new Map(),
      }],
      [Post.$schema.files, {
        requested: true,
        customQuery: callback,
        relationQuery: null,
        models: [File],
        include: new Map(),
      }],
      [Comment.$schema.files, {
        requested: true,
        customQuery: callback,
        relationQuery: null,
        models: [File],
        include: new Map(),
      }],
    ]],
    [[
      [
        [Post],
        [
          toParsedRawInclude(['comments', ['author.images', callback]]),
          await parseRawInclude(action, [Post], [
            toParsedRawInclude(['comments.author', 'author', ['files', callback]]),
          ]),
        ],
      ],
      [
        [Post],
        [
          toParsedRawInclude({ comments: null, 'author.images': callback }),
          await parseRawInclude(action, [Post], [
            toParsedRawInclude(['comments.author', 'author', ['files', callback]]),
          ]),
        ],
      ],
    ], [
      [Post.$schema.comments, {
        requested: true,
        customQuery: null,
        relationQuery: null,
        models: [Comment],
        include: new Map([
          [Comment.$schema.author, {
            requested: true,
            customQuery: null,
            relationQuery: null,
            models: [User],
            include: new Map(),
          }],
        ]),
      }],
      [Post.$schema.author, {
        requested: true,
        customQuery: null,
        relationQuery: null,
        models: [User],
        include: new Map([
          [User.$schema.images, {
            requested: true,
            customQuery: callback,
            relationQuery: null,
            models: [File],
            include: new Map(),
          }],
        ]),
      }],
      [Post.$schema.files, {
        requested: true,
        customQuery: callback,
        relationQuery: null,
        models: [File],
        include: new Map(),
      }],
    ]],
  ] as any as [[any, any][], any[]][]).map(
    ([argsGroups, results]) => Promise.all(argsGroups.map(async (args) => {
      expect(await parseRawInclude(action, ...args)).toStrictEqual(new Map(results));
    })),
  );

  it('should parse include for models with explicit model on relation', async () => {
    class File extends makeModel('files') {
    }

    const imageable = makeComposable({
      images: hasMany(() => File),
    });

    class User extends makeModel('users', {
      imageable,
    }) {
    }

    class Comment extends makeModel('comments', {
      imageable,
      author: hasOne(() => User),
      files: hasMany(() => File),
    }) {
    }

    class Post extends makeModel('posts', {
      imageable,
      author: hasOne(() => User),
      comments: hasMany(() => Comment),
      files: hasMany(() => File),
    }) {
    }

    class Tag extends makeModel('tags', {
      taggables: hasMany(() => [Comment, Post]),
    }) {
    }

    await shouldParseForModels({ File, User, Comment, Post, Tag }, makeActionFactory()());
  });

  it('should parse include for models with explicit type on relation', async () => {
    class File extends makeModel('files') {
    }

    const imageable = makeComposable({
      images: hasMany('files'),
    });

    class User extends makeModel('users', {
      imageable,
    }) {
    }

    class Comment extends makeModel('comments', {
      imageable,
      author: hasOne('users'),
      files: hasMany('files'),
    }) {
    }

    class Post extends makeModel('posts', {
      imageable,
      author: hasOne('users'),
      comments: hasMany('comments'),
      files: hasMany('files'),
    }) {
    }

    class Tag extends makeModel('tags', {
      taggables: hasMany(['comments', 'posts']),
    }) {
    }

    const action = makeActionFactory({
      ...makeRegistry([File, User, Comment, Post, Tag]),
    })();

    await shouldParseForModels({ File, User, Comment, Post, Tag }, action);
  });
});
