import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import { Action, WithParsedExtension } from '@foscia/core/actions/types';
import registerHook from '@foscia/core/hooks/registerHook';
import { Awaitable } from '@foscia/shared';

/**
 * Register a "error" hook callback on action.
 * Callback may be async.
 *
 * @param callback
 *
 * @category Enhancers
 */
const onError = <C extends {}>(
  callback: (event: { context: C; error: unknown; }) => Awaitable<unknown>,
) => (action: Action<C>) => {
  registerHook(action, 'error', callback as any);
};

export default /* @__PURE__ */ appendExtension(
  'onError',
  onError,
  'use',
) as WithParsedExtension<typeof onError, {
  onError<C extends {}, E extends {}>(
    this: Action<C, E>,
    callback: (event: { context: C; error: unknown; }) => Awaitable<unknown>,
  ): Action<C, E>;
}>;
