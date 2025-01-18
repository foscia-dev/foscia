import { Model, ModelProp } from '@foscia/core/model/types';
import { tap } from '@foscia/shared';

/**
 * Map all properties of a model.
 *
 * @param model
 * @param callback
 * @param predicate
 *
 * @internal
 */
export default <M extends Model, R, P extends ModelProp = ModelProp>(
  model: M,
  callback: (def: P) => R,
  predicate?: (def: ModelProp) => def is P,
) => Object.values(model.$schema).reduce((stack, def) => tap(stack, () => {
  if (!predicate || predicate(def)) {
    stack.push(callback(def as P));
  }
}), [] as R[]);
