import isAttributeDef from '@foscia/core/model/checks/isAttributeDef';
import mapProps from '@foscia/core/model/props/mappers/mapProps';
import { Model, ModelAttribute, ModelKey } from '@foscia/core/model/types';

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
  callback: (def: ModelAttribute<ModelKey<M>>) => R,
) => mapProps(
  model,
  callback as any,
  isAttributeDef,
) as R[];
