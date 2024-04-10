import serializeWith from '@foscia/core/actions/context/utils/serializeWith';
import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';
import { Arrayable } from '@foscia/shared';

export default function serializeRelation<C extends {}, Record, Related, Data>(
  action: Action<C & ConsumeSerializer<Record, Related, Data>>,
  instance: ModelInstance,
  relation: string,
  value: Arrayable<ModelInstance> | null,
) {
  return serializeWith(action, async (serializer, context) => serializer.serialize(
    await serializer.serializeRelation(
      instance,
      instance.$model.$schema[relation],
      value,
      context,
    ),
    context,
  ));
}
