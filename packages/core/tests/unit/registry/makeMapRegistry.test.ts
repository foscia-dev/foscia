import { makeMapRegistry, makeModel } from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: makeMapRegistry', () => {
  it('should resolve models', async () => {
    const model = makeModel();

    @model()
    class Comment extends model.base() {
    }

    @model('v1:post')
    class PostV1 extends model.base() {
    }

    @model('v2:post')
    class PostV2 extends model.base() {
    }

    const registry = makeMapRegistry();

    expect(await registry.get('Comment')).toBeUndefined();
    expect(await registry.get('v1:post')).toBeUndefined();
    expect(await registry.get('v2:post')).toBeUndefined();

    await registry.set(Comment);
    await registry.set(PostV1);
    expect(await registry.get('Comment')).toBe(Comment);
    expect(await registry.get('v1:post')).toBe(PostV1);
    expect(await registry.get('v2:post')).toBeUndefined();

    await registry.set(PostV2);
    expect(await registry.get('Comment')).toBe(Comment);
    expect(await registry.get('v1:post')).toBe(PostV1);
    expect(await registry.get('v2:post')).toBe(PostV2);
  });
});
