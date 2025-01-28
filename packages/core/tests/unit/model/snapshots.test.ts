import {
  attr,
  changed,
  fill,
  hasOne,
  isSameSnapshot,
  isSnapshot,
  makeModel,
  markSynced,
  restore,
  restoreSnapshot,
  takeSnapshot,
} from '@foscia/core';
import { describe, expect, it, vi } from 'vitest';
import CommentMock from '../../mocks/models/comment.mock';
import PostMock from '../../mocks/models/post.mock';

describe.concurrent('unit: snapshots', () => {
  it('should take and compare snapshots', () => {
    const post = new PostMock();
    const comment = new CommentMock();

    expect(isSameSnapshot(takeSnapshot(post), takeSnapshot(comment))).toStrictEqual(false);
    expect(isSameSnapshot(takeSnapshot(post), takeSnapshot(post))).toStrictEqual(true);
    expect(isSameSnapshot(takeSnapshot(post), post.$original)).toStrictEqual(false);
    expect(changed(post)).toStrictEqual(true);
    expect(changed(post, 'commentsCount')).toStrictEqual(true);
    expect(changed(post, 'title')).toStrictEqual(false);
    expect(changed(post, 'body')).toStrictEqual(false);

    post.title = 'foo';

    expect(post.title).toStrictEqual('foo');
    expect(changed(post)).toStrictEqual(true);
    expect(changed(post, 'commentsCount')).toStrictEqual(true);
    expect(changed(post, 'title')).toStrictEqual(true);
    expect(changed(post, 'body')).toStrictEqual(false);

    restore(post, 'title');

    expect(post.title).toStrictEqual(undefined);
    expect(changed(post)).toStrictEqual(true);
    expect(changed(post, 'commentsCount')).toStrictEqual(true);
    expect(changed(post, 'title')).toStrictEqual(false);
    expect(changed(post, 'body')).toStrictEqual(false);

    markSynced(post, 'commentsCount');

    expect(changed(post)).toStrictEqual(false);
    expect(changed(post, 'commentsCount')).toStrictEqual(false);
    expect(changed(post, 'title')).toStrictEqual(false);
    expect(changed(post, 'body')).toStrictEqual(false);

    post.$exists = true;
    post.body = 'bar';

    expect(post.$exists).toStrictEqual(true);
    expect(post.body).toStrictEqual('bar');
    expect(changed(post)).toStrictEqual(true);
    expect(changed(post, 'commentsCount')).toStrictEqual(false);
    expect(changed(post, 'title')).toStrictEqual(false);
    expect(changed(post, 'body')).toStrictEqual(true);

    markSynced(post);

    expect(changed(post)).toStrictEqual(false);
    expect(changed(post, 'commentsCount')).toStrictEqual(false);
    expect(changed(post, 'title')).toStrictEqual(false);
    expect(changed(post, 'body')).toStrictEqual(false);

    post.$exists = false;
    post.title = 'bar';
    post.body = 'foo';

    expect(post.$exists).toStrictEqual(false);
    expect(post.title).toStrictEqual('bar');
    expect(post.body).toStrictEqual('foo');
    expect(changed(post)).toStrictEqual(true);
    expect(changed(post, 'commentsCount')).toStrictEqual(false);
    expect(changed(post, 'title')).toStrictEqual(true);
    expect(changed(post, 'body')).toStrictEqual(true);

    restore(post);

    expect(post.$exists).toStrictEqual(true);
    expect(post.title).toStrictEqual(undefined);
    expect(post.body).toStrictEqual('bar');
    expect(changed(post)).toStrictEqual(false);
    expect(changed(post, 'commentsCount')).toStrictEqual(false);
    expect(changed(post, 'title')).toStrictEqual(false);
    expect(changed(post, 'body')).toStrictEqual(false);

    const otherPost = new PostMock();
    otherPost.title = 'foo';

    restoreSnapshot(post, takeSnapshot(otherPost));

    expect(post.$exists).toStrictEqual(false);
    expect(post.title).toStrictEqual('foo');
    expect(post.body).toStrictEqual(undefined);
    expect(changed(post)).toStrictEqual(false);
    expect(changed(post, 'commentsCount')).toStrictEqual(false);
    expect(changed(post, 'title')).toStrictEqual(false);
    expect(changed(post, 'body')).toStrictEqual(false);
  });

  it('should use clone and compare model options', () => {
    const cloneValue = vi.fn((v) => (Array.isArray(v) ? [...v] : v));
    const compareValues = vi.fn((n, p) => n !== p);

    const ExtendedPostMock = PostMock.configure({
      cloneValue,
      compareValues,
    });

    expect(cloneValue).not.toHaveBeenCalled();
    expect(compareValues).not.toHaveBeenCalled();

    const post = new ExtendedPostMock();

    expect(cloneValue).not.toHaveBeenCalled();
    expect(compareValues).not.toHaveBeenCalled();

    post.title = 'foo';
    post.comments = [];

    const snapshot = takeSnapshot(post);

    expect(cloneValue).toHaveBeenCalledTimes(3);
    expect(compareValues).not.toHaveBeenCalled();

    expect(isSameSnapshot(snapshot, post.$original, 'title')).toStrictEqual(true);
    expect(compareValues).toHaveBeenCalledTimes(1);
    expect(isSameSnapshot(snapshot, post.$original, 'comments')).toStrictEqual(true);
    expect(compareValues).toHaveBeenCalledTimes(2);
    expect(isSameSnapshot(snapshot, post.$original, 'commentsCount')).toStrictEqual(true);
    expect(compareValues).toHaveBeenCalledTimes(3);

    expect(cloneValue).toHaveBeenCalledTimes(3);
  });

  it('should take deep and limited snapshots', () => {
    const FooModel = makeModel({ type: 'foo', limitedSnapshots: false }, {
      foo: attr<any>(),
      bar: hasOne<any>(),
    });

    const BarModel = makeModel({ type: 'bar', limitedSnapshots: true }, {
      bar: attr<any>(),
      baz: hasOne<any>(),
    });

    const BazModel = makeModel({ type: 'baz' }, {
      baz: attr<any>(),
    });

    const fooSnapshot = takeSnapshot(fill(new FooModel(), {
      id: 'foo',
      foo: 'foo',
      bar: fill(new BarModel(), {
        id: 'bar',
        bar: 'bar',
        baz: fill(new BazModel(), {
          id: 'baz',
          baz: 'baz',
        }),
      }),
    }));

    expect(isSnapshot(fooSnapshot)).toStrictEqual(true);
    expect(Object.keys(fooSnapshot.$values)).toStrictEqual(['id', 'foo', 'bar']);
    expect(fooSnapshot.$values.id).toStrictEqual('foo');
    expect(fooSnapshot.$values.foo).toStrictEqual('foo');

    expect(isSnapshot(fooSnapshot.$values.bar)).toStrictEqual(true);
    expect(Object.keys((fooSnapshot.$values.bar as any).$values))
      .toStrictEqual(['id', 'bar', 'baz']);
    expect((fooSnapshot.$values.bar as any).$values.id).toStrictEqual('bar');
    expect((fooSnapshot.$values.bar as any).$values.bar).toStrictEqual('bar');

    expect(isSnapshot((fooSnapshot.$values.bar as any).$values.baz)).toStrictEqual(true);
    expect(Object.keys(((fooSnapshot.$values.bar as any).$values.baz as any).$values))
      .toStrictEqual(['id']);
    expect(((fooSnapshot.$values.bar as any).$values.baz as any).$values.id).toStrictEqual('baz');
  });
});
