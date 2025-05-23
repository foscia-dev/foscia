import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import { Action } from '@foscia/core/actions/types';
import registerHook from '@foscia/core/hooks/registerHook';
import { Awaitable } from '@foscia/shared';

/**
 * Register a "running" hook callback on action.
 * Callback may be async.
 *
 * @param callback
 *
 * @category Enhancers
 * @category Hooks
 *
 * @example
 * ```typescript
 * import { onRunning } from '@foscia/core';
 *
 * action(onRunning((event) => {
 *   console.log(event.action, event.runner);
 * }));
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('onRunning', <C extends {}>(
  callback: (event: { action: Action<C>; runner: Function; }) => Awaitable<unknown>,
) => (action: Action<C>) => {
  registerHook(action, 'running', callback as any);
});
