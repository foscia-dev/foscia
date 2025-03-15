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
  callback: (prop: P) => R,
  predicate?: (prop: ModelProp) => prop is P,
) => mapWithKeys(model.$schema, (prop, key) => (
  !predicate || predicate(prop) ? { [key]: callback(prop as P) } : {}
));
