import consumeInstance from '@foscia/core/actions/context/consumers/consumeInstance';
import oneOr, { OneData } from '@foscia/core/actions/context/runners/oneOr';
import {
  RetypedDeserializedData,
} from '@foscia/core/actions/context/utilities/deserializeInstances';
import makeRunner from '@foscia/core/actions/makeRunner';
import { ConsumeInstance, InferQueryInstance } from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

/**
 * Run the action and deserialize one model's instance.
 * Returns current instance when not found or empty result.
 *
 * @category Runners
 * @requireContext adapter, deserializer, model
 *
 * @example
 * ```typescript
 * import { save, oneOrCurrent } from '@foscia/core';
 *
 * const savedPost = await action().run(save(post), oneOrCurrent());
 * ```
 */
export default makeRunner('oneOrCurrent', <
  C extends ConsumeInstance<CI>,
  I extends InferQueryInstance<C>,
  CI extends ModelInstance,
  RawData,
  Data,
  Deserialized extends DeserializedData,
  Next = CI,
>(
  transform?: (data: OneData<Data, RetypedDeserializedData<Deserialized, I>, I>) => Awaitable<Next>,
) => oneOr<C & ConsumeInstance<CI>, I, RawData, Data, Deserialized, CI, Next>(
  async (action) => consumeInstance(await action.useContext()) as Promise<CI>,
  transform,
));
