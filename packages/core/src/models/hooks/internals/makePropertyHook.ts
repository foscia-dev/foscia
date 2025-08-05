import registerHook from '@foscia/core/hooks/registerHook';
import { Hookable } from '@foscia/core/hooks/types';
import {
  Model,
  ModelClassDecoratorFactory,
  ModelComposable,
  ModelComposableDecorator,
  ModelHooksDefinition,
  ModelInstance,
  ModelInstancePropertyReadHookCallback,
  ModelInstancePropertyWriteHookCallback,
  ModelInstanceUsing,
  ModelKey,
  ModelProp,
} from '@foscia/core/models/types';

/**
 * Create a model property hook registration function.
 *
 * @param hook
 *
 * @internal
 */
const makePropertyHook: {
  (hook: 'write' | 'writing'): {
    <
      I extends ModelInstance,
      K extends ModelKey<I>,
      P extends ModelProp<I[K], I>,
    >(
      model: Model<I>,
      callback: (event: { instance: I; prop: P; prev?: I[K]; next: I[K]; }) => void,
    ): () => void;
    <
      I extends ModelInstance,
      K extends ModelKey<I>,
      P extends ModelProp<I[K], I>,
    >(
      model: Model<I>,
      key: K,
      callback: (event: { instance: I; prop: P; prev?: I[K]; next: I[K]; }) => void,
    ): () => void;
    <
      C extends ModelComposable,
      I extends ModelInstanceUsing<C>,
      K extends ModelKey<I>,
      P extends ModelProp<I[K], I>,
    >(
      composable: C,
      callback: (event: { instance: I; prop: P; prev?: I[K]; next: I[K]; }) => void,
    ): () => void;
    <
      C extends ModelComposable,
      I extends ModelInstanceUsing<C>,
      K extends ModelKey<I>,
      P extends ModelProp<I[K], I>,
    >(
      composable: C,
      key: K,
      callback: (event: { instance: I; prop: P; prev?: I[K]; next: I[K]; }) => void,
    ): () => void;
    <
      C extends ModelComposableDecorator,
      I extends ModelInstanceUsing<C>,
      K extends ModelKey<I>,
      P extends ModelProp<I[K], I>,
    >(
      factory: ModelClassDecoratorFactory<C>,
      callback: (event: { instance: I; prop: P; prev?: I[K]; next: I[K]; }) => void,
    ): () => void;
    <
      C extends ModelComposableDecorator,
      I extends ModelInstanceUsing<C>,
      K extends ModelKey<I>,
      P extends ModelProp<I[K], I>,
    >(
      factory: ModelClassDecoratorFactory<C>,
      callback: (event: { instance: I; prop: P; prev?: I[K]; next: I[K]; }) => void,
    ): () => void;
  };
  (hook: 'read' | 'reading'): {
    <
      T,
      I extends ModelInstance & Record<K, T>,
      K extends ModelKey<I>,
      P extends ModelProp<I[K], I>,
    >(
      prop: P,
      callback: (event: { instance: I; prop: P; value: I[K]; }) => void,
    ): () => void;
    <
      I extends ModelInstance,
      K extends ModelKey<I>,
      P extends ModelProp<I[K], I>,
    >(
      model: Model<I>,
      callback: (event: { instance: I; prop: P; value: I[K]; }) => void,
    ): () => void;
    <
      I extends ModelInstance,
      K extends ModelKey<I>,
      P extends ModelProp<I[K], I>,
    >(
      model: Model<I>,
      key: K,
      callback: (event: { instance: I; prop: P; value: I[K]; }) => void,
    ): () => void;
    <
      C extends ModelComposable,
      I extends ModelInstanceUsing<C>,
      K extends ModelKey<I>,
      P extends ModelProp<I[K], I>,
    >(
      composable: C,
      callback: (event: { instance: I; prop: P; value: I[K]; }) => void,
    ): () => void;
    <
      C extends ModelComposable,
      I extends ModelInstanceUsing<C>,
      K extends ModelKey<I>,
      P extends ModelProp<I[K], I>,
    >(
      composable: C,
      key: K,
      callback: (event: { instance: I; prop: P; value: I[K]; }) => void,
    ): () => void;
    <
      C extends ModelComposableDecorator,
      I extends ModelInstanceUsing<C>,
      K extends ModelKey<I>,
      P extends ModelProp<I[K], I>,
    >(
      factory: ModelClassDecoratorFactory<C>,
      callback: (event: { instance: I; prop: P; value: I[K]; }) => void,
    ): () => void;
    <
      C extends ModelComposableDecorator,
      I extends ModelInstanceUsing<C>,
      K extends ModelKey<I>,
      P extends ModelProp<I[K], I>,
    >(
      factory: ModelClassDecoratorFactory<C>,
      key: K,
      callback: (event: { instance: I; prop: P; value: I[K]; }) => void,
    ): () => void;
  };
} = (hook) => (
  model: Hookable<ModelHooksDefinition>,
  key: string | ModelInstancePropertyReadHookCallback | ModelInstancePropertyWriteHookCallback,
  callback?: ModelInstancePropertyReadHookCallback | ModelInstancePropertyWriteHookCallback,
) => {
  if (typeof key === 'string') {
    return registerHook(model, `property:${hook}:${key}`, callback!);
  }

  return registerHook(model, `property:${hook}`, key);
};

export default makePropertyHook;
