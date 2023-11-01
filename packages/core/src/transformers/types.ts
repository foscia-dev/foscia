import { Awaitable, Optional, Transformer } from '@foscia/shared';

export type ObjectTransformer<T, DS = unknown, SR = unknown> = {
  deserialize: Transformer<DS, Awaitable<T>>;
  serialize: Transformer<T, Awaitable<SR>>;
};

export type ObjectTransformerFactoryOptions<N extends boolean> = {
  nullable?: N;
};

export type ObjectTransformerFactoryResult<T, DS, SR> = <N extends boolean = false>(
  options?: ObjectTransformerFactoryOptions<N>,
) => N extends true
  ? ObjectTransformer<T | null, Optional<DS>, SR | null>
  : ObjectTransformer<T, DS, SR>;
