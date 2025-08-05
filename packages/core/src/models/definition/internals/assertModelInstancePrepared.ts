import FosciaError from '@foscia/core/errors/fosciaError';
import makeObjectPropertyDefiner
  from '@foscia/core/models/definition/internals/makeObjectPropertyDefiner';
import isInstance from '@foscia/core/models/definition/utilities/isInstance';
import isModel from '@foscia/core/models/definition/utilities/isModel';
import { Model, ModelInstance } from '@foscia/core/models/types';
import { SYMBOL_MODEL_INSTANCE, SYMBOL_MODEL_SNAPSHOT } from '@foscia/core/symbols';

/**
 * Ensure object is a prepared model instance.
 *
 * @param instance
 *
 * @internal
 */
export default function assertModelInstancePrepared(
  instance: object,
): asserts instance is ModelInstance {
  if (!isInstance(instance)) {
    const model = instance.constructor;
    if (!isModel(model)) {
      throw new FosciaError('`model` decorator must be used on a model class.');
    }

    if (!model.$booted && !model.$introspecting) {
      model.$introspecting = true;

      const defineModelProperty = makeObjectPropertyDefiner<Model>(model);
      defineModelProperty('$schema', new Map());
    }

    const defineInstanceProperty = makeObjectPropertyDefiner<ModelInstance>(instance);

    defineInstanceProperty('$FOSCIA_TYPE', SYMBOL_MODEL_INSTANCE);
    defineInstanceProperty('$model', model);
    defineInstanceProperty('$exists', false, { writable: true });
    defineInstanceProperty('$raw', null, { writable: true });
    defineInstanceProperty('$values', new Map<never, never>());
    defineInstanceProperty('$original', {
      $FOSCIA_TYPE: SYMBOL_MODEL_SNAPSHOT,
      instance: instance as ModelInstance,
      original: null,
      exists: false,
      raw: null,
      values: new Map<never, never>(),
      loaded: new Set<never>(),
    }, { writable: true });
    defineInstanceProperty('$loaded', new Set<never>());
    defineInstanceProperty('$initializers', new Set());
  }
}
