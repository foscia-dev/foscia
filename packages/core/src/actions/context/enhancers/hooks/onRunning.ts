import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import { Action, ActionParsedExtension } from '@foscia/core/actions/types';
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
export default function onRunning<C extends {}>(
  callback: (event: { context: C; runner: Function; }) => Awaitable<void>,
) {
  return (action: Action<C>) => {
    registerHook(action, 'running', callback as any);
  };
}

type EnhancerExtension = ActionParsedExtension<{
  onRunning<C extends {}, E extends {}>(
    this: Action<C, E>,
    callback: (event: { context: C; runner: Function; }) => Awaitable<void>,
  ): Action<C, E>;
}>;

onRunning.extension = makeEnhancersExtension({ onRunning }) as EnhancerExtension;
