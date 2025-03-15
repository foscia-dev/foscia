import consumeAdapter from '@foscia/core/actions/context/consumers/consumeAdapter';
import consumeDeserializer from '@foscia/core/actions/context/consumers/consumeDeserializer';
import {
  Action,
  ConsumeAdapter,
  ConsumeDeserializer,
  InferQueryInstance,
} from '@foscia/core/actions/types';
import makeRunner from '@foscia/core/actions/utilities/makeRunner';
import { ModelInstance } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

/**
 * Deserialized data with a strongly retyped instances array.
 *
 * @internal
 */
export type RetypedDeserializedData<DD extends DeserializedData, I extends ModelInstance> = {
  instances: I[];
} & Omit<DD, 'instances'>;

/**
 * Data retrieved with {@link all | `all`} which can be transformed
 * to another return value than an instances array.
 */
export type AllData<
  Data,
  Deserialized extends DeserializedData,
  I extends ModelInstance,
> = {
  data: Data;
  deserialized: Deserialized;
  instances: I[];
};

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
  I extends InferQueryInstance<C>,
  RawData,
  Data,
  Deserialized extends DeserializedData,
  Next = I[],
>(
  transform?: (
    data: AllData<Data, RetypedDeserializedData<Deserialized, I>, I>,
  ) => Awaitable<Next>,
) => async (
  action: Action<C & ConsumeAdapter<RawData, Data> & ConsumeDeserializer<Data, Deserialized>>,
) => {
  const response = await (await consumeAdapter(action)).execute(action);
  const data = await response.read();
  const deserialized = await (await consumeDeserializer(action)).deserialize(
    data,
    action,
  ) as RetypedDeserializedData<Deserialized, I>;

  return (
    transform
      ? transform({ data, deserialized, instances: deserialized.instances })
      : deserialized.instances
  ) as Awaitable<Next>;
});
