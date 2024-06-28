import { Awaitable, Transformer } from '@foscia/shared/types';

const sequentialTransform: {
  (transformers: Transformer<void, Awaitable<void>>[]): Promise<void>;
  <T>(transformers: Transformer<T, Awaitable<T>>[], value: T): Promise<T>;
} = <T>(
  transformers: Transformer<T, Awaitable<T>>[],
  value?: T,
) => transformers.reduce(
  async (prevValue, transformer) => transformer(await prevValue),
  Promise.resolve(value) as Promise<T>,
);

export default sequentialTransform;
