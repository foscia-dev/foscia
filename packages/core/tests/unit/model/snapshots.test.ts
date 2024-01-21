import {
  changed,
  compareSnapshots,
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

    expect(compareSnapshots(takeSnapshot(post), takeSnapshot(comment))).toStrictEqual(false);
    expect(compareSnapshots(takeSnapshot(post), takeSnapshot(post))).toStrictEqual(true);
    expect(compareSnapshots(takeSnapshot(post), post.$original)).toStrictEqual(false);
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
    const compareValue = vi.fn((n, p) => n !== p);

    const ExtendedPostMock = PostMock.configure({
      cloneValue,
      compareValue,
    });

    expect(cloneValue).not.toHaveBeenCalled();
    expect(compareValue).not.toHaveBeenCalled();

    const post = new ExtendedPostMock();

    expect(cloneValue).not.toHaveBeenCalled();
    expect(compareValue).not.toHaveBeenCalled();

    post.title = 'foo';
    post.comments = [];

    const snapshot = takeSnapshot(post);

    expect(cloneValue).toHaveBeenCalledTimes(3);
    expect(compareValue).not.toHaveBeenCalled();

    expect(compareSnapshots(snapshot, post.$original, 'title')).toStrictEqual(true);
    expect(compareValue).toHaveBeenCalledTimes(1);
    expect(compareSnapshots(snapshot, post.$original, 'comments')).toStrictEqual(true);
    expect(compareValue).toHaveBeenCalledTimes(2);
    expect(compareSnapshots(snapshot, post.$original, 'commentsCount')).toStrictEqual(true);
    expect(compareValue).toHaveBeenCalledTimes(3);

    expect(cloneValue).toHaveBeenCalledTimes(3);
  });
});
