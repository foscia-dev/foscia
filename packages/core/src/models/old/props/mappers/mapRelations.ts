import isRelation from '@foscia/core/relations/checks/isRelation';
import mapProps from '@foscia/core/models/old/props/mappers/mapProps';
import { Model, ModelRelation } from '@foscia/core/models/oldTypes';

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
