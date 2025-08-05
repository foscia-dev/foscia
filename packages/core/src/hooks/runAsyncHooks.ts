import { Hookable, HookCallback, HooksDefinition } from '@foscia/core/hooks/types';
import { Arrayable, sequential, wrap } from '@foscia/shared';

/**
 * Run one or more asynchronous hooks on a hookable object, sequentially.
 *
 * @param hookable
 * @param hooks
 * @param event
 *
 * @internal
 */
export default async function runAsyncHooks<D extends HooksDefinition, K extends keyof D>(
  hookable: Hookable<D>,
  hooks: Arrayable<K>,
  event: D[K] extends HookCallback<infer E> ? E : never,
) {
  await sequential(wrap(hooks).map(
    (hook) => () => sequential((hookable.$hooks?.[hook] ?? []).map(
      (callback) => () => callback(event),
    )),
  ));
}
