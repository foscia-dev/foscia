import registerHook from '@foscia/core/hooks/registerHook';
import { HookCallback, SyncHookCallback } from '@foscia/core/hooks/types';
import {
  Model,
  ModelClassDecoratorFactory,
  ModelComposable,
  ModelComposableDecorator,
  ModelHooksDefinition,
  ModelInstance,
  ModelInstanceUsing,
} from '@foscia/core/models/types';
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
    model: Model<I>,
    callback: (instance: I) => R,
  ): () => void;
  <C extends ModelComposable>(
    composable: C,
    callback: (instance: ModelInstanceUsing<C>) => R,
  ): () => void;
  <C extends ModelComposableDecorator>(
    factory: ModelClassDecoratorFactory<C>,
    callback: (instance: ModelInstanceUsing<C>) => R,
  ): () => void;
} => (
  model: any,
  callback: (instance: any) => R,
) => registerHook(
  model,
  hook,
  callback as HookCallback<ModelInstance> | SyncHookCallback<ModelInstance>,
);
