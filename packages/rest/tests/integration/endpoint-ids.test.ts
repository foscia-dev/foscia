import {
  all,
  attr,
  hasMany,
  makeActionFactory,
  makeModelFactory,
  makeRegistry,
  oneOrFail,
  query,
} from '@foscia/core';
import {
  makeJsonRestAdapter,
  makeJsonRestDeserializer,
  makeJsonRestSerializer,
} from '@foscia/rest';
import { describe, expect, it } from 'vitest';
import createFetchMock from '../../../../tests/mocks/createFetchMock.mock';
import createFetchResponse from '../../../../tests/mocks/createFetchResponse.mock';

describe('integration: endpoint IDs', () => {
  const makeModel = makeModelFactory({
    guessIdPath: (id) => String(id).split('/').pop()!,
  });

  const PostMock = makeModel('posts', {
    title: attr(),
    comments: hasMany(),
  });

  const CommentMock = makeModel('comments', {
    body: attr(),
  });

  const action = makeActionFactory({
    ...makeRegistry([PostMock, CommentMock]),
    ...makeJsonRestDeserializer({
      pullIdentifier: (record) => {
        const [id, type] = String(record.id).split('/').reverse();

        return { id, type };
      },
    }),
    ...makeJsonRestSerializer(),
    ...makeJsonRestAdapter({
      baseURL: 'https://example.com/api',
    }),
  });

  it('should extract type from IDs to resolve model', async () => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementationOnce(createFetchResponse().json([
      {
        id: 'https://example.com/api/posts/1',
        title: 'Foo',
        comments: [
          {
            id: 'https://example.com/api/comments/2',
            body: 'Bar',
          },
          {
            id: 'https://example.com/api/comments/3',
            body: 'Baz',
          },
        ],
      },
    ]));

    const posts = await action()
      .use(query(PostMock))
      .run(all());

    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toStrictEqual('https://example.com/api/posts');
    expect(request.method).toStrictEqual('GET');
    expect(request.headers.get('Accept')).toStrictEqual('application/json');
    expect(request.headers.get('Content-Type')).toStrictEqual('application/json');
    expect(request.body).toBeNull();

    expect(posts).toHaveLength(1);

    expect(posts[0]).toBeInstanceOf(PostMock);
    expect(posts[0].$exists).toStrictEqual(true);
    expect(posts[0].id).toStrictEqual('1');
    expect(posts[0].title).toStrictEqual('Foo');
    expect(posts[0].comments).toHaveLength(2);
    expect(posts[0].comments[0]).toBeInstanceOf(CommentMock);
    expect(posts[0].comments[0].id).toStrictEqual('2');
    expect(posts[0].comments[0].body).toStrictEqual('Bar');
    expect(posts[0].comments[1]).toBeInstanceOf(CommentMock);
    expect(posts[0].comments[1].id).toStrictEqual('3');
    expect(posts[0].comments[1].body).toStrictEqual('Baz');
  });

  it('should guess ID path when querying model', async () => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementation(createFetchResponse().json({
      id: 'https://example.com/api/posts/1',
      title: 'Foo',
    }));

    const post1 = await action()
      .use(query(PostMock, '1'))
      .run(oneOrFail());
    const post2 = await action()
      .use(query(PostMock, 'https://example.com/api/posts/1'))
      .run(oneOrFail());
    const post3 = await action()
      .use(query(PostMock, '/posts/1'))
      .run(oneOrFail());

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect((fetchMock.mock.calls[0][0] as Request).url).toStrictEqual('https://example.com/api/posts/1');
    expect((fetchMock.mock.calls[1][0] as Request).url).toStrictEqual('https://example.com/api/posts/1');
    expect((fetchMock.mock.calls[2][0] as Request).url).toStrictEqual('https://example.com/api/posts/1');

    expect(post1).toBeInstanceOf(PostMock);
    expect(post1.id).toStrictEqual('1');
    expect(post1.title).toStrictEqual('Foo');
    expect(post2).toBeInstanceOf(PostMock);
    expect(post2.id).toStrictEqual('1');
    expect(post2.title).toStrictEqual('Foo');
    expect(post3).toBeInstanceOf(PostMock);
    expect(post3.id).toStrictEqual('1');
    expect(post3.title).toStrictEqual('Foo');
  });
});
