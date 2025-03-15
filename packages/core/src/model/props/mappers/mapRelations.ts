import isRelation from '@foscia/core/model/props/checks/isRelation';
import mapProps from '@foscia/core/model/props/mappers/mapProps';
import { Model, ModelRelation } from '@foscia/core/model/types';

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
  callback: (prop: ModelRelation) => R,
) => mapProps(
  model,
  callback as any,
  isRelation,
);
