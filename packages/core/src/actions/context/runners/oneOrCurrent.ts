import consumeInstance from '@foscia/core/actions/context/consumers/consumeInstance';
import oneOr, { OneData } from '@foscia/core/actions/context/runners/oneOr';
import { DeserializedDataOf } from '@foscia/core/actions/context/utils/deserializeInstances';
import makeRunnersExtension from '@foscia/core/actions/extensions/makeRunnersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeAdapter,
  ConsumeDeserializer,
  ConsumeInstance,
  InferConsumedInstance,
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
  CI extends ModelInstance,
  I extends InferConsumedInstance<C>,
  AD,
  DD extends DeserializedData,
  ND = CI,
>(
  transform?: (data: OneData<AD, DeserializedDataOf<I, DD>, I>) => Awaitable<ND>,
) {
  return oneOr<C & ConsumeInstance<CI>, any, I, AD, DD, CI, ND>(
    async (action) => consumeInstance(await action.useContext()) as Promise<CI>,
    transform,
  );
}

type RunnerExtension = ActionParsedExtension<{
  oneOrCurrent<
    C extends ConsumeInstance<CI>,
    CI extends ModelInstance,
    I extends InferConsumedInstance<C>,
    AD,
    DD extends DeserializedData,
    ND = I,
  >(
    this: Action<C & ConsumeAdapter<AD> & ConsumeDeserializer<AD> & ConsumeInstance<CI>>,
    transform?: (data: OneData<AD, DeserializedDataOf<I, DD>, I>) => Awaitable<ND>,
  ): Promise<ND | CI>;
}>;

oneOrCurrent.extension = makeRunnersExtension({ oneOrCurrent }) as RunnerExtension;
