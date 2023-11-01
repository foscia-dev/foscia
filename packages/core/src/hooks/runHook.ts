import { Hookable, HookCallback, HooksDefinition } from '@foscia/core/hooks/types';
import { sequentialTransform } from '@foscia/shared';

export default async function runHook<D extends HooksDefinition, K extends keyof D>(
  hookable: Hookable<D>,
  key: K,
  event: D[K] extends HookCallback<infer E> ? E : never,
) {
  if (hookable.$hooks === null) {
    return;
  }

  const hookCallbacks = hookable.$hooks[key] ?? [];

  await sequentialTransform(
    hookCallbacks.map((callback) => async () => {
      await callback(event);
    }),
  );
}
