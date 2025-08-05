import consumeInstance from '@foscia/core/actions/context/consumers/consumeInstance';
import all, { RetypedDeserializedData } from '@foscia/core/actions/context/runners/all';
import { OneData } from '@foscia/core/actions/context/runners/oneOr';
import {
  Action,
  ConsumeActionAdapter,
  ConsumeDeserializer,
  ConsumeModelInstance,
  InferActionInstance,
} from '@foscia/core/actions/types';
import makeRunner from '@foscia/core/actions/utilities/makeRunner';
import { ModelInstance } from '@foscia/core/models/oldTypes';
import { DataDeserializerResult } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

/**
 * Run the action and deserialize one model's instance.
 * Returns current instance when facing an empty result (such as
 * a 204 response).
 *
 * @category Runners
 * @requireContext adapter, deserializer, model, instance
 * @since 0.13.0
 *
 * @example
 * ```typescript
 * import { save, current } from '@foscia/core';
 *
 * const savedPost = await action(save(post), current());
 * ```
 */
export default makeRunner('current', <
  C extends ConsumeModelInstance<CI>,
  I extends InferActionInstance<C>,
  CI extends ModelInstance,
  RawData,
  Data,
  Deserialized extends DataDeserializerResult,
  Next = I | CI,
>(
  transform?: (data: OneData<Data, RetypedDeserializedData<Deserialized, I>, I>) => Awaitable<Next>,
) => async (
  // eslint-disable-next-line max-len
  action: Action<C & ConsumeModelInstance<CI> & ConsumeActionAdapter<RawData, Data> & ConsumeDeserializer<Data, Deserialized>>,
) => action.run(all(async (data) => {
  const instance = data.instances[0] ?? await consumeInstance(action);

  return (transform ? transform({ ...data, instance }) : instance) as Next;
})));
