import isIdDef from '@foscia/core/model/checks/isIdDef';
import mapProps from '@foscia/core/model/props/mappers/mapProps';
import { ModelId, ModelInstance, ModelKey } from '@foscia/core/model/types';

export default <I extends ModelInstance, R>(
  instance: I,
  callback: (def: ModelId<ModelKey<I>>) => R,
) => mapProps(
  instance,
  callback as any,
  (def) => isIdDef(def),
) as R[];
