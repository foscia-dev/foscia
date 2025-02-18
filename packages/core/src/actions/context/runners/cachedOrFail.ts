import cachedOr, { CachedData } from '@foscia/core/actions/context/runners/cachedOr';
import { InferQueryInstance } from '@foscia/core/actions/types';
import makeRunner from '@foscia/core/actions/utilities/makeRunner';
import ExpectedRunFailureError from '@foscia/core/errors/expectedRunFailureError';
import { Awaitable } from '@foscia/shared';

/**
 * Retrieve an instance from the cache.
 * If the instance is not in cache or if the included relations are not loaded,
 * throws an {@link ExpectedRunFailureError | `ExpectedRunFailureError`}.
 *
 * @category Runners
 * @requireContext cache, model, id
 *
 * @example
 * ```typescript
 * import { cachedOrFail, query } from '@foscia/core';
 *
 * const post = await action(query(Post, '123'), cachedOrFail());
 * ```
 */
export default /* @__PURE__ */ makeRunner('cachedOrFail', <
  C extends {},
  I extends InferQueryInstance<C>,
  ND = I,
>(
  transform?: (data: CachedData<I>) => Awaitable<ND>,
) => cachedOr<C, I, never, ND>(() => {
  throw new ExpectedRunFailureError(
    '`cachedOrFail` failed. You may handle this error globally as a "not found" record error.',
  );
}, transform));
