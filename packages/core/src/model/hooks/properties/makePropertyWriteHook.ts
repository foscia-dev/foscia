import registerHook from '@foscia/core/hooks/registerHook';
import {
  Model,
  ModelComposable,
  ModelFactory,
  ModelInstance,
  ModelInstancePropertyWriteHookCallback,
  ModelValues,
} from '@foscia/core/model/types';

export default (hook: 'write' | 'writing'): {
  <D extends {}, I extends ModelInstance<D>, V extends ModelValues<D>, K extends keyof D & keyof V>(
    model: Model<D, I>,
    callback: (event: { instance: I; def: D[K]; prev?: V[K]; next: V[K] }) => unknown,
  ): () => void;
  <D extends {}, I extends ModelInstance<D>, V extends ModelValues<D>, K extends keyof D & keyof V>(
    model: Model<D, I>,
    key: K,
    callback: (event: { instance: I; def: D[K]; prev?: V[K]; next: V[K] }) => unknown,
  ): () => void;
  <D extends {}, V extends ModelValues<D>, K extends keyof D & keyof V>(
    model: ModelComposable<D>,
    callback: (event: {
      instance: ModelInstance<D>;
      def: D[K];
      prev?: V[K];
      next: V[K]
    }) => unknown,
  ): () => void;
  <D extends {}, V extends ModelValues<D>, K extends keyof D & keyof V>(
    model: ModelComposable<D>,
    key: K,
    callback: (event: {
      instance: ModelInstance<D>;
      def: D[K];
      prev?: V[K];
      next: V[K]
    }) => unknown,
  ): () => void;
  <D extends {}, V extends ModelValues<D>, K extends keyof D & keyof V>(
    model: ModelFactory<D>,
    callback: (event: {
      instance: ModelInstance<D>;
      def: D[K];
      prev?: V[K];
      next: V[K]
    }) => unknown,
  ): () => void;
  <D extends {}, V extends ModelValues<D>, K extends keyof D & keyof V>(
    model: ModelFactory<D>,
    key: K,
    callback: (event: {
      instance: ModelInstance<D>;
      def: D[K];
      prev?: V[K];
      next: V[K]
    }) => unknown,
  ): () => void;
} => (
  model: any,
  key: string | ModelInstancePropertyWriteHookCallback,
  callback?: ModelInstancePropertyWriteHookCallback,
) => (
  typeof key === 'string'
    ? registerHook(model, `property:${hook}:${key}`, callback!)
    : registerHook(model, `property:${hook}`, key)
);
