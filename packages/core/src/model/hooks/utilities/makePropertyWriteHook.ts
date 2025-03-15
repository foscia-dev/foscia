import registerHook from '@foscia/core/hooks/registerHook';
import {
  InferModelSchemaProp,
  Model,
  ModelComposable,
  ModelComposableFactory,
  ModelFactory,
  ModelInstance,
  ModelInstancePropertyWriteHookCallback,
  ModelInstanceUsing,
  ModelValues,
} from '@foscia/core/model/types';

/**
 * Create a property write/writing hook registration function.
 *
 * @param hook
 *
 * @internal
 */
export default (hook: 'write' | 'writing'): {
  <
    D extends {},
    I extends ModelInstance<D>,
    V extends ModelValues<D>,
    K extends keyof V,
    P extends InferModelSchemaProp<I, K>,
  >(
    model: Model<D, I>,
    callback: (event: { instance: I; prop: P; prev?: V[K]; next: V[K] }) => void,
  ): () => void;
  <
    D extends {},
    I extends ModelInstance<D>,
    V extends ModelValues<D>,
    K extends keyof V,
    P extends InferModelSchemaProp<I, K>,
  >(
    model: Model<D, I>,
    key: K,
    callback: (event: { instance: I; prop: P; prev?: V[K]; next: V[K] }) => void,
  ): () => void;
  <
    C extends ModelComposable,
    V extends ModelValues<ModelInstanceUsing<C>>,
    K extends keyof V,
    P extends InferModelSchemaProp<ModelInstanceUsing<C>, K>,
  >(
    composable: ModelComposableFactory<C>,
    callback: (event: {
      instance: ModelInstanceUsing<C>;
      prop: P;
      prev?: V[K];
      next: V[K]
    }) => void,
  ): () => void;
  <
    C extends ModelComposable,
    V extends ModelValues<ModelInstanceUsing<C>>,
    K extends keyof V,
    P extends InferModelSchemaProp<ModelInstanceUsing<C>, K>,
  >(
    composable: ModelComposableFactory<C>,
    key: K,
    callback: (event: {
      instance: ModelInstanceUsing<C>;
      prop: P;
      prev?: V[K];
      next: V[K]
    }) => void,
  ): () => void;
  <
    D extends {},
    V extends ModelValues<D>,
    K extends keyof V,
    P extends InferModelSchemaProp<D, K>,
  >(
    factory: ModelFactory<D>,
    callback: (event: {
      instance: ModelInstance<D>;
      prop: P;
      prev?: V[K];
      next: V[K]
    }) => void,
  ): () => void;
  <
    D extends {},
    V extends ModelValues<D>,
    K extends keyof V,
    P extends InferModelSchemaProp<D, K>,
  >(
    factory: ModelFactory<D>,
    key: K,
    callback: (event: {
      instance: ModelInstance<D>;
      prop: P;
      prev?: V[K];
      next: V[K]
    }) => void,
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
