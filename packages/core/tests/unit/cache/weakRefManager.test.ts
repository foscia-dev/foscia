import { weakRefManager } from '@foscia/core';
import { describe, expect, it } from 'vitest';
import PostMock from '../../mocks/models/post.mock';

describe.concurrent('unit: weakRefCacheMode', () => {
  it('should use a weak ref instance', async () => {
    const post = new PostMock();

    const ref = await weakRefManager.ref(post);

    expect(ref).toBeInstanceOf(WeakRef);
    expect(weakRefManager.value(ref)).toBe(post);
  });
});
