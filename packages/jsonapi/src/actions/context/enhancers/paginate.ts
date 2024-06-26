import { Action, appendExtension, WithParsedExtension } from '@foscia/core';
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
 */
const paginate = (page: unknown) => param('page', page);

export default /* @__PURE__ */ appendExtension(
  'paginate',
  paginate,
  'use',
) as WithParsedExtension<typeof paginate, {
  paginate<C extends {}, E extends {}>(
    this: Action<C, E>,
    page: unknown,
  ): Action<C, E>;
}>;
