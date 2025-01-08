import makeEnhancer from '@foscia/core/actions/makeEnhancer';
import { Action } from '@foscia/core/actions/types';
import registerHook from '@foscia/core/hooks/registerHook';
import { Awaitable } from '@foscia/shared';

/**
 * Register a "success" hook callback on action.
 * Callback may be async.
 *
 * @param callback
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { onSuccess } from '@foscia/core';
 *
 * action().use(onSuccess((event) => {
 *   console.log(event.context, event.result);
 * }));
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('onSuccess', <C extends {}>(
  callback: (event: { context: C; result: unknown; }) => Awaitable<unknown>,
) => (action: Action<C>) => {
  registerHook(action, 'success', callback as any);
});
