import isIdDef from '@foscia/core/model/checks/isIdDef';
import mapProps from '@foscia/core/model/props/mappers/mapProps';
import { ModelId, ModelInstance, ModelKey } from '@foscia/core/model/types';

export default function mapIds<I extends ModelInstance, R>(
  instance: I,
  callback: (def: ModelId<ModelKey<I>>) => R,
) {
  return mapProps(
    instance,
    callback as any,
    (def) => isIdDef(def),
  ) as R[];
}
