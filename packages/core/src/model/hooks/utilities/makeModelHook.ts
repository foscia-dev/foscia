import registerHook from '@foscia/core/hooks/registerHook';
import { SyncHookCallback } from '@foscia/core/hooks/types';
import {
  Model,
  ModelComposableFactory,
  ModelFactory,
  ModelHooksDefinition,
  ModelInstance,
  ModelUsing,
} from '@foscia/core/model/types';
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
  <C extends ModelComposableFactory>(
    composable: C,
    callback: (model: ModelUsing<C>) => void,
  ): () => void;
  <D extends {}>(
    factory: ModelFactory<D>,
    callback: (model: Model<D, ModelInstance<D>>) => void,
  ): () => void;
} => (
  model: any,
  callback: (model: any) => AwaitableVoid,
) => registerHook(model, hook, callback as SyncHookCallback<Model>);
