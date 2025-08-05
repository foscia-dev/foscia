import FosciaError from '@foscia/core/errors/fosciaError';
import isModelPrimary from '@foscia/core/models/definition/utilities/isModelPrimary';
import {
  Model,
  ModelInstance,
  ModelPrimaryRawValues,
  ModelPrimaryValues,
} from '@foscia/core/models/types';

/**
 * Parse the raw primary values to a primary dictionary for instance.
 *
 * @param model
 * @param primary
 *
 * @category Utilities
 */
export default function primaryValues<I extends ModelInstance>(
  model: Model<I>,
  primary: ModelPrimaryRawValues<I>,
): Partial<ModelPrimaryValues<I>> {
  if (primary && typeof primary === 'object') {
    return primary;
  }

  const props = [...model.$schema.values().filter(isModelPrimary)];
  if (props.length === 0) {
    throw new FosciaError(
      `Model \`${model.$type}\` does not have a primary property.`,
    );
  }

  if (props.length > 1) {
    throw new FosciaError(
      `Primary value cannot be passed as an anonymous value, because model \`${model.$type}\` have multiple primary properties.`,
    );
  }

  return { [props[0].key]: primary } as ModelPrimaryValues<I>;
}
