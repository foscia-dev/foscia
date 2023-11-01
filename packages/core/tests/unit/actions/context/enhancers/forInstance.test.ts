import { fill, forInstance } from '@foscia/core';
import { describe, expect, it } from 'vitest';
import PostMock from '../../../../mocks/models/post.mock';
import evaluateContext from '../../../../utils/evaluateContext';

describe.concurrent('unit: forInstance', () => {
  it('should use instance without id', async () => {
    const post = new PostMock();

    expect(await evaluateContext(forInstance(post))).toStrictEqual({
      model: PostMock,
      instance: post,
      id: undefined,
    });
  });

  it('should use instance with id', async () => {
    const post = fill(new PostMock(), { id: 1 });

    expect(await evaluateContext(forInstance(post))).toStrictEqual({
      model: PostMock,
      instance: post,
      id: 1,
    });
  });
});
