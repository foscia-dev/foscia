import registerHook from '@foscia/core/hooks/registerHook';
import { SyncHookCallback } from '@foscia/core/hooks/types';
import {
  Model,
  ModelComposable,
  ModelFactory,
  ModelHooksDefinition,
  ModelInstance,
  ModelUsing,
} from '@foscia/core/model/types';

export default (hook: keyof ModelHooksDefinition): {
  <M extends Model>(
    model: M,
    callback: (model: M) => unknown,
  ): () => void;
  <C extends ModelComposable>(
    composable: C,
    callback: (model: ModelUsing<C>) => unknown,
  ): () => void;
  <D extends {}>(
    factory: ModelFactory<D>,
    callback: (model: Model<D, ModelInstance<D>>) => unknown,
  ): () => void;
} => (
  model: any,
  callback: (model: any) => unknown,
) => registerHook(model, hook, callback as SyncHookCallback<Model>);
