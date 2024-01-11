import oneOr, { OneData } from '@foscia/core/actions/context/runners/oneOr';
import { DeserializedDataOf } from '@foscia/core/actions/context/utils/deserializeInstances';
import makeRunnersExtension from '@foscia/core/actions/extensions/makeRunnersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeAdapter,
  ConsumeDeserializer,
  InferConsumedInstance,
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
export default function oneOrFail<
  C extends {},
  I extends InferConsumedInstance<C>,
  AD,
  DD extends DeserializedData,
  ND = I,
>(
  transform?: (data: OneData<AD, DeserializedDataOf<I, DD>, I>) => Awaitable<ND>,
) {
  return oneOr<C, any, I, AD, DD, never, ND>(() => {
    throw new ExpectedRunFailureError(
      '`oneOrFail` failed. You may handle this error globally as a "not found" record error.',
    );
  }, transform);
}

type RunnerExtension = ActionParsedExtension<{
  oneOrFail<
    C extends {},
    I extends InferConsumedInstance<C>,
    AD,
    DD extends DeserializedData,
    ND = I,
  >(
    this: Action<C & ConsumeAdapter<AD> & ConsumeDeserializer<DD>>,
    transform?: (data: OneData<AD, DeserializedDataOf<I, DD>, I>) => Awaitable<ND>,
  ): Promise<ND>;
}>;

oneOrFail.extension = makeRunnersExtension({ oneOrFail }) as RunnerExtension;
