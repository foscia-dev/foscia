import { Model, ModelInstance, StrictModel, StrictModelInstance } from '@foscia/core/models/types';

/**
 * Get a strict variant of instance.
 *
 * @param instance
 *
 * @internal
 */
function strictOf<I extends ModelInstance>(instance: I): StrictModelInstance<I>;
/**
 * Get a strict variant of model.
 *
 * @param model
 *
 * @internal
 */
function strictOf<I extends ModelInstance>(model: Model<I>): StrictModel<I>;

function strictOf(
  value: ModelInstance | Model,
): StrictModelInstance<any> | StrictModel<any> {
  return value;
}

export default strictOf;
