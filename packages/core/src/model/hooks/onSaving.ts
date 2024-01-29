import registerHook from '@foscia/core/hooks/registerHook';
import { Model, ModelInstance, ModelInstanceHookCallback } from '@foscia/core/model/types';
import { Awaitable } from '@foscia/shared';

export default function onSaving<I extends ModelInstance>(
  model: Model<any, I>,
  callback: (instance: I) => Awaitable<void>,
) {
  return registerHook(model, 'saving', callback as ModelInstanceHookCallback);
}
