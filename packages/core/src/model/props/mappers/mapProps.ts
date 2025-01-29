import { Model, ModelProp } from '@foscia/core/model/types';
import { mapWithKeys } from '@foscia/shared';

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
) => mapWithKeys(model.$schema, (def, key) => (
  !predicate || predicate(def) ? { [key]: callback(def as P) } : {}
));
