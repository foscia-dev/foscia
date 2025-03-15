import { context, hasMany, makeModel, raw } from '@foscia/core';
import { makeGet } from '@foscia/http';
import { describe, expect, it } from 'vitest';
import createFetchMock from '../../../../tests/mocks/createFetchMock.mock';
import createFetchResponse from '../../../../tests/mocks/createFetchResponse.mock';
import makeHttpActionMock from '../mocks/makeHttpAction.mock';

describe('integration: HTTP', () => {
  const PostMock = makeModel('posts', {
    comments: hasMany('comments'),
  });

  it('should run fetch: slash path', async () => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementationOnce(createFetchResponse().noContent());

    const action = makeHttpActionMock();

    // On Node, "/" request will fail, but this is accepted on a browser
    // and should remain unchanged.
    await expect(action().use(makeGet('/')).run(raw())).rejects.toThrow('Failed to parse URL from /');
  });

  it.each([
    [{}, '', 'https://example.com/'],
    [{}, 'https://foo.com', 'https://foo.com/'],
    [{}, 'api', 'https://example.com/api'],
    [{}, 'api/something', 'https://example.com/api/something'],
    [{}, 'api//something', 'https://example.com/api/something'],
    [{ model: PostMock }, '', 'https://example.com/posts'],
    [{ model: PostMock }, 'something', 'https://example.com/posts/something'],
    [{ model: PostMock, id: '1' }, '', 'https://example.com/posts/1'],
    [{ model: PostMock, id: '1' }, 'something', 'https://example.com/posts/1/something'],
    [{ model: PostMock, id: '1', relation: PostMock.$schema.comments }, '', 'https://example.com/posts/1/comments'],
    [{ model: PostMock, id: '1', relation: PostMock.$schema.comments }, 'something', 'https://example.com/posts/1/comments/something'],
  ])('should run fetch: with path and context', async (ctx: {}, path: string, url: string) => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementationOnce(createFetchResponse().noContent());

    const action = makeHttpActionMock();

    await action()
      .use(context(ctx))
      .use(makeGet(path))
      .run(raw());

    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toStrictEqual(url);
  });
});
