/* eslint-disable max-classes-per-file */
import {
  makeComposable,
  makeModel,
  makeModelFactory,
  onBoot,
  onCreated,
  onCreating,
  onDestroyed,
  onDestroying,
  onInit,
  onRetrieved,
  onSaved,
  onSaving,
  onUpdated,
  onUpdating,
} from '@foscia/core';
import { describe, expect, it, vi } from 'vitest';

describe.concurrent('unit: hooks', () => {
  it.each([
    [onCreated, 'created'],
    [onCreating, 'creating'],
    [onDestroyed, 'destroyed'],
    [onDestroying, 'destroying'],
    [onRetrieved, 'retrieved'],
    [onSaved, 'saved'],
    [onSaving, 'saving'],
    [onUpdated, 'updated'],
    [onUpdating, 'updating'],
  ] as const)('should register hook callback', (fn, event) => {
    const callback = () => {
    };
    const model = makeModel('model');

    expect(fn(model, callback)).toBeTypeOf('function');
    expect(model.$hooks?.[event]).toStrictEqual([callback]);
  });

  it('should share hooks', () => {
    const bootCalls = [] as string[];
    const initCalls = [] as string[];

    const bootFn = vi.fn();
    const initFn = vi.fn();

    const composable1 = makeComposable({});
    onBoot(composable1, (model) => {
      bootCalls.push('composable1');
      bootFn(model);
    });
    onInit(composable1, (instance) => {
      initCalls.push('composable1');
      initFn(instance);
    });

    const composable2 = makeComposable({});
    onBoot(composable2, (model) => {
      bootCalls.push('composable2');
      bootFn(model);
    });
    onInit(composable2, (instance) => {
      initCalls.push('composable2');
      initFn(instance);
    });

    const modelFactory = makeModelFactory({}, { composable1 });
    onBoot(modelFactory, (model) => {
      bootCalls.push('factory');
      bootFn(model);
    });
    onInit(modelFactory, (instance) => {
      initCalls.push('factory');
      initFn(instance);
    });

    class Post extends modelFactory('posts', { composable2 }) {
    }

    onBoot(Post, (model) => {
      bootCalls.push('post');
      bootFn(model);
    });
    onInit(Post, (instance) => {
      initCalls.push('post');
      initFn(instance);
    });

    expect(bootCalls).toStrictEqual([]);
    expect(initCalls).toStrictEqual([]);
    expect(bootFn).toHaveBeenCalledTimes(0);
    expect(initFn).toHaveBeenCalledTimes(0);

    // eslint-disable-next-line no-new
    new Post();

    expect(bootCalls).toStrictEqual(['factory', 'composable1', 'composable2', 'post']);
    expect(initCalls).toStrictEqual(['factory', 'composable1', 'composable2', 'post']);
    expect(bootFn).toHaveBeenCalledTimes(4);
    expect(bootFn.mock.calls.every(([arg]) => arg === Post)).toBeTruthy();
    expect(initFn).toHaveBeenCalledTimes(4);
    expect(initFn.mock.calls.every(([arg]) => arg instanceof Post)).toBeTruthy();

    class Comment extends modelFactory('comments', { composable2 }) {
    }

    onBoot(Comment, (model) => {
      bootCalls.push('comment');
      bootFn(model);
    });
    onInit(Comment, (instance) => {
      initCalls.push('comment');
      initFn(instance);
    });

    expect(bootCalls).toStrictEqual(['factory', 'composable1', 'composable2', 'post']);
    expect(initCalls).toStrictEqual(['factory', 'composable1', 'composable2', 'post']);
    expect(bootFn).toHaveBeenCalledTimes(4);
    expect(initFn).toHaveBeenCalledTimes(4);

    // eslint-disable-next-line no-new
    new Comment();

    expect(bootCalls).toStrictEqual([
      'factory', 'composable1', 'composable2', 'post',
      'factory', 'composable1', 'composable2', 'comment',
    ]);
    expect(initCalls).toStrictEqual([
      'factory', 'composable1', 'composable2', 'post',
      'factory', 'composable1', 'composable2', 'comment',
    ]);
    expect(bootFn).toHaveBeenCalledTimes(8);
    expect(bootFn.mock.calls.slice(0, 4).every(([arg]) => arg === Post)).toBeTruthy();
    expect(bootFn.mock.calls.slice(4, 8).every(([arg]) => arg === Comment)).toBeTruthy();
    expect(initFn).toHaveBeenCalledTimes(8);
    expect(initFn.mock.calls.slice(0, 4).every(([arg]) => arg instanceof Post)).toBeTruthy();
    expect(initFn.mock.calls.slice(4, 8).every(([arg]) => arg instanceof Comment)).toBeTruthy();

    // eslint-disable-next-line no-new
    new Comment();

    expect(bootFn).toHaveBeenCalledTimes(8);
    expect(initFn).toHaveBeenCalledTimes(12);
  });
});
