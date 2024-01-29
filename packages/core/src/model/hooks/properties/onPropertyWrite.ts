import registerHook from '@foscia/core/hooks/registerHook';
import {
  Model,
  ModelInstance,
  ModelInstancePropertyWriteHookCallback,
  ModelValues,
} from '@foscia/core/model/types';

function onPropertyWrite<
  D extends {},
  I extends ModelInstance<D>,
  V extends ModelValues<D>,
  K extends keyof D & keyof V,
>(
  model: Model<D, I>,
  callback: (event: { instance: I; def: D[K]; prev: V[K] | undefined; next: V[K] }) => void,
): () => void;

function onPropertyWrite<
  D extends {},
  I extends ModelInstance<D>,
  V extends ModelValues<D>,
  K extends keyof D & keyof V,
>(
  model: Model<D, I>,
  key: K,
  callback: (event: { instance: I; def: D[K]; prev: V[K] | undefined; next: V[K] }) => void,
): () => void;

function onPropertyWrite<I extends ModelInstance>(
  model: Model<any, I>,
  key: string | ModelInstancePropertyWriteHookCallback,
  callback?: ModelInstancePropertyWriteHookCallback,
) {
  return typeof key === 'string'
    ? registerHook(model, `property:write:${key}`, callback!)
    : registerHook(model, 'property:write', key);
}

export default onPropertyWrite;
