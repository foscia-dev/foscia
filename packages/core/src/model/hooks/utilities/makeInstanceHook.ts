import registerHook from '@foscia/core/hooks/registerHook';
import { HookCallback, SyncHookCallback } from '@foscia/core/hooks/types';
import {
  Model,
  ModelComposableFactory,
  ModelFactory,
  ModelHooksDefinition,
  ModelInstance,
  ModelInstanceUsing,
} from '@foscia/core/model/types';
import { AwaitableVoid } from '@foscia/shared';

/**
 * Create an instance hook registration function.
 *
 * @param hook
 *
 * @internal
 */
export default <R extends AwaitableVoid | void = AwaitableVoid>(hook: keyof ModelHooksDefinition): {
  <I extends ModelInstance>(
    model: Model<any, I>,
    callback: (instance: I) => R,
  ): () => void;
  <C extends ModelComposableFactory>(
    composable: C,
    callback: (instance: ModelInstanceUsing<C>) => R,
  ): () => void;
  <D extends {}>(
    factory: ModelFactory<D>,
    callback: (instance: ModelInstance<D>) => R,
  ): () => void;
} => (
  model: any,
  callback: (instance: any) => R,
) => registerHook(
  model,
  hook,
  callback as HookCallback<ModelInstance> | SyncHookCallback<ModelInstance>,
);
