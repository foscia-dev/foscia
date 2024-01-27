import { fill, hasMany, hasOne, makeModel } from '@foscia/core';
import { makeSerializerRecordFactory, makeSerializerWith } from '@foscia/serialization';
import { Dictionary } from '@foscia/shared';
import { describe, expect, it } from 'vitest';

describe('unit: makeSerializerWith', () => {
  it.concurrent('should support circular relations', async () => {
    const PostMock = makeModel('posts', {
      comments: hasMany(),
    });
    const CommentMock = makeModel('comments', {
      author: hasOne(),
    });
    const UserMock = makeModel('users', {
      posts: hasMany(),
    });

    const post = new PostMock();
    const comment = new CommentMock();
    const user = new UserMock();

    fill(post, { id: 1, comments: [comment] });
    fill(comment, { id: 2, author: user });
    fill(user, { id: 3, posts: [post] });

    const deepSerializer = makeSerializerWith({
      createRecord: makeSerializerRecordFactory(
        (instance) => ({ id: instance.id } as Dictionary),
        (record, { key, value }) => {
          // eslint-disable-next-line no-param-reassign
          record[key] = value;
        },
      ),
      serializeRelated: ({ serializer, context }, related, parents) => serializer.serializeInstance(
        related,
        context,
        parents,
      ),
    });

    await expect(
      deepSerializer.serializeInstance(post, {}),
    ).resolves.toStrictEqual({
      id: 1,
      comments: [{ id: 2, author: { id: 3 } }],
    });
  });
});
