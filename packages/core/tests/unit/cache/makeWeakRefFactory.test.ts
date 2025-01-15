import { makeWeakRefFactory } from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe('unit: makeWeakRefFactory', () => {
  it('should make a weak ref', async () => {
    const value = {};

    const factory = makeWeakRefFactory();
    const ref = factory(value);

    expect(ref()).toBe(value);
  });
});
