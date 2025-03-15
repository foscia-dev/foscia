import consumeSerializer from '@foscia/core/actions/context/consumers/consumeSerializer';
import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
import takeSnapshot from '@foscia/core/model/snapshots/takeSnapshot';
import { ModelInstance } from '@foscia/core/model/types';

/**
 * Serialize the given instance to a serialized dataset.
 *
 * @param action
 * @param instance
 *
 * @internal
 */
export default async <Record, Related, Data>(
  action: Action<ConsumeSerializer<Record, Related, Data>>,
  instance: ModelInstance,
) => {
  const serializer = await consumeSerializer(action);

  return serializer.serializeToData(
    await serializer.serializeToRecords(takeSnapshot(instance), action),
    action,
  );
};
