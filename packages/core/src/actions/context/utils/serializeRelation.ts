import consumeSerializer from '@foscia/core/actions/context/consumers/consumeSerializer';
import { ConsumeSerializer } from '@foscia/core/actions/types';
import {
  InferModelSchemaProp,
  InferModelValuePropType,
  ModelInstance,
  ModelRelation,
  ModelRelationKey,
} from '@foscia/core/model/types';
import { Arrayable, using } from '@foscia/shared';

/**
 * Serialize the given relation's value to a serialized dataset.
 *
 * @param context
 * @param instance
 * @param relation
 * @param value
 *
 * @internal
 */
export default async <
  I extends ModelInstance,
  K extends string,
  R extends InferModelSchemaProp<I, K, ModelRelation>,
  Record,
  Related,
  Data,
>(
  context: ConsumeSerializer<Record, Related, Data>,
  instance: I,
  relation: K & ModelRelationKey<I>,
  value: InferModelValuePropType<R>,
) => using(await consumeSerializer(context), async (serializer) => serializer.serialize(
  await serializer.serializeRelation(
    instance,
    instance.$model.$schema[relation] as R,
    value as Arrayable<ModelInstance> | null,
    context,
  ),
  context,
));
