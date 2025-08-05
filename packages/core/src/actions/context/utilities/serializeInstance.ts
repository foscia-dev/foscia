import consumeSerializer from '@foscia/core/actions/context/consumers/consumeSerializer';
import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
import takeSnapshot from '@foscia/core/models/snapshots/takeSnapshot';
import { ModelInstance } from '@foscia/core/models/oldTypes';

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
    await serializer.serialize(takeSnapshot(instance), action),
    action,
  );
};
