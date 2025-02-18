import consumeInstance from '@foscia/core/actions/context/consumers/consumeInstance';
import all from '@foscia/core/actions/context/runners/all';
import { OneData } from '@foscia/core/actions/context/runners/oneOr';
import {
  RetypedDeserializedData,
} from '@foscia/core/actions/context/utilities/deserializeInstances';
import {
  Action,
  ConsumeAdapter,
  ConsumeDeserializer,
  ConsumeInstance,
  InferQueryInstance,
} from '@foscia/core/actions/types';
import makeRunner from '@foscia/core/actions/utilities/makeRunner';
import { ModelInstance } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Awaitable, using } from '@foscia/shared';

/**
 * Run the action and deserialize one model's instance.
 * Returns current instance when facing an empty result (such as
 * a 204 response).
 *
 * @category Runners
 * @requireContext adapter, deserializer, model, instance
 * @since 0.13.0
 *
 * @example
 * ```typescript
 * import { save, current } from '@foscia/core';
 *
 * const savedPost = await action(save(post), current());
 * ```
 */
export default makeRunner('current', <
  C extends ConsumeInstance<CI>,
  I extends InferQueryInstance<C>,
  CI extends ModelInstance,
  RawData,
  Data,
  Deserialized extends DeserializedData,
  Next = I | CI,
>(
  transform?: (data: OneData<Data, RetypedDeserializedData<Deserialized, I>, I>) => Awaitable<Next>,
) => async (
  // eslint-disable-next-line max-len
  action: Action<C & ConsumeInstance<CI> & ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>>,
) => action.run(all(async (data) => using(
  data.instances[0] ?? consumeInstance(await action.useContext()),
  (instance) => (transform ? transform({ ...data, instance }) : instance) as Next,
))));
