import { fill, makeModel, query } from '@foscia/core';
import { describe, expect, it } from 'vitest';
import PostMock from '../../../../mocks/models/post.mock';
import evaluateContext from '../../../../utils/evaluateContext';

describe.concurrent('unit: query', () => {
  it('should query model without ID', async () => {
    const Model = makeModel('BlogPosts');

    expect(await evaluateContext(query(Model))).toMatchObject({
      model: Model,
      id: undefined,
    });
  });

  it('should query model with ID', async () => {
    const Model = makeModel('BlogPosts');

    expect(await evaluateContext(query(Model, '123'))).toMatchObject({
      model: Model,
      id: '123',
    });
  });

  it('should query instance without ID', async () => {
    const post = new PostMock();

    expect(await evaluateContext(query(post))).toMatchObject({
      model: PostMock,
      instance: post,
      id: undefined,
      relation: undefined,
    });

    post.$exists = true;

    expect(await evaluateContext(query(post))).toMatchObject({
      model: PostMock,
      instance: post,
      id: undefined,
      relation: undefined,
    });
  });

  it('should query instance with ID', async () => {
    const post = fill(new PostMock(), { id: '123' });

    expect(await evaluateContext(query(post))).toMatchObject({
      model: PostMock,
      instance: post,
      id: undefined,
      relation: undefined,
    });

    post.$exists = true;

    expect(await evaluateContext(query(post))).toMatchObject({
      model: PostMock,
      instance: post,
      id: '123',
      relation: undefined,
    });
  });

  it('should query instance relation', async () => {
    const post = fill(new PostMock(), { id: '123' });

    post.$exists = true;

    expect(await evaluateContext(query(post, 'comments'))).toMatchObject({
      model: PostMock,
      instance: undefined,
      id: '123',
      relation: PostMock.$schema.comments,
    });
  });
});
