import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import { Action, WithParsedExtension } from '@foscia/core/actions/types';
import registerHook from '@foscia/core/hooks/registerHook';
import { Awaitable } from '@foscia/shared';

/**
 * Register a "finally" hook callback on action.
 * Callback may be async.
 *
 * @param callback
 *
 * @category Enhancers
 */
const onFinally = <C extends {}>(
  callback: (event: { context: C; }) => Awaitable<unknown>,
) => (action: Action<C>) => {
  registerHook(action, 'finally', callback as any);
};

export default /* @__PURE__ */ appendExtension(
  'onFinally',
  onFinally,
  'use',
) as WithParsedExtension<typeof onFinally, {
  onFinally<C extends {}, E extends {}>(
    this: Action<C, E>,
    callback: (event: { context: C; }) => Awaitable<unknown>,
  ): Action<C, E>;
}>;
