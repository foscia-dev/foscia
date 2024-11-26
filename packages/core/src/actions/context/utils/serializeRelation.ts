import serializeWith from '@foscia/core/actions/context/utils/serializeWith';
import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
import {
  InferModelSchemaProp,
  InferModelValuePropType,
  ModelInstance,
  ModelRelation,
  ModelRelationKey,
} from '@foscia/core/model/types';
import { Arrayable } from '@foscia/shared';

export default <
  C extends {},
  I extends ModelInstance,
  K extends string,
  R extends InferModelSchemaProp<I, K, ModelRelation>,
  Record,
  Related,
  Data,
>(
  action: Action<C & ConsumeSerializer<Record, Related, Data>>,
  instance: I,
  relation: K & ModelRelationKey<I>,
  value: InferModelValuePropType<R>,
) => serializeWith(action, async (serializer, context) => serializer.serialize(
  await serializer.serializeRelation(
    instance,
    instance.$model.$schema[relation] as R,
    value as Arrayable<ModelInstance> | null,
    context,
  ),
  context,
));
