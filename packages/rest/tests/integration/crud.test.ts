import {
  all,
  changed,
  destroy,
  fill,
  forModel,
  forRelation,
  include,
  markSynced,
  none,
  one,
  save,
  when,
} from '@foscia/core';
import { describe, expect, it, vi } from 'vitest';
import createFetchMock from '../../../../tests/mocks/createFetchMock.mock';
import createFetchResponse from '../../../../tests/mocks/createFetchResponse.mock';
import makeJsonRestActionMock from '../mocks/makeJsonRestAction.mock';
import CommentMock from '../mocks/models/comment.mock';
import PostMock from '../mocks/models/post.mock';

describe('integration: JSON REST', () => {
  it('should run action: all records', async () => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementationOnce(createFetchResponse().json([
      {
        id: '1',
        title: 'Foo',
        body: 'Foo Body',
        publishedAt: '2023-10-24T10:00:00.000Z',
        comments: [
          {
            id: '1',
            body: 'Foo Comment',
          },
          {
            id: '2',
            body: 'Bar Comment',
          },
        ],
      },
      {
        id: '2',
        title: 'Bar',
        body: 'Bar Body',
        publishedAt: null,
        comments: [],
      },
    ]));

    const action = makeJsonRestActionMock();

    const posts = await action()
      .use(forModel(PostMock))
      .use(include('comments'))
      .run(all());

    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toStrictEqual('https://example.com/api/posts?include=comments');
    expect(request.method).toStrictEqual('GET');
    expect(request.headers.get('Accept')).toStrictEqual('application/json');
    expect(request.headers.get('Content-Type')).toStrictEqual('application/json');
    expect(request.body).toBeNull();

    expect(posts).toHaveLength(2);

    expect(posts[0]).toBeInstanceOf(PostMock);
    expect(posts[0].$exists).toStrictEqual(true);
    expect(posts[0].id).toStrictEqual('1');
    expect(posts[0].title).toStrictEqual('Foo');
    expect(posts[0].body).toStrictEqual('Foo Body');
    expect(posts[0].publishedAt!.toISOString()).toStrictEqual('2023-10-24T10:00:00.000Z');
    expect(posts[0].comments).toHaveLength(2);
    expect(posts[0].comments[0].$exists).toStrictEqual(true);
    expect(posts[0].comments[0]).toBeInstanceOf(CommentMock);
    expect(posts[0].comments[0].id).toStrictEqual('1');
    expect(posts[0].comments[0].body).toStrictEqual('Foo Comment');
    expect(posts[0].comments[1].$exists).toStrictEqual(true);
    expect(posts[0].comments[1]).toBeInstanceOf(CommentMock);
    expect(posts[0].comments[1].id).toStrictEqual('2');
    expect(posts[0].comments[1].body).toStrictEqual('Bar Comment');

    expect(posts[1]).toBeInstanceOf(PostMock);
    expect(posts[1].$exists).toStrictEqual(true);
    expect(posts[1].id).toStrictEqual('2');
    expect(posts[1].title).toStrictEqual('Bar');
    expect(posts[1].body).toStrictEqual('Bar Body');
    expect(posts[1].publishedAt).toBeNull();
    expect(posts[1].comments).toHaveLength(0);
  });

  it('should run action: relation', async () => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementationOnce(createFetchResponse().json([
      {
        id: '1',
        body: 'Foo Body',
      },
      {
        id: '2',
        body: 'Bar Body',
      },
    ]));

    const action = makeJsonRestActionMock();

    const post = fill(new PostMock(), { id: '1' });
    const comments = await action()
      .use(forRelation(post, 'comments'))
      .run(all());

    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toStrictEqual('https://example.com/api/posts/1/comments');
    expect(request.method).toStrictEqual('GET');
    expect(request.headers.get('Accept')).toStrictEqual('application/json');
    expect(request.headers.get('Content-Type')).toStrictEqual('application/json');
    expect(request.body).toBeNull();

    expect(comments).toHaveLength(2);

    expect(comments[0]).toBeInstanceOf(CommentMock);
    expect(comments[0].$exists).toStrictEqual(true);
    expect(comments[0].id).toStrictEqual('1');
    expect(comments[0].body).toStrictEqual('Foo Body');

    expect(comments[1]).toBeInstanceOf(CommentMock);
    expect(comments[1].$exists).toStrictEqual(true);
    expect(comments[1].id).toStrictEqual('2');
    expect(comments[1].body).toStrictEqual('Bar Body');
  });

  it('should run action: create record', async () => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementationOnce(createFetchResponse().json({
      id: '1',
      title: 'Foo',
      body: 'Foo Body',
    }));

    const action = makeJsonRestActionMock();

    const comment = fill(new CommentMock(), { id: '1' });
    const post = fill(new PostMock(), { title: 'Foo', body: 'Foo Body', comments: [comment] });

    const createdPost = await action()
      .use(save(post))
      .run(one());

    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toStrictEqual('https://example.com/api/posts');
    expect(request.method).toStrictEqual('POST');
    expect(request.headers.get('Accept')).toStrictEqual('application/json');
    expect(request.headers.get('Content-Type')).toStrictEqual('application/json');
    expect(await request.text()).toStrictEqual(JSON.stringify({
      title: 'Foo',
      body: 'Foo Body',
      comments: ['1'],
    }));

    expect(post).toStrictEqual(createdPost);
    expect(post).toBeInstanceOf(PostMock);
    expect(post.$exists).toStrictEqual(true);
    expect(post.id).toStrictEqual('1');
    expect(post.title).toStrictEqual('Foo');
    expect(post.body).toStrictEqual('Foo Body');
    expect(post.comments).toStrictEqual([comment]);
  });

  it('should run action: update record', async () => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementationOnce(createFetchResponse().json({
      id: '1',
      title: 'Foo',
      body: 'Bar Body',
    }));

    const notChangedMock = vi.fn(() => null);

    const action = makeJsonRestActionMock();

    const post = fill(new PostMock(), { title: 'Foo', body: 'Foo Body' });
    post.id = '1';
    post.$exists = true;
    markSynced(post);

    await action()
      .use(save(post))
      .run(when(changed(post), none(), notChangedMock));

    fill(post, { body: 'Bar Body' });

    const updatedPost = await action()
      .use(save(post))
      .run(when(changed(post), one(), notChangedMock));

    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toStrictEqual('https://example.com/api/posts/1');
    expect(request.method).toStrictEqual('PATCH');
    expect(request.headers.get('Accept')).toStrictEqual('application/json');
    expect(request.headers.get('Content-Type')).toStrictEqual('application/json');
    expect(await request.text()).toStrictEqual(JSON.stringify({
      id: '1',
      body: 'Bar Body',
    }));

    expect(notChangedMock).toHaveBeenCalledOnce();

    expect(post).toStrictEqual(updatedPost);
    expect(post).toBeInstanceOf(PostMock);
    expect(post.$exists).toStrictEqual(true);
    expect(post.id).toStrictEqual('1');
    expect(post.title).toStrictEqual('Foo');
    expect(post.body).toStrictEqual('Bar Body');
    expect(post.comments).toBeUndefined();
  });

  it('should run action: destroy record', async () => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementationOnce(createFetchResponse().noContent());

    const action = makeJsonRestActionMock();

    const post = fill(new PostMock(), { title: 'Foo', body: 'Foo Body' });
    post.id = '1';
    post.$exists = true;
    markSynced(post);

    const data = await action()
      .use(destroy(post))
      .run(one());

    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toStrictEqual('https://example.com/api/posts/1');
    expect(request.method).toStrictEqual('DELETE');
    expect(request.headers.get('Accept')).toStrictEqual('application/json');
    expect(request.headers.get('Content-Type')).toStrictEqual('application/json');
    expect(request.body).toBeNull();

    expect(data).toBeNull();
    expect(post).toBeInstanceOf(PostMock);
    expect(post.$exists).toStrictEqual(false);
    expect(post.id).toStrictEqual('1');
    expect(post.title).toStrictEqual('Foo');
    expect(post.body).toStrictEqual('Foo Body');
    expect(post.comments).toBeUndefined();
  });
});
