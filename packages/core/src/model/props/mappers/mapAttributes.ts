import isAttributeDef from '@foscia/core/model/checks/isAttributeDef';
import mapProps from '@foscia/core/model/props/mappers/mapProps';
import { ModelAttribute, ModelInstance, ModelKey } from '@foscia/core/model/types';

export default <I extends ModelInstance, R>(
  instance: I,
  callback: (def: ModelAttribute<ModelKey<I>>) => R,
) => mapProps(
  instance,
  callback as any,
  isAttributeDef,
) as R[];
