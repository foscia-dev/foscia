import deserializeInstances, {
  RetypedDeserializedData,
} from '@foscia/core/actions/context/utilities/deserializeInstances';
import executeContextThroughAdapter
  from '@foscia/core/actions/context/utilities/executeContextThroughAdapter';
import makeRunner from '@foscia/core/actions/makeRunner';
import {
  Action,
  ConsumeAdapter,
  ConsumeDeserializer,
  InferQueryInstance,
} from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

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
 * const posts = await action().run(query(Post), all());
 * ```
 */
export default /* @__PURE__ */ makeRunner('all', <
  C extends {},
  I extends InferQueryInstance<C>,
  RawData,
  Data,
  Deserialized extends DeserializedData,
  Next = I[],
>(transform?: (
  data: AllData<Data, RetypedDeserializedData<Deserialized, I>, I>,
) => Awaitable<Next>) => async (
  // eslint-disable-next-line max-len
  action: Action<C & ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>>,
) => {
  const context = await action.useContext();
  const response = await executeContextThroughAdapter(context);
  const data = await response.read();
  const deserialized = await deserializeInstances(
    context,
    data,
  ) as RetypedDeserializedData<Deserialized, I>;

  return (
    transform
      ? transform({ data, deserialized, instances: deserialized.instances })
      : deserialized.instances
  ) as Awaitable<Next>;
});
