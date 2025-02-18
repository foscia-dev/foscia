import isAttributeDef from '@foscia/core/model/props/checks/isAttributeDef';
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
  callback: (def: ModelAttribute) => R,
) => mapProps(
  model,
  callback as any,
  isAttributeDef,
);
