import { makeTimedRefFactory } from '@foscia/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('unit: makeTimedRefFactory', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should make a timed ref with default configuration', async () => {
    const factory = makeTimedRefFactory();
    const ref = factory(42);

    expect(ref()).toBe(42);

    vi.advanceTimersByTime(4 * 60 * 1000);
    expect(ref()).toBe(42);

    vi.advanceTimersByTime(4 * 60 * 1000);
    expect(ref()).toBe(42);

    vi.advanceTimersByTime(6 * 60 * 1000);
    expect(ref()).toBe(null);
  });

  it('should make a timed ref with custom configuration', async () => {
    const factory = makeTimedRefFactory({ lifetime: 10 * 60, postpone: false });
    const ref = factory(42);

    expect(ref()).toBe(42);

    vi.advanceTimersByTime(9 * 60 * 1000);
    expect(ref()).toBe(42);

    vi.advanceTimersByTime(2 * 60 * 1000);
    expect(ref()).toBe(null);
  });
});
