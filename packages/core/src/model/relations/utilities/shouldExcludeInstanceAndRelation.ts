import { ModelInstance, ModelRelationDotKey, ModelRelationKey } from '@foscia/core/model/types';

export default <I extends ModelInstance>(
  instance: I,
  relation: ModelRelationKey<I>,
  nested: string[],
  exclude: (instance: I, relation: ModelRelationDotKey<I>) => boolean,
) => (nested.some(
  (r) => exclude(instance, `${relation}${r}` as ModelRelationDotKey<I>),
) || (
  !nested.length && exclude(instance, relation as ModelRelationDotKey<I>)
));
