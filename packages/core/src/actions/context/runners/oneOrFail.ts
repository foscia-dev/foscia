import { RetypedDeserializedData } from '@foscia/core/actions/context/runners/all';
import oneOr, { OneData } from '@foscia/core/actions/context/runners/oneOr';
import { InferQueryInstance } from '@foscia/core/actions/types';
import makeRunner from '@foscia/core/actions/utilities/makeRunner';
import RecordNotFoundError from '@foscia/core/errors/recordNotFoundError';
import { DeserializedData } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

/**
 * Run the action and deserialize one model's instance.
 * Throws a {@link RecordNotFoundError | `RecordNotFoundError`} when
 * encountering a not found adapter error or an empty response.
 *
 * @category Runners
 * @requireContext adapter, deserializer, model
 *
 * @example
 * ```typescript
 * import { query, oneOrFail } from '@foscia/core';
 *
 * const post = await action(query(post, '123'), oneOrFail());
 * ```
 */
export default makeRunner('oneOrFail', <
  C extends {},
  I extends InferQueryInstance<C>,
  RawData,
  Data,
  Deserialized extends DeserializedData,
  Next = I,
>(
  transform?: (data: OneData<Data, RetypedDeserializedData<Deserialized, I>, I>) => Awaitable<Next>,
) => oneOr<C, I, RawData, Data, Deserialized, never, Next>(() => {
  throw new RecordNotFoundError(
    'No record found inside the adapter response.',
  );
}, transform));
