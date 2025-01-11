import { ModelInstance, ModelProp } from '@foscia/core/model/types';
import { tap } from '@foscia/shared';

/**
 * Map all properties of an instance.
 *
 * @param instance
 * @param callback
 * @param predicate
 *
 * @internal
 */
export default <I extends ModelInstance, R, P extends ModelProp = ModelProp>(
  instance: I,
  callback: (def: P) => R,
  predicate?: (def: ModelProp) => def is P,
) => Object.values(instance.$model.$schema).reduce((stack, def) => tap(stack, () => {
  if (!predicate || predicate(def)) {
    stack.push(callback(def as P));
  }
}), [] as R[]);
