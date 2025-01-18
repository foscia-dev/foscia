import isRelationDef from '@foscia/core/model/checks/isRelationDef';
import mapProps from '@foscia/core/model/props/mappers/mapProps';
import { Model, ModelKey, ModelRelation } from '@foscia/core/model/types';

/**
 * Map all relations of a model.
 *
 * @param model
 * @param callback
 *
 * @category Utilities
 */
export default <M extends Model, R>(
  model: M,
  callback: (def: ModelRelation<ModelKey<M>>) => R,
) => mapProps(
  model,
  callback as any,
  isRelationDef,
) as R[];
