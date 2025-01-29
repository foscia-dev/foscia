import all, { AllData } from '@foscia/core/actions/context/runners/all';
import {
  RetypedDeserializedData,
} from '@foscia/core/actions/context/utilities/deserializeInstances';
import makeRunner from '@foscia/core/actions/makeRunner';
import {
  Action,
  ConsumeAdapter,
  ConsumeDeserializer,
  ContextRunner,
  InferQueryInstance,
} from '@foscia/core/actions/types';
import { FLAG_ERROR_NOT_FOUND } from '@foscia/core/flags';
import { ModelInstance } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Awaitable, isFosciaFlag } from '@foscia/shared';

/**
 * Data retrieved with {@link oneOr | `oneOr`} which can be transformed
 * to another return value than an instance.
 */
export type OneData<
  Data,
  Deserialized extends DeserializedData,
  I extends ModelInstance,
> = AllData<Data, Deserialized, I> & {
  instance: I;
};

/**
 * Run the action and deserialize one model's instance.
 *
 * @param nilRunner
 * @param transform
 *
 * @category Runners
 * @requireContext adapter, deserializer, model
 *
 * @example
 * ```typescript
 * import { query, oneOr } from '@foscia/core';
 *
 * const post = await action().run(query(post, '123'), oneOr(() => null));
 * ```
 */
export default makeRunner('oneOr', <
  C extends {},
  I extends InferQueryInstance<C>,
  RawData,
  Data,
  Deserialized extends DeserializedData,
  NilData,
  Next = I,
>(
  // eslint-disable-next-line max-len
  nilRunner: ContextRunner<C & ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>, Awaitable<NilData>>,
  transform?: (data: OneData<Data, RetypedDeserializedData<Deserialized, I>, I>) => Awaitable<Next>,
) => async (
  // eslint-disable-next-line max-len
  action: Action<C & ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>>,
) => {
  try {
    const result = await action.run(all((data) => {
      const instance = data.instances[0];
      if (instance) {
        return transform ? transform({ ...data, instance }) : instance;
      }

      return null;
    }));
    if (result !== null) {
      return result as Next;
    }
  } catch (error) {
    if (!isFosciaFlag(error, FLAG_ERROR_NOT_FOUND)) {
      throw error;
    }
  }

  return action.run(nilRunner);
});
