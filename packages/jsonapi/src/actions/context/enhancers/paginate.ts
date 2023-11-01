import { Action, ActionParsedExtension, makeEnhancersExtension } from '@foscia/core';
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
export default function paginate(page: unknown) {
  return param('page', page);
}

type PaginateEnhancerExtension = ActionParsedExtension<{
  paginate<C extends {}, E extends {}>(
    this: Action<C, E>,
    page: unknown,
  ): Action<C, E>;
}>;

paginate.extension = makeEnhancersExtension({ paginate }) as PaginateEnhancerExtension;
