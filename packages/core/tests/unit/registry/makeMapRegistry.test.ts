import { makeMapRegistry, makeModel } from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: makeMapRegistry', () => {
  it('should register and resolve models', async () => {
    const modelFoo = makeModel('foo');
    const modelBar = makeModel('bar');

    const { registry } = makeMapRegistry({
      models: [modelFoo, modelBar],
    });

    expect(await registry.modelFor('foo')).toBe(modelFoo);
    expect(await registry.modelFor('bar')).toBe(modelBar);
  });

  it('should normalize types', async () => {
    const modelFooBar = makeModel('foo-bar');

    const { registry } = makeMapRegistry({
      models: [modelFooBar],
      normalizeType: (t) => t.toUpperCase(),
    });

    expect(await registry.modelFor('foo-bar')).toBe(modelFooBar);
    expect(await registry.modelFor('FOO-BAR')).toBe(modelFooBar);
  });
});
