import { makeWeakRefManager } from '@foscia/core';
import { describe, expect, it } from 'vitest';
import PostMock from '../../mocks/models/post.mock';

describe.concurrent('unit: makeWeakRefManager', () => {
  it('should use a weak ref instance', async () => {
    const post = new PostMock();

    const manager = makeWeakRefManager();
    const ref = await manager.ref(post);

    expect(ref).toBeInstanceOf(WeakRef);
    expect(manager.value(ref)).toBe(post);
  });
});
