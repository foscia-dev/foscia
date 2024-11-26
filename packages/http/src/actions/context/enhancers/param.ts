import { Action, makeEnhancer } from '@foscia/core';
import consumeRequestObjectParams
  from '@foscia/http/actions/context/consumers/consumeRequestObjectParams';
import configureRequest from '@foscia/http/actions/context/enhancers/configureRequest';
import { Dictionary } from '@foscia/shared';

/**
 * Set the given query param on the request.
 * The new params will be merged with the previous ones.
 *
 * @param key
 * @param value
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { raw } from '@foscia/core';
 * import { makeGet, params } from '@foscia/http';
 *
 * const response = await action().run(
 *   makeGet('posts'),
 *   params({ search: 'foo' }),
 *   params('sort', 'title'),
 *   raw(),
 * );
 * ```
 *
 * @remarks
 * `params` provides an object params configuration and cannot be used in
 * combination with a query string (such as `search=foo&sort=title`).
 */
export default /* @__PURE__ */ makeEnhancer('param', (
  key: string | Dictionary,
  value?: unknown,
) => async <C extends {}>(action: Action<C>) => action.use(
  configureRequest({
    params: {
      ...consumeRequestObjectParams(await action.useContext()),
      ...(typeof key === 'string' ? { [key]: value } : key),
    },
  }),
));
