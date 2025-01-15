import { makeRefsCache, makeWeakRefFactory } from '@foscia/core';
import { describe, expect, it } from 'vitest';
import CommentMock from '../../mocks/models/comment.mock';
import PostMock from '../../mocks/models/post.mock';

describe.concurrent('unit: makeRefsCache', () => {
  it('should put, find and remove from cache', async () => {
    const firstPost = new PostMock();
    const secondPost = new PostMock();
    const comment = new CommentMock();

    const { cache } = makeRefsCache({ makeRef: makeWeakRefFactory() });

    expect(await cache.find('posts', '1')).toBeNull();
    expect(await cache.find('posts', '2')).toBeNull();
    expect(await cache.find('posts', '3')).toBeNull();
    expect(await cache.find('dummy', '1')).toBeNull();

    await cache.put('posts', '1', firstPost);
    await cache.put('posts', '2', secondPost);
    await cache.put('comments', '1', comment);

    expect(await cache.find('posts', '1')).toBe(firstPost);
    expect(await cache.find('posts', '2')).toBe(secondPost);
    expect(await cache.find('posts', '3')).toBeNull();
    expect(await cache.find('comments', '1')).toBe(comment);
    expect(await cache.find('dummy', '1')).toBeNull();

    await cache.forget('posts', '1');

    expect(await cache.find('posts', '1')).toBeNull();
    expect(await cache.find('posts', '2')).toBe(secondPost);
    expect(await cache.find('comments', '1')).toBe(comment);

    await cache.put('posts', '1', firstPost);

    expect(await cache.find('posts', '1')).toBe(firstPost);
    expect(await cache.find('posts', '2')).toBe(secondPost);
    expect(await cache.find('comments', '1')).toBe(comment);

    await cache.forgetAll('posts');

    expect(await cache.find('posts', '1')).toBeNull();
    expect(await cache.find('posts', '2')).toBeNull();
    expect(await cache.find('comments', '1')).toBe(comment);

    await cache.put('posts', '1', firstPost);

    expect(await cache.find('posts', '1')).toBe(firstPost);
    expect(await cache.find('posts', '2')).toBeNull();
    expect(await cache.find('comments', '1')).toBe(comment);

    await cache.clear();

    expect(await cache.find('posts', '1')).toBeNull();
    expect(await cache.find('posts', '2')).toBeNull();
    expect(await cache.find('comments', '1')).toBeNull();
  });

  it('should forget if ref has expired', async () => {
    let post: PostMock | null = new PostMock();
    const fakeRef = () => () => post as any;

    const { cache } = makeRefsCache({ makeRef: fakeRef });

    expect(await cache.find('posts', '1')).toBeNull();
    await cache.put('posts', '1', post);
    expect(await cache.find('posts', '1')).toBe(post);
    post = null;
    expect(await cache.find('posts', '1')).toBeNull();
  });
});
