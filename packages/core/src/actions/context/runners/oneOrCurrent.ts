import consumeInstance from '@foscia/core/actions/context/consumers/consumeInstance';
import oneOr, { OneData } from '@foscia/core/actions/context/runners/oneOr';
import { DeserializedDataOf } from '@foscia/core/actions/context/utils/deserializeInstances';
import makeRunnersExtension from '@foscia/core/actions/extensions/makeRunnersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeDeserializer,
  ConsumeInstance,
  InferConsumedInstance,
  ConsumeAdapter,
} from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

/**
 * Run the action and deserialize one model's instance.
 * Returns current instance when not found or empty result.
 *
 * @category Runners
 */
export default function oneOrCurrent<
  C extends ConsumeInstance<CI>,
  I extends InferConsumedInstance<C>,
  CI extends ModelInstance,
  RawData,
  Data,
  Deserialized extends DeserializedData,
  Next = CI,
>(
  transform?: (data: OneData<Data, DeserializedDataOf<I, Deserialized>, I>) => Awaitable<Next>,
) {
  return oneOr<C & ConsumeInstance<CI>, any, I, RawData, Data, Deserialized, CI, Next>(
    async (action) => consumeInstance(await action.useContext()) as Promise<CI>,
    transform,
  );
}

type RunnerExtension = ActionParsedExtension<{
  oneOrCurrent<
    C extends ConsumeInstance<CI>,
    I extends InferConsumedInstance<C>,
    CI extends ModelInstance,
    RawData,
    Data,
    Deserialized extends DeserializedData,
    Next = CI,
  >(
    // eslint-disable-next-line max-len
    this: Action<C & ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized> & ConsumeInstance<CI>>,
    transform?: (data: OneData<Data, DeserializedDataOf<I, Deserialized>, I>) => Awaitable<Next>,
  ): Promise<Next | CI>;
}>;

oneOrCurrent.extension = makeRunnersExtension({ oneOrCurrent }) as RunnerExtension;
