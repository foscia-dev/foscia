import isAttribute from '@foscia/core/model/props/checks/isAttribute';
import mapProps from '@foscia/core/model/props/mappers/mapProps';
import { Model, ModelAttribute } from '@foscia/core/model/types';

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
