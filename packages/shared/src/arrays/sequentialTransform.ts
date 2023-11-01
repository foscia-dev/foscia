import { Awaitable, Transformer } from '@foscia/shared/types';

function sequentialTransform(transformers: Transformer<void, Awaitable<void>>[]): Promise<void>;
function sequentialTransform<T>(transformers: Transformer<T, Awaitable<T>>[], value: T): Promise<T>;

function sequentialTransform<T>(transformers: Transformer<T, Awaitable<T>>[], value?: T) {
  return transformers.reduce(
    async (prevValue, transformer) => transformer(await prevValue),
    Promise.resolve(value) as Promise<T>,
  );
}

export default sequentialTransform;
