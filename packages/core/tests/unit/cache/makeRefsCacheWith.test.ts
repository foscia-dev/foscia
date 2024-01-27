import { makeRefsCacheWith, weakRefManager } from '@foscia/core';
import { describe, expect, it, vi } from 'vitest';
import CommentMock from '../../mocks/models/comment.mock';
import PostMock from '../../mocks/models/post.mock';

describe.concurrent('unit: makeRefsCacheWith', () => {
  it('should put, find and remove from cache', async () => {
    const firstPost = new PostMock();
    const secondPost = new PostMock();
    const comment = new CommentMock();

    const cache = makeRefsCacheWith({ manager: weakRefManager });

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
    const post = new PostMock();
    const refManager = {
      ref: vi.fn().mockImplementation(() => post),
      value: vi.fn(),
    };

    const cache = makeRefsCacheWith({ manager: refManager });

    expect(await cache.find('posts', '1')).toBeNull();
    expect(refManager.value).not.toHaveBeenCalled();

    refManager.value.mockImplementation(() => post);
    await cache.put('posts', '1', post);

    expect(await cache.find('posts', '1')).toBe(post);
    expect(refManager.value).toHaveBeenCalledOnce();

    refManager.value.mockImplementation(() => undefined);

    expect(await cache.find('posts', '1')).toBeNull();
    expect(refManager.value).toHaveBeenCalledTimes(2);
  });
});
