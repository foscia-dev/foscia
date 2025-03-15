import consumeSerializer from '@foscia/core/actions/context/consumers/consumeSerializer';
import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
import takeSnapshot from '@foscia/core/model/snapshots/takeSnapshot';
import {
  ModelInstance,
  ModelRelation,
  ModelRelationKey,
  ModelValues,
} from '@foscia/core/model/types';
import { mapArrayable } from '@foscia/shared';

/**
 * Serialize the given relation's value to a serialized dataset.
 *
 * @param action
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
  action: Action<ConsumeSerializer<Record, Related, Data>>,
  instance: I,
  relation: K,
  value: ModelValues<I>[K],
) => {
  const serializer = await consumeSerializer(action);

  return serializer.serializeToData(
    await serializer.serializeToRelatedRecords(
      takeSnapshot(instance),
      instance.$model.$schema[relation] as ModelRelation,
      await mapArrayable(
        value,
        (related) => takeSnapshot(related as unknown as ModelInstance),
      ),
      action,
    ),
    action,
  );
};
