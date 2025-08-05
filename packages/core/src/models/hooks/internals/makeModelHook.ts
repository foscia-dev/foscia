import registerHook from '@foscia/core/hooks/registerHook';
import { SyncHookCallback } from '@foscia/core/hooks/types';
import {
  Model,
  ModelClassDecoratorFactory,
  ModelComposable,
  ModelComposableDecorator,
  ModelHooksDefinition,
  ModelUsing,
} from '@foscia/core/models/types';
import { AwaitableVoid } from '@foscia/shared';

/**
 * Create a model hook registration function.
 *
 * @param hook
 *
 * @internal
 */
export default (hook: keyof ModelHooksDefinition): {
  <M extends Model>(
    model: M,
    callback: (model: M) => void,
  ): () => void;
  <C extends ModelComposable>(
    composable: C,
    callback: (model: ModelUsing<C>) => void,
  ): () => void;
  <C extends ModelComposableDecorator>(
    factory: ModelClassDecoratorFactory<C>,
    callback: (model: ModelUsing<C>) => void,
  ): () => void;
} => (
  model: any,
  callback: (model: any) => AwaitableVoid,
) => registerHook(model, hook, callback as SyncHookCallback<Model>);
