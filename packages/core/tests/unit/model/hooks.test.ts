import {
  makeModel,
  onCreated,
  onCreating,
  onDestroyed,
  onDestroying,
  onRetrieved,
  onSaved,
  onSaving,
  onUpdated,
  onUpdating,
} from '@foscia/core';
import { describe, expect, it } from 'vitest';

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
});
