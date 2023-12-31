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
import { DeserializedData } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

/**
 * Run the action and deserialize one model's instance.
 * Returns null when not found or empty result.
 *
 * @category Runners
 */
export default function one<
  C extends {},
  I extends InferConsumedInstance<C>,
  AD,
  DD extends DeserializedData,
  ND = I,
>(
  transform?: (data: OneData<AD, DeserializedDataOf<I, DD>, I>) => Awaitable<ND>,
) {
  return oneOr<C, any, I, AD, DD, null, ND>(() => null, transform);
}

type RunnerExtension = ActionParsedExtension<{
  one<
    C extends {},
    I extends InferConsumedInstance<C>,
    AD,
    DD extends DeserializedData,
    ND = I,
  >(
    this: Action<C & ConsumeAdapter<AD> & ConsumeDeserializer<AD>>,
    transform?: (data: OneData<AD, DeserializedDataOf<I, DD>, I>) => Awaitable<ND>,
  ): Promise<ND | null>;
}>;

one.extension = makeRunnersExtension({ one }) as RunnerExtension;
