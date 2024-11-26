import { makeTimeoutRefManager } from '@foscia/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PostMock from '../../mocks/models/post.mock';

describe.concurrent('unit: makeTimeoutRefManager', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should use a timeout ref instance', async () => {
    const post = new PostMock();

    const manager = makeTimeoutRefManager({ timeout: 1000 });
    const ref = await manager.ref(post);

    expect(manager.value(ref)).toBe(post);

    vi.advanceTimersByTime(500);
    expect(manager.value(ref)).toBe(post);

    // Value reset timers.
    vi.advanceTimersByTime(750);
    expect(manager.value(ref)).toBe(post);

    vi.advanceTimersByTime(1100);
    expect(manager.value(ref)).toBe(undefined);
  });
});
