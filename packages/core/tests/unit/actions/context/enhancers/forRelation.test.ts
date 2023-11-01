import { forRelation, hasMany, makeModel } from '@foscia/core';
import { describe, expect, it } from 'vitest';
import evaluateContext from '../../../../utils/evaluateContext';

describe.concurrent('unit: forRelation', () => {
  it('should use instance', async () => {
    const Model = makeModel('blog-posts', {
      latestComments: hasMany(),
    });
    const model = new Model();

    expect(await evaluateContext(forRelation(model, 'latestComments'))).toStrictEqual({
      model: Model,
      instance: model,
      id: undefined,
      relation: Model.$schema.latestComments,
    });
  });
});
