import { Awaitable, Optional, Transformer } from '@foscia/shared';

/**
 * Bi-directional object transformer.
 */
export type ObjectTransformer<T, DS = unknown, SR = unknown> = {
  deserialize: Transformer<DS, Awaitable<T>>;
  serialize: Transformer<T, Awaitable<SR>>;
};

/**
 * Object transformer factory options.
 *
 * @internal
 */
export type ObjectTransformerFactoryOptions<N extends boolean> = {
  nullable?: N;
};

/**
 * Object transformer factory result from options.
 *
 * @internal
 */
export type ObjectTransformerFactoryResult<T, DS, SR> = <N extends boolean = false>(
  options?: ObjectTransformerFactoryOptions<N>,
) => N extends true
  ? ObjectTransformer<T | null, Optional<DS>, SR | null>
  : ObjectTransformer<T, DS, SR>;
