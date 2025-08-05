import { makeModel, makeRefsCache, makeWeakRefFactory } from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: makeRefsCache', () => {
  const model = makeModel();

  @model()
  class Post extends model.base() {
  }

  @model()
  class Comment extends model.base() {
  }

  it('should support get, set and delete', async () => {
    const postA = new Post();
    const postB = new Post();
    const comment = new Comment();

    const cache = makeRefsCache({ makeRef: makeWeakRefFactory() });

    expect(await cache.get(Post, '1')).toBeUndefined();
    expect(await cache.get(Post, '2')).toBeUndefined();
    expect(await cache.get(Post, '3')).toBeUndefined();

    await cache.set(Post, '1', postA);
    await cache.set(Post, '2', postB);
    await cache.set(Comment, '1', comment);
    expect(await cache.get(Post, '1')).toBe(postA);
    expect(await cache.get(Post, '2')).toBe(postB);
    expect(await cache.get(Post, '3')).toBeUndefined();
    expect(await cache.get(Comment, '1')).toBe(comment);

    await cache.delete(Post, '1');
    expect(await cache.get(Post, '1')).toBeUndefined();
    expect(await cache.get(Post, '2')).toBe(postB);
    expect(await cache.get(Comment, '1')).toBe(comment);
  });

  it('should support multiple primary keys', async () => {
    const post = new Post();

    const cache = makeRefsCache({ makeRef: makeWeakRefFactory() });

    expect(await cache.get(Post, { foo: '1', bar: '2' })).toBeUndefined();

    await cache.set(Post, { foo: '1', bar: '2' }, post);
    expect(await cache.get(Post, { foo: '1', bar: '2' })).toBe(post);
    expect(await cache.get(Post, { bar: '2', foo: '1' })).toBe(post);
  });

  it('should support expired reference', async () => {
    let post: Post | null = new Post();
    const fakeRef = () => () => post as any;
    const cache = makeRefsCache({ makeRef: fakeRef });

    expect(await cache.get(Post, '1')).toBeUndefined();

    await cache.set(Post, '1', post);
    expect(await cache.get(Post, '1')).toBe(post);

    post = null;
    expect(await cache.get(Post, '1')).toBeUndefined();
  });
});
