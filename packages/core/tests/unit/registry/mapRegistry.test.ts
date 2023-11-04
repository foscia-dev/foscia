import { makeModel, MapRegistry } from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: mapRegistry', () => {
  it('should register and resolve models', async () => {
    const modelFoo = makeModel('foo');
    const modelBar = makeModel('bar');
    const modelBaz = makeModel('baz');
    const modelFooBar = makeModel('foo-bar');

    const registry = new MapRegistry();

    expect(await registry.modelFor('foo')).toBeNull();
    expect(await registry.modelFor('bar')).toBeNull();
    expect(await registry.modelFor('baz')).toBeNull();
    expect(await registry.modelFor('foo-bar')).toBeNull();

    registry.register([modelFoo, modelBar]);

    expect(await registry.modelFor('foo')).toBe(modelFoo);
    expect(await registry.modelFor('bar')).toBe(modelBar);
    expect(await registry.modelFor('baz')).toBeNull();
    expect(await registry.modelFor('foo-bar')).toBeNull();

    registry.register([{ resolve: () => modelBaz }]);

    expect(await registry.modelFor('foo')).toBe(modelFoo);
    expect(await registry.modelFor('bar')).toBe(modelBar);
    expect(await registry.modelFor('baz')).toBe(modelBaz);
    expect(await registry.modelFor('foo-bar')).toBeNull();

    registry.register({ 'foo-bar': async () => modelFooBar });

    expect(await registry.modelFor('foo')).toBe(modelFoo);
    expect(await registry.modelFor('bar')).toBe(modelBar);
    expect(await registry.modelFor('baz')).toBe(modelBaz);
    expect(await registry.modelFor('foo-bar')).toBe(modelFooBar);
  });

  it('should normalize types', async () => {
    const modelFooBar = makeModel('foo-bar');

    const registry = new MapRegistry({ normalizeType: (t) => t.toUpperCase() });
    registry.register({ 'foo-bar': async () => modelFooBar });

    const resolvedModel = await registry.modelFor('foo-bar');
    expect(resolvedModel).toBe(modelFooBar);
    expect(await registry.modelFor('FOO-BAR')).toBe(modelFooBar);
  });
});
