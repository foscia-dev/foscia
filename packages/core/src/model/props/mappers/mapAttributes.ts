import isAttributeDef from '@foscia/core/model/checks/isAttributeDef';
import mapProps from '@foscia/core/model/props/mappers/mapProps';
import { ModelAttribute, ModelInstance, ModelKey } from '@foscia/core/model/types';

export default function mapAttributes<I extends ModelInstance, R>(
  instance: I,
  callback: (def: ModelAttribute<ModelKey<I>>) => R,
) {
  return mapProps(
    instance,
    callback as any,
    (def) => isAttributeDef(def),
  ) as R[];
}
