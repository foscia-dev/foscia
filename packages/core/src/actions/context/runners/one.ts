import oneOr, { OneData } from '@foscia/core/actions/context/runners/oneOr';
import { RetypedDeserializedData } from '@foscia/core/actions/context/utilities/deserializeInstances';
import makeRunner from '@foscia/core/actions/utilities/makeRunner';
import { InferQueryInstance } from '@foscia/core/actions/types';
import { DeserializedData } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

/**
 * Run the action and deserialize one model's instance.
 * Returns null when not found or empty result.
 *
 * @category Runners
 * @requireContext adapter, deserializer, model
 *
 * @example
 * ```typescript
 * import { query, one } from '@foscia/core';
 *
 * const post = await action(query(post, '123'), one());
 * ```
 */
export default makeRunner('one', <
  C extends {},
  I extends InferQueryInstance<C>,
  RawData,
  Data,
  Deserialized extends DeserializedData,
  Next = I,
>(
  transform?: (data: OneData<Data, RetypedDeserializedData<Deserialized, I>, I>) => Awaitable<Next>,
) => oneOr<C, I, RawData, Data, Deserialized, null, Next>(() => null, transform));
