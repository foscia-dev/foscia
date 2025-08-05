import all from '@foscia/core/actions/context/runners/all';
import {
  Action,
  AnonymousRunner,
  ConsumeActionAdapter,
  ConsumeDeserializer,
  InferActionInstance,
} from '@foscia/core/actions/types';
import makeRunner from '@foscia/core/actions/utilities/makeRunner';
import { FLAG_ERROR_NOT_FOUND } from '@foscia/core/flags';
import { ModelInstance } from '@foscia/core/models/types';
import { DataDeserializerResult } from '@foscia/core/types';
import { Awaitable, isFosciaFlag } from '@foscia/shared';

/**
 * Data retrieved with {@link oneOr | `oneOr`} which can be transformed
 * to another return value than an instance.
 */
export type OneData<OriginalResponse, Data, DeserializedData, I extends ModelInstance> =
  & {
    readonly raw: OriginalResponse;
    readonly read: Data;
    readonly instance: I;
  }
  & DataDeserializerResult<I, DeserializedData>;

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
 * const post = await action(query(post, '123'), oneOr(() => null));
 * ```
 */
export default makeRunner('oneOr', <
  C extends (
    & ConsumeActionAdapter<OriginalResponse, Data>
    & ConsumeDeserializer<Data, DeserializedData>),
  OriginalResponse,
  Data,
  DeserializedData,
  Next = InferActionInstance<C>,
  Default = void,
>(
  runner: AnonymousRunner<(
    & C
    & ConsumeActionAdapter<OriginalResponse, Data>
    & ConsumeDeserializer<Data, DeserializedData>), Awaitable<Default>>,
  transform?: (
    data: OneData<OriginalResponse, Data, DeserializedData, InferActionInstance<C>>,
  ) => Awaitable<Next>,
) => async (
  action: Action<(
    & C
    & ConsumeActionAdapter<OriginalResponse, Data>
    & ConsumeDeserializer<Data, DeserializedData>)>,
): Promise<Next | Default> => {
  try {
    // TODO Limit deserialization to first record only.
    const result = await action.run(all((data) => {
      const instance = data.instances[0] ?? null;
      if (instance && transform) {
        return transform({
          ...data,
          instance,
        });
      }

      return instance as Next;
    }));

    if (result !== null) {
      return result;
    }
  } catch (error) {
    if (!isFosciaFlag(error, FLAG_ERROR_NOT_FOUND)) {
      throw error;
    }
  }

  return action.run(runner);
});
