import oneOr, { OneData } from '@foscia/core/actions/context/runners/oneOr';
import { DeserializedDataOf } from '@foscia/core/actions/context/utils/deserializeInstances';
import makeRunnersExtension from '@foscia/core/actions/extensions/makeRunnersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeDeserializer,
  InferConsumedInstance,
  ConsumeAdapter,
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
  RawData,
  Data,
  Deserialized extends DeserializedData,
  Next = I,
>(
  transform?: (data: OneData<Data, DeserializedDataOf<I, Deserialized>, I>) => Awaitable<Next>,
) {
  return oneOr<C, any, I, RawData, Data, Deserialized, null, Next>(() => null, transform);
}

type RunnerExtension = ActionParsedExtension<{
  one<
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
  ): Promise<Next | null>;
}>;

one.extension = makeRunnersExtension({ one }) as RunnerExtension;
