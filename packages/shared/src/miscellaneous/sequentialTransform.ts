import { Awaitable } from '@foscia/shared/types';

const sequentialTransform: {
  /**
   * Call given async functions sequentially.
   *
   * @param transformers
   *
   * @internal
   */
  (transformers: ((prev: void) => Awaitable<void>)[]): Promise<void>;
  /**
   * Transform value with async functions sequentially.
   *
   * @param transformers
   * @param value
   *
   * @internal
   */<T>(transformers: ((prev: T) => Awaitable<T>)[], value: T): Promise<T>;
} = <T>(
  transformers: ((prev: T) => Awaitable<T>)[],
  value?: T,
) => transformers.reduce(
  async (prevValue, transformer) => transformer(await prevValue),
  Promise.resolve(value) as Promise<T>,
);

export default sequentialTransform;
