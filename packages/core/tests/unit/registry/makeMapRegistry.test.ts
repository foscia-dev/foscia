/* eslint-disable max-classes-per-file */
import { makeMapRegistry, makeModel } from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: makeMapRegistry', () => {
  it('should resolve models', async () => {
    class PostV1 extends makeModel('v1:posts') {
    }
    class PostV2 extends makeModel('v2:posts') {
    }
    class Comment extends makeModel('comments') {
    }

    const { registry } = makeMapRegistry({
      models: [PostV1, PostV2, Comment] as const,
    });

    expect(await registry.resolve('default:comments')).toBe(Comment);
    expect(await registry.resolve('v1:posts')).toBe(PostV1);
    expect(await registry.resolve('v2:posts')).toBe(PostV2);
    expect(await registry.resolve('v1:comments')).toBeNull();
    expect(await registry.resolve('default:posts')).toBeNull();
    expect(await registry.resolve('default:posts')).toBeNull();
  });

  it('should normalize types', async () => {
    const modelFooBar = makeModel('foo-bar');

    const { registry } = makeMapRegistry({
      models: [modelFooBar],
      normalizeType: (t) => t.toUpperCase(),
    });

    expect(await registry.resolve('default:foo-bar')).toBe(modelFooBar);
    expect(await registry.resolve('default:FOO-BAR')).toBe(modelFooBar);
  });
});
