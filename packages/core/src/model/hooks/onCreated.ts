import registerHook from '@foscia/core/hooks/registerHook';
import { Model, ModelInstance, ModelInstanceHookCallback } from '@foscia/core/model/types';
import { Awaitable } from '@foscia/shared';

export default <I extends ModelInstance>(
  model: Model<any, I>,
  callback: (instance: I) => Awaitable<unknown>,
) => registerHook(model, 'created', callback as ModelInstanceHookCallback);
