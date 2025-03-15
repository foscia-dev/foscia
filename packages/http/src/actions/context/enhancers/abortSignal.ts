import { makeEnhancer } from '@foscia/core';
import configureRequest from '@foscia/http/actions/context/enhancers/configureRequest';

/**
 * Configure an abort controller or signal on the request to support calling
 * {@link !AbortController#abort | `AbortController.abort()`}.
 *
 * @param controllerOrSignal
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { raw } from '@foscia/core';
 * import { abortSignal, makeGet } from '@foscia/http';
 *
 * const abortController = new AbortController();
 *
 * const promise = action(makeGet('posts'), abortSignal(abortController), raw());
 *
 * abortController.abort();
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('abortSignal', (
  controllerOrSignal?: AbortController | AbortSignal | null,
) => configureRequest({
  signal: controllerOrSignal instanceof AbortController
    ? controllerOrSignal.signal
    : controllerOrSignal,
}));
