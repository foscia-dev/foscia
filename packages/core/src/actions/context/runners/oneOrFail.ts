import oneOr, { OneData } from '@foscia/core/actions/context/runners/oneOr';
import { DeserializedDataOf } from '@foscia/core/actions/context/utils/deserializeInstances';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import {
  Action,
  ConsumeAdapter,
  ConsumeDeserializer,
  InferConsumedInstance,
  WithParsedExtension,
} from '@foscia/core/actions/types';
import ExpectedRunFailureError from '@foscia/core/errors/expectedRunFailureError';
import { DeserializedData } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

/**
 * Run the action and deserialize one model's instance.
 * Throw an "ExpectedRunFailureError" when not found or empty result.
 *
 * @category Runners
 */
const oneOrFail = <
  C extends {},
  I extends InferConsumedInstance<C>,
  RawData,
  Data,
  Deserialized extends DeserializedData,
  Next = I,
>(
  transform?: (data: OneData<Data, DeserializedDataOf<I, Deserialized>, I>) => Awaitable<Next>,
) => oneOr<C, any, I, RawData, Data, Deserialized, never, Next>(() => {
  throw new ExpectedRunFailureError(
    '`oneOrFail` failed. You may handle this error globally as a "not found" record error.',
  );
}, transform);

export default /* @__PURE__ */ appendExtension(
  'oneOrFail',
  oneOrFail,
  'run',
) as WithParsedExtension<typeof oneOrFail, {
  oneOrFail<
    C extends {},
    I extends InferConsumedInstance<C>,
    RawData,
    Data,
    Deserialized extends DeserializedData,
    Next = I,
  >(
    // eslint-disable-next-line max-len
    this: Action<C & ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>>,
    transform?: (data: OneData<Data, DeserializedDataOf<I, Deserialized>, I>) => Awaitable<Next>,
  ): Promise<Next>;
}>;
