import { Action, appendExtension, WithParsedExtension } from '@foscia/core';
import configureRequest from '@foscia/http/actions/context/enhancers/configureRequest';
import { Optional } from '@foscia/shared';

/**
 * Configure an abort signal on the request to
 * [make it abortable](https://developer.chrome.com/blog/abortable-fetch/).
 *
 * @param controllerOrSignal
 *
 * @category Enhancers
 */
const abortSignal = (
  controllerOrSignal?: Optional<AbortController | AbortSignal>,
) => configureRequest({
  signal: controllerOrSignal instanceof AbortController
    ? controllerOrSignal.signal
    : controllerOrSignal,
});

export default /* @__PURE__ */ appendExtension(
  'abortSignal',
  abortSignal,
  'use',
) as WithParsedExtension<typeof abortSignal, {
  abortSignal<C extends {}, E extends {}>(
    this: Action<C, E>,
    controllerOrSignal?: Optional<AbortController | AbortSignal>,
  ): Action<C, E>;
}>;
