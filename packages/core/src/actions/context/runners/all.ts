import deserializeInstances, {
  DeserializedDataOf,
} from '@foscia/core/actions/context/utils/deserializeInstances';
import executeContextThroughAdapter
  from '@foscia/core/actions/context/utils/executeContextThroughAdapter';
import makeRunnersExtension from '@foscia/core/actions/extensions/makeRunnersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeAdapter,
  ConsumeDeserializer,
  InferConsumedInstance,
} from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

export type AllData<
  AD,
  DD extends DeserializedData,
  I extends ModelInstance,
> = {
  data: AD;
  deserialized: DD;
  instances: I[];
};

/**
 * Run the action and deserialize an array of model's instance.
 *
 * @param transform
 *
 * @category Runners
 */
export default function all<
  C extends {},
  I extends InferConsumedInstance<C>,
  AD,
  DD extends DeserializedData,
  ND = I[],
>(transform?: (data: AllData<AD, DeserializedDataOf<I, DD>, I>) => Awaitable<ND>) {
  return async (
    action: Action<C & ConsumeAdapter<AD> & ConsumeDeserializer<DD>>,
  ) => {
    const response = await executeContextThroughAdapter(
      await action.useContext(),
    );
    const data = await response.read();
    const deserialized = await deserializeInstances(action, data) as DeserializedDataOf<I, DD>;

    return (
      transform
        ? transform({ data, deserialized, instances: deserialized.instances })
        : deserialized.instances
    ) as Awaitable<ND>;
  };
}

type RunnerExtension = ActionParsedExtension<{
  all<
    C extends {},
    I extends InferConsumedInstance<C>,
    AD,
    DD extends DeserializedData,
    ND = I[],
  >(
    this: Action<C & ConsumeAdapter<AD> & ConsumeDeserializer<DD>>,
    transform?: (data: AllData<AD, DeserializedDataOf<I, DD>, I>) => Awaitable<ND>,
  ): Promise<Awaited<ND>>;
}>;

all.extension = makeRunnersExtension({ all }) as RunnerExtension;
