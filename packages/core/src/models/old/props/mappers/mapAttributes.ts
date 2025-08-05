import isAttribute from '@foscia/core/models/old/props/checks/isAttribute';
import mapProps from '@foscia/core/models/old/props/mappers/mapProps';
import { Model, ModelAttribute } from '@foscia/core/models/oldTypes';

/**
 * Map all attributes of a model.
 *
 * @param model
 * @param callback
 *
 * @category Utilities
 */
export default <M extends Model, R>(
  model: M,
  callback: (prop: ModelAttribute) => R,
) => mapProps(
  model,
  callback as any,
  isAttribute,
);
