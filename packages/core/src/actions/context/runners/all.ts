import consumeAdapter from '@foscia/core/actions/context/consumers/consumeAdapter';
import consumeDeserializer from '@foscia/core/actions/context/consumers/consumeDeserializer';
import {
  Action,
  ConsumeActionAdapter,
  ConsumeDeserializer,
  InferActionInstance,
} from '@foscia/core/actions/types';
import makeRunner from '@foscia/core/actions/utilities/makeRunner';
import { ModelInstance } from '@foscia/core/models/types';
import { DataDeserializerResult } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

/**
 * Data retrieved with {@link all | `all`} which can be transformed
 * to another return value than an instances array.
 */
export type AllData<OriginalResponse, Data, DeserializedData, I extends ModelInstance> =
  & {
    readonly raw: OriginalResponse;
    readonly read: Data;
  }
  & DataDeserializerResult<I, DeserializedData>;

/**
 * Run the action and deserialize an array of model's instance.
 *
 * @param transform
 *
 * @category Runners
 * @requireContext adapter, deserializer, model
 *
 * @example
 * ```typescript
 * import { all, query } from '@foscia/core';
 *
 * const posts = await action(query(Post), all());
 * ```
 */
export default /* @__PURE__ */ makeRunner('all', <
  C extends {},
  OriginalResponse,
  Data,
  DeserializedData,
  Next = InferActionInstance<C>[],
>(
  transform?: (
    data: AllData<OriginalResponse, Data, DeserializedData, InferActionInstance<C>>,
  ) => Awaitable<Next>,
) => async (
  action: Action<(
    & C
    & ConsumeActionAdapter<OriginalResponse, Data>
    & ConsumeDeserializer<Data, DeserializedData>)>,
): Promise<Next> => {
  const response = await (await consumeAdapter(action)).execute(action);
  const read = await response.read();
  const deserialized = await (await consumeDeserializer(action)).deserialize(read, action);

  return transform
    ? transform({
      raw: response.raw,
      read,
      ...deserialized as DataDeserializerResult<InferActionInstance<C>, DeserializedData>,
    })
    : deserialized.instances as Next;
});
