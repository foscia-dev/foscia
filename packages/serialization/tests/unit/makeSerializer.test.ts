import { fill, hasMany, hasOne, makeModelFactory, takeSnapshot } from '@foscia/core';
import { makeSerializer, makeSerializerRecordFactory } from '@foscia/serialization';
import { Dictionary } from '@foscia/shared';
import { describe, expect, it } from 'vitest';

describe('unit: makeSerializer', () => {
  it.concurrent('should support circular relations', async () => {
    const makeModel = makeModelFactory({
      limitedSnapshots: false,
    });

    const PostMock = makeModel({
      type: 'posts',
      limitedSnapshots: false,
    }, {
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

    const { serializer: deepSerializer } = makeSerializer({
      createRecord: makeSerializerRecordFactory(
        (snapshot) => ({ id: snapshot.$values.id } as Dictionary),
        (record, { key, value }) => {
          // eslint-disable-next-line no-param-reassign
          record[key] = value;
        },
      ),
      serializeRelation: ({ serializer, context }, related, parents) => serializer
        .serializeToRecords(related, context, parents),
    });

    await expect(
      deepSerializer.serializeToRecords(takeSnapshot(post), {}),
    ).resolves.toStrictEqual({
      id: 1,
      comments: [{ id: 2, author: { id: 3 } }],
    });
  });
});
