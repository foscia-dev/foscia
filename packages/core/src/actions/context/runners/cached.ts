import cachedOr, { CachedData } from '@foscia/core/actions/context/runners/cachedOr';
import makeRunner from '@foscia/core/actions/makeRunner';
import { InferQueryInstance } from '@foscia/core/actions/types';
import { Awaitable } from '@foscia/shared';

/**
 * Retrieve an instance from the cache.
 * If the instance is not in cache or if the included relations are not loaded,
 * returns null.
 *
 * @category Runners
 * @requireContext cache, model, id
 *
 * @example
 * ```typescript
 * import { cached, query } from '@foscia/core';
 *
 * const post = await action().run(query(Post, '123'), cached());
 * ```
 */
export default /* @__PURE__ */ makeRunner('cached', <
  C extends {},
  I extends InferQueryInstance<C>,
  ND = I,
>(
  transform?: (data: CachedData<I>) => Awaitable<ND>,
) => cachedOr<C, I, null, ND>(() => null, transform));
