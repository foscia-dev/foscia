import { makeEnhancer } from '@foscia/core';
import { param } from '@foscia/http';

/**
 * [Paginate the JSON:API resource](https://jsonapi.org/format/#fetching-pagination)
 * by the given params.
 * JSON:API specification on pagination is agnostic, so page params may be
 * anything used by your implementation.
 *
 * @param page
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { query, all } from '@foscia/core';
 * import { paginate } from '@foscia/jsonapi';
 *
 * const posts = await action().run(
 *   query(Post),
 *   paginate({ number: 1, size: 15 }),
 *   all(),
 * );
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('paginate', (page: unknown) => param('page', page));
