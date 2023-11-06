import consumeAdapter from '@foscia/core/actions/context/consumers/consumeAdapter';
import all, { AllData } from '@foscia/core/actions/context/runners/all';
import { DeserializedDataOf } from '@foscia/core/actions/context/utils/deserializeInstances';
import makeRunnersExtension from '@foscia/core/actions/extensions/makeRunnersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeAdapter,
  ConsumeDeserializer,
  ContextRunner,
  InferConsumedInstance,
} from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

export type OneData<
  AD,
  DD extends DeserializedData,
  I extends ModelInstance,
> = AllData<AD, DD, I> & {
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
export default function oneOr<
  C extends {},
  E extends {},
  I extends InferConsumedInstance<C>,
  AD,
  DD extends DeserializedData,
  RD,
  ND = I,
>(
  nilRunner: ContextRunner<C & ConsumeAdapter<AD> & ConsumeDeserializer<AD, DD>, E, Awaitable<RD>>,
  transform?: (data: OneData<AD, DeserializedDataOf<I, DD>, I>) => Awaitable<ND>,
) {
  return async (
    action: Action<C & ConsumeAdapter<AD> & ConsumeDeserializer<AD, DD>, E>,
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
        return result as ND;
      }
    } catch (error) {
      const context = await action.useContext();
      const adapter = consumeAdapter(context);
      if (!(await adapter.isNotFound(error))) {
        throw error;
      }
    }

    return action.run(nilRunner);
  };
}

type RunnerExtension = ActionParsedExtension<{
  oneOr<
    C extends {},
    E extends {},
    I extends InferConsumedInstance<C>,
    AD,
    DD extends DeserializedData,
    RD,
    ND = I,
  >(
    this: Action<C & ConsumeAdapter<AD> & ConsumeDeserializer<AD, DD>, E>,
    nilRunner: ContextRunner<C & ConsumeAdapter<AD> & ConsumeDeserializer<AD, DD>, E, RD>,
    transform?: (data: OneData<AD, DeserializedDataOf<I, DD>, I>) => Awaitable<ND>,
  ): Promise<Awaited<ND> | Awaited<RD>>;
}>;

oneOr.extension = makeRunnersExtension({ oneOr }) as RunnerExtension;
