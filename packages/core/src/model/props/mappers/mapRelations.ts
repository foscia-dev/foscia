import isRelationDef from '@foscia/core/model/checks/isRelationDef';
import mapProps from '@foscia/core/model/props/mappers/mapProps';
import { ModelInstance, ModelKey, ModelRelation } from '@foscia/core/model/types';

export default <I extends ModelInstance, R>(
  instance: I,
  callback: (def: ModelRelation<ModelKey<I>>) => R,
) => mapProps(
  instance,
  callback as any,
  (def) => isRelationDef(def),
) as R[];
