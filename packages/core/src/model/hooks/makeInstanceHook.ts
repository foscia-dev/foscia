import registerHook from '@foscia/core/hooks/registerHook';
import { HookCallback, SyncHookCallback } from '@foscia/core/hooks/types';
import {
  Model,
  ModelComposable,
  ModelFactory,
  ModelHooksDefinition,
  ModelInstance,
  ModelInstanceUsing,
} from '@foscia/core/model/types';

/**
 * Create an instance hook registration function.
 *
 * @param hook
 *
 * @internal
 */
export default (hook: keyof ModelHooksDefinition): {
  <I extends ModelInstance>(
    model: Model<any, I>,
    callback: (instance: I) => unknown,
  ): () => void;
  <C extends ModelComposable>(
    composable: C,
    callback: (instance: ModelInstanceUsing<C>) => unknown,
  ): () => void;
  <D extends {}>(
    factory: ModelFactory<D>,
    callback: (instance: ModelInstance<D>) => unknown,
  ): () => void;
} => (
  model: any,
  callback: (instance: any) => unknown,
) => registerHook(
  model,
  hook,
  callback as HookCallback<ModelInstance> | SyncHookCallback<ModelInstance>,
);
