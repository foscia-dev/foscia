import consumeInstance from '@foscia/core/actions/context/consumers/consumeInstance';
import oneOr, { OneData } from '@foscia/core/actions/context/runners/oneOr';
import { DeserializedDataOf } from '@foscia/core/actions/context/utils/deserializeInstances';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import {
  Action,
  ConsumeAdapter,
  ConsumeDeserializer,
  ConsumeInstance,
  InferConsumedInstance,
  WithParsedExtension,
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
const oneOrCurrent = <
  C extends ConsumeInstance<CI>,
  I extends InferConsumedInstance<C>,
  CI extends ModelInstance,
  RawData,
  Data,
  Deserialized extends DeserializedData,
  Next = CI,
>(
  transform?: (data: OneData<Data, DeserializedDataOf<I, Deserialized>, I>) => Awaitable<Next>,
) => oneOr<C & ConsumeInstance<CI>, any, I, RawData, Data, Deserialized, CI, Next>(
  async (action) => consumeInstance(await action.useContext()) as Promise<CI>,
  transform,
);

export default /* @__PURE__ */ appendExtension(
  'oneOrCurrent',
  oneOrCurrent,
  'run',
) as WithParsedExtension<typeof oneOrCurrent, {
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
