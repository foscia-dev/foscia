import markSynced from '@foscia/core/model/snapshots/markSynced';
import { ModelInferPropValue, ModelInstance, ModelRelation } from '@foscia/core/model/types';

export default <
  I extends ModelInstance,
  R extends ModelRelation,
>(
  instance: I,
  relation: R,
  value: ModelInferPropValue<R>,
) => {
  // eslint-disable-next-line no-param-reassign
  instance[relation.key as keyof I] = value;
  markSynced(instance, relation.key as any);
};
