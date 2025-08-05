import onRunning from '@foscia/core/actions/context/enhancers/hooks/onRunning';
import onSuccess from '@foscia/core/actions/context/enhancers/hooks/onSuccess';
import { Action } from '@foscia/core/actions/types';
import runAsyncHooks from '@foscia/core/hooks/runAsyncHooks';
import { ModelHooksDefinitionForInstance, ModelInstance } from '@foscia/core/models/oldTypes';
import markSynced from '@foscia/core/models/snapshots/markSynced';
import { Arrayable } from '@foscia/shared';

/**
 * Register hooks for a write action (create, update or destroy).
 *
 * @param action
 * @param instance
 * @param runningHooks
 * @param successHooks
 * @param exists
 *
 * @internal
 */
export default function registerWriteActionHooks<C extends {}>(
  action: Action<C>,
  instance: ModelInstance,
  runningHooks: Arrayable<keyof ModelHooksDefinitionForInstance>,
  successHooks: Arrayable<keyof ModelHooksDefinitionForInstance>,
  exists: boolean,
) {
  if (action.$hooks) {
    const snapshot = instance.$original;

    action(
      onRunning(() => runAsyncHooks(instance.$model, runningHooks, instance)),
      onSuccess(async () => {
        // When the original snapshot didn't change, this means the instance
        // haven't been deserialized, so we must mark it synced manually.
        if (instance.$original === snapshot) {
          // eslint-disable-next-line no-param-reassign
          instance.$exists = exists;
          markSynced(instance);
        }

        await runAsyncHooks(instance.$model, successHooks, instance);
      }),
    );
  }
}
