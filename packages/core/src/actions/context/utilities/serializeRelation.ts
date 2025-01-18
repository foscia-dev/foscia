import consumeSerializer from '@foscia/core/actions/context/consumers/consumeSerializer';
import { ConsumeSerializer } from '@foscia/core/actions/types';
import takeSnapshot from '@foscia/core/model/snapshots/takeSnapshot';
import {
  InferModelSchemaProp,
  InferModelValuePropType,
  ModelInstance,
  ModelRelation,
  ModelRelationKey,
} from '@foscia/core/model/types';
import { mapArrayable, using } from '@foscia/shared';

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
) => using(await consumeSerializer(context), async (serializer) => serializer.serializeToData(
  await serializer.serializeToRelatedRecords(
    takeSnapshot(instance),
    instance.$model.$schema[relation] as R,
    await mapArrayable(
      value,
      (related) => takeSnapshot(related as unknown as ModelInstance),
    ),
    context,
  ),
  context,
));
