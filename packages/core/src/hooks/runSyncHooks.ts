import { Hookable, HookCallback, HooksDefinition } from '@foscia/core/hooks/types';
import { Arrayable, wrap } from '@foscia/shared';

/**
 * Run one or more synchronous hooks on a hookable object, sequentially.
 *
 * @param hookable
 * @param hooks
 * @param event
 *
 * @internal
 */
export default function runSyncHooks<D extends HooksDefinition, K extends keyof D>(
  hookable: Hookable<D>,
  hooks: Arrayable<K>,
  event: D[K] extends HookCallback<infer E> ? E : never,
) {
  wrap(hooks).forEach(
    (hook) => (hookable.$hooks?.[hook] ?? []).map(
      (callback) => callback(event),
    ),
  );
}
