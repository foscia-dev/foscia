import makeEnhancer from '@foscia/core/actions/makeEnhancer';
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
 *
 * @example
 * ```typescript
 * import { onRunning } from '@foscia/core';
 *
 * action().use(onRunning((event) => {
 *   console.log(event.context, event.runner);
 * }));
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('onRunning', <C extends {}>(
  callback: (event: { context: C; runner: Function; }) => Awaitable<unknown>,
) => (action: Action<C>) => {
  registerHook(action, 'running', callback as any);
});
