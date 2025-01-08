import {
  all,
  changed,
  create,
  destroy,
  fill,
  include,
  loaded,
  makeQueryModelLoader,
  markSynced,
  none,
  one,
  query,
  queryAs,
  save,
  when,
} from '@foscia/core';
import { makeGet, param } from '@foscia/http';
import { describe, expect, it, vi } from 'vitest';
import createFetchMock from '../../../../tests/mocks/createFetchMock.mock';
import createFetchResponse from '../../../../tests/mocks/createFetchResponse.mock';
import makeRestActionMock from '../mocks/makeRestAction.mock';
import CommentMock from '../mocks/models/comment.mock';
import GalleryMock from '../mocks/models/gallery.mock';
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

    const action = makeRestActionMock();

    const posts = await action()
      .use(query(PostMock))
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

    const action = makeRestActionMock();

    const post = fill(new PostMock(), { id: '1' });
    post.$exists = true;
    const comments = await action()
      .use(query(post, 'comments'))
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

    const action = makeRestActionMock();

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

  it('should run action: create record over relation', async () => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementationOnce(createFetchResponse().json({
      id: '2',
      body: 'Bar',
    }));

    const action = makeRestActionMock();

    const comment = fill(new CommentMock(), { body: 'Bar' });
    const post = fill(new PostMock(), { id: '1', title: 'Foo' });
    post.$exists = true;

    const createdComment = await action()
      .use(create(comment, post, 'comments'))
      .run(one());

    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toStrictEqual('https://example.com/api/posts/1/comments');
    expect(request.method).toStrictEqual('POST');
    expect(request.headers.get('Accept')).toStrictEqual('application/json');
    expect(request.headers.get('Content-Type')).toStrictEqual('application/json');
    expect(await request.text()).toStrictEqual(JSON.stringify({
      body: 'Bar',
    }));

    expect(comment).toStrictEqual(createdComment);
    expect(comment).toBeInstanceOf(CommentMock);
    expect(comment.$exists).toStrictEqual(true);
    expect(comment.id).toStrictEqual('2');
    expect(comment.body).toStrictEqual('Bar');
  });

  it('should run action: update record', async () => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementationOnce(createFetchResponse().json({
      id: '1',
      title: 'Foo',
      body: 'Bar Body',
    }));

    const notChangedMock = vi.fn(() => null);

    const action = makeRestActionMock();

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

    const action = makeRestActionMock();

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

  it('should run action: custom query as models', async () => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementationOnce(createFetchResponse().json([
      { id: '1', title: 'Foo' },
    ]));

    const action = makeRestActionMock();

    const [post] = await action()
      .use(
        queryAs(PostMock),
        makeGet('global-search', { params: { search: 'foo' } }),
      )
      .run(all());

    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toStrictEqual('https://example.com/api/global-search?search=foo');
    expect(request.method).toStrictEqual('GET');
    expect(request.headers.get('Accept')).toStrictEqual('application/json');
    expect(request.headers.get('Content-Type')).toStrictEqual('application/json');
    expect(request.body).toBeNull();

    expect(post).toBeInstanceOf(PostMock);
    expect((post as PostMock).title).toStrictEqual('Foo');
  });

  it('should run action: custom query as models (polymorphic)', async () => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementationOnce(createFetchResponse().json([
      { type: 'posts', id: '1', title: 'Foo' },
      { type: 'comments', id: '1', body: 'Foo bar' },
    ]));

    const action = makeRestActionMock();

    const [post, comment] = await action()
      .use(
        queryAs(PostMock, CommentMock),
        makeGet('global-search', { params: { search: 'foo' } }),
      )
      .run(all());

    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toStrictEqual('https://example.com/api/global-search?search=foo');
    expect(request.method).toStrictEqual('GET');
    expect(request.headers.get('Accept')).toStrictEqual('application/json');
    expect(request.headers.get('Content-Type')).toStrictEqual('application/json');
    expect(request.body).toBeNull();

    expect(post).toBeInstanceOf(PostMock);
    expect((post as PostMock).title).toStrictEqual('Foo');
    expect(comment).toBeInstanceOf(CommentMock);
    expect((comment as CommentMock).body).toStrictEqual('Foo bar');
  });

  it('should load relations with model query', async () => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementationOnce(createFetchResponse().json([
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ]));

    const action = makeRestActionMock();

    const loadWithQuery = makeQueryModelLoader(action, {
      prepare: (a, { ids }) => a.use(param('ids', ids)),
      exclude: loaded,
    });

    const post1 = fill(new PostMock(), { id: '1' });
    post1.$raw = {
      comments: ['2', '1'],
    };
    const post2 = fill(new PostMock(), { id: '2' });
    post2.$raw = {
      comments: ['3'],
    };
    const post3 = fill(new PostMock(), { id: '3' });
    post3.$loaded.comments = true;
    post3.$raw = {
      comments: ['4'],
    };

    await loadWithQuery([post1, post2, post3], 'comments');

    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toStrictEqual('https://example.com/api/comments?ids=2%2C1%2C3');
    expect(request.method).toStrictEqual('GET');
    expect(request.headers.get('Accept')).toStrictEqual('application/json');
    expect(request.headers.get('Content-Type')).toStrictEqual('application/json');
    expect(request.body).toBeNull();

    expect(post1.comments.length).toStrictEqual(2);
    expect(post1.comments[0].id).toStrictEqual('2');
    expect(post1.comments[1].id).toStrictEqual('1');
    expect(post2.comments.length).toStrictEqual(1);
    expect(post2.comments[0].id).toStrictEqual('3');
    expect(post3.comments).toBeUndefined();
  });

  it('should load polymorphic relations with model query', async () => {
    const fetchMock = createFetchMock();
    fetchMock.mockImplementationOnce(createFetchResponse().json([
      {
        id: '1',
        comments: [],
        relatedContents: [
          { type: 'posts', id: '2' },
          { type: 'galleries', id: '1' },
        ],
      },
      {
        id: '2',
        comments: [],
        relatedContents: [
          { type: 'posts', id: '1' },
        ],
      },
    ]));
    fetchMock.mockImplementationOnce(createFetchResponse().json([
      { id: '1' },
      { id: '2' },
    ]));
    fetchMock.mockImplementationOnce(createFetchResponse().json([
      { id: '1' },
    ]));

    const action = makeRestActionMock();

    const loadWithQuery = makeQueryModelLoader(action, {
      prepare: (a, { ids }) => a.use(param('ids', ids)),
    });

    const [post1, post2] = await action()
      .use(query(PostMock))
      .run(all());

    await loadWithQuery([post1, post2], ['comments', 'relatedContents']);

    expect(fetchMock).toHaveBeenCalledTimes(3);
    const request1 = fetchMock.mock.calls[1][0] as Request;
    expect(request1.url).toStrictEqual('https://example.com/api/posts?ids=2%2C1');
    expect(request1.method).toStrictEqual('GET');
    expect(request1.headers.get('Accept')).toStrictEqual('application/json');
    expect(request1.headers.get('Content-Type')).toStrictEqual('application/json');
    expect(request1.body).toBeNull();
    const request2 = fetchMock.mock.calls[2][0] as Request;
    expect(request2.url).toStrictEqual('https://example.com/api/galleries?ids=1');
    expect(request2.method).toStrictEqual('GET');
    expect(request2.headers.get('Accept')).toStrictEqual('application/json');
    expect(request2.headers.get('Content-Type')).toStrictEqual('application/json');
    expect(request2.body).toBeNull();

    expect(post1.comments.length).toStrictEqual(0);
    expect(post1.relatedContents.length).toStrictEqual(2);
    expect(post1.relatedContents[0]).toBeInstanceOf(PostMock);
    expect(post1.relatedContents[0].id).toStrictEqual('2');
    expect(post1.relatedContents[1]).toBeInstanceOf(GalleryMock);
    expect(post1.relatedContents[1].id).toStrictEqual('1');
    expect(post2.comments.length).toStrictEqual(0);
    expect(post2.relatedContents.length).toStrictEqual(1);
    expect(post2.relatedContents[0]).toStrictEqual(post1);
  });
});
