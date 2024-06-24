import all, { AllData } from '@foscia/core/actions/context/runners/all';
import { DeserializedDataOf } from '@foscia/core/actions/context/utils/deserializeInstances';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import {
  Action,
  ConsumeAdapter,
  ConsumeDeserializer,
  ContextRunner,
  InferConsumedInstance,
  WithParsedExtension,
} from '@foscia/core/actions/types';
import isNotFoundError from '@foscia/core/errors/flags/isNotFoundError';
import { ModelInstance } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

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
 */
function oneOr<
  C extends {},
  E extends {},
  I extends InferConsumedInstance<C>,
  RawData,
  Data,
  Deserialized extends DeserializedData,
  NilData,
  Next = I,
>(
  // eslint-disable-next-line max-len
  nilRunner: ContextRunner<C & ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>, E, Awaitable<NilData>>,
  transform?: (data: OneData<Data, DeserializedDataOf<I, Deserialized>, I>) => Awaitable<Next>,
) {
  return async (
    // eslint-disable-next-line max-len
    action: Action<C & ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>, E>,
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
      if (!isNotFoundError(error)) {
        throw error;
      }
    }

    return action.run(nilRunner);
  };
}

export default /* @__PURE__ */ appendExtension(
  'oneOr',
  oneOr,
  'run',
) as WithParsedExtension<typeof oneOr, {
  oneOr<
    C extends {},
    E extends {},
    I extends InferConsumedInstance<C>,
    RawData,
    Data,
    Deserialized extends DeserializedData,
    NilData,
    Next = I,
  >(
    // eslint-disable-next-line max-len
    this: Action<C & ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>, E>,
    // eslint-disable-next-line max-len
    nilRunner: ContextRunner<C & ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>, E, NilData>,
    transform?: (data: OneData<Data, DeserializedDataOf<I, Deserialized>, I>) => Awaitable<Next>,
  ): Promise<Awaited<Next> | Awaited<NilData>>;
}>;
