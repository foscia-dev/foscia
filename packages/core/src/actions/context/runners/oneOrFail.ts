import oneOr, { OneData } from '@foscia/core/actions/context/runners/oneOr';
import { DeserializedDataOf } from '@foscia/core/actions/context/utilities/deserializeInstances';
import makeRunner from '@foscia/core/actions/makeRunner';
import { InferQueryInstance } from '@foscia/core/actions/types';
import ExpectedRunFailureError from '@foscia/core/errors/expectedRunFailureError';
import { DeserializedData } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

/**
 * Run the action and deserialize one model's instance.
 * Throw an "ExpectedRunFailureError" when not found or empty result.
 *
 * @category Runners
 * @requireContext adapter, deserializer, model
 *
 * @example
 * ```typescript
 * import { query, oneOrFail } from '@foscia/core';
 *
 * const post = await action().run(query(post, '123'), oneOrFail());
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
  transform?: (data: OneData<Data, DeserializedDataOf<I, Deserialized>, I>) => Awaitable<Next>,
) => oneOr<C, I, RawData, Data, Deserialized, never, Next>(() => {
  throw new ExpectedRunFailureError(
    '`oneOrFail` failed. You may handle this error globally as a "not found" record error.',
  );
}, transform));
