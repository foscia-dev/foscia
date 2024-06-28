import registerHook from '@foscia/core/hooks/registerHook';
import {
  Model,
  ModelInstance,
  ModelInstancePropertyReadHookCallback,
  ModelValues,
} from '@foscia/core/model/types';

const onPropertyReading: {
  <
    D extends {},
    I extends ModelInstance<D>,
    V extends ModelValues<D>,
    K extends keyof D & keyof V,
  >(
    model: Model<D, I>,
    callback: (event: { instance: I; def: D[K]; value: V[K] | undefined }) => unknown,
  ): () => void;
  <
    D extends {},
    I extends ModelInstance<D>,
    V extends ModelValues<D>,
    K extends keyof D & keyof V,
  >(
    model: Model<D, I>,
    key: K,
    callback: (event: { instance: I; def: D[K]; value: V[K] | undefined }) => unknown,
  ): () => void;
} = <I extends ModelInstance>(
  model: Model<any, I>,
  key: string | ModelInstancePropertyReadHookCallback,
  callback?: ModelInstancePropertyReadHookCallback,
) => (
  typeof key === 'string'
    ? registerHook(model, `property:reading:${key}`, callback!)
    : registerHook(model, 'property:reading', key)
);

export default onPropertyReading;
