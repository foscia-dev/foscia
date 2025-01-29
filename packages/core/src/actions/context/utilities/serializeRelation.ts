import consumeSerializer from '@foscia/core/actions/context/consumers/consumeSerializer';
import { ConsumeSerializer } from '@foscia/core/actions/types';
import takeSnapshot from '@foscia/core/model/snapshots/takeSnapshot';
import {
  ModelInstance,
  ModelRelation,
  ModelRelationKey,
  ModelValues,
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
  K extends ModelRelationKey<I>,
  Record,
  Related,
  Data,
>(
  context: ConsumeSerializer<Record, Related, Data>,
  instance: I,
  relation: K,
  value: ModelValues<I>[K],
) => using(await consumeSerializer(context), async (serializer) => serializer.serializeToData(
  await serializer.serializeToRelatedRecords(
    takeSnapshot(instance),
    instance.$model.$schema[relation] as ModelRelation,
    await mapArrayable(
      value,
      (related) => takeSnapshot(related as unknown as ModelInstance),
    ),
    context,
  ),
  context,
));
