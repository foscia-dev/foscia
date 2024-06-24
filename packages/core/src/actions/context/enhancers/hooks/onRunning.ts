import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import { Action, WithParsedExtension } from '@foscia/core/actions/types';
import registerHook from '@foscia/core/hooks/registerHook';
import { Awaitable } from '@foscia/shared';

/**
 * Register a "running" hook callback on action.
 * Callback may be async.
 *
 * @param callback
 *
 * @category Enhancers
 */
function onRunning<C extends {}>(
  callback: (event: { context: C; runner: Function; }) => Awaitable<unknown>,
) {
  return (action: Action<C>) => {
    registerHook(action, 'running', callback as any);
  };
}

export default /* @__PURE__ */ appendExtension(
  'onRunning',
  onRunning,
  'use',
) as WithParsedExtension<typeof onRunning, {
  onRunning<C extends {}, E extends {}>(
    this: Action<C, E>,
    callback: (event: { context: C; runner: Function; }) => Awaitable<unknown>,
  ): Action<C, E>;
}>;
