import registerHook from '@foscia/core/hooks/registerHook';
import { Model, ModelInstance, ModelInstanceHookCallback } from '@foscia/core/model/types';
import { Awaitable } from '@foscia/shared';

export default function onUpdated<I extends ModelInstance>(
  model: Model<any, I>,
  callback: (instance: I) => Awaitable<void>,
) {
  return registerHook(model, 'updated', callback as ModelInstanceHookCallback);
}
