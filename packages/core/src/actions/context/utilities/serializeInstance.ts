import consumeSerializer from '@foscia/core/actions/context/consumers/consumeSerializer';
import { ConsumeSerializer } from '@foscia/core/actions/types';
import takeSnapshot from '@foscia/core/model/snapshots/takeSnapshot';
import { ModelInstance } from '@foscia/core/model/types';
import { using } from '@foscia/shared';

/**
 * Serialize the given instance to a serialized dataset.
 *
 * @param context
 * @param instance
 *
 * @internal
 */
export default async <Record, Related, Data>(
  context: ConsumeSerializer<Record, Related, Data>,
  instance: ModelInstance,
) => using(await consumeSerializer(context), async (serializer) => serializer.serializeToData(
  await serializer.serializeToRecords(takeSnapshot(instance), context),
  context,
));
