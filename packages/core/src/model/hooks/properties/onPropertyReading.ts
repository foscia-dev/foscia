import registerHook from '@foscia/core/hooks/registerHook';
import {
  Model,
  ModelInstance,
  ModelInstancePropertyReadHookCallback,
  ModelValues,
} from '@foscia/core/model/types';

function onPropertyReading<
  D extends {},
  I extends ModelInstance<D>,
  V extends ModelValues<D>,
  K extends keyof D & keyof V,
>(
  model: Model<D, I>,
  callback: (event: { instance: I; def: D[K]; value: V[K] | undefined }) => void,
): () => void;

function onPropertyReading<
  D extends {},
  I extends ModelInstance<D>,
  V extends ModelValues<D>,
  K extends keyof D & keyof V,
>(
  model: Model<D, I>,
  key: K,
  callback: (event: { instance: I; def: D[K]; value: V[K] | undefined }) => void,
): () => void;

function onPropertyReading<I extends ModelInstance>(
  model: Model<any, I>,
  key: string | ModelInstancePropertyReadHookCallback,
  callback?: ModelInstancePropertyReadHookCallback,
) {
  return typeof key === 'string'
    ? registerHook(model, `property:reading:${key}`, callback!)
    : registerHook(model, 'property:reading', key);
}

export default onPropertyReading;
