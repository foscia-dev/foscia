import { ModelInstance, ModelProp } from '@foscia/core/model/types';

export default <I extends ModelInstance, R, P extends ModelProp = ModelProp>(
  instance: I,
  callback: (def: P) => R,
  predicate?: (def: ModelProp) => def is P,
) => Object.values(instance.$model.$schema).reduce((stack, def) => {
  if (!predicate || predicate(def)) {
    stack.push(callback(def as P));
  }

  return stack;
}, [] as R[]);
