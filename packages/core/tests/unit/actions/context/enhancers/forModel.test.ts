import { makeModel } from '@foscia/core';
import { forModel } from '@foscia/core/actions';
import { describe, expect, it } from 'vitest';
import evaluateContext from '../../../../utils/evaluateContext';

describe.concurrent('unit: forModel', () => {
  it('should use model', async () => {
    const Model = makeModel('BlogPosts');

    expect(await evaluateContext(forModel(Model))).toStrictEqual({
      model: Model,
    });
  });
});
