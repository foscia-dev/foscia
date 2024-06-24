import deserializeInstances, {
  DeserializedDataOf,
} from '@foscia/core/actions/context/utils/deserializeInstances';
import executeContextThroughAdapter
  from '@foscia/core/actions/context/utils/executeContextThroughAdapter';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import {
  Action,
  ConsumeAdapter,
  ConsumeDeserializer,
  InferConsumedInstance,
  WithParsedExtension,
} from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

export type AllData<
  Data,
  Deserialized extends DeserializedData,
  I extends ModelInstance,
> = {
  data: Data;
  deserialized: Deserialized;
  instances: I[];
};

/**
 * Run the action and deserialize an array of model's instance.
 *
 * @param transform
 *
 * @category Runners
 */
function all<
  C extends {},
  I extends InferConsumedInstance<C>,
  RawData,
  Data,
  Deserialized extends DeserializedData,
  Next = I[],
>(transform?: (
  data: AllData<Data, DeserializedDataOf<I, Deserialized>, I>,
) => Awaitable<Next>) {
  return async (
    // eslint-disable-next-line max-len
    action: Action<C & ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>>,
  ) => {
    const response = await executeContextThroughAdapter(
      await action.useContext(),
    );
    const data = await response.read();
    const deserialized = await deserializeInstances(
      action,
      data,
    ) as DeserializedDataOf<I, Deserialized>;

    return (
      transform
        ? transform({ data, deserialized, instances: deserialized.instances })
        : deserialized.instances
    ) as Awaitable<Next>;
  };
}

export default /* @__PURE__ */ appendExtension(
  'all',
  all,
  'run',
) as WithParsedExtension<typeof all, {
  all<
    C extends {},
    I extends InferConsumedInstance<C>,
    RawData,
    Data,
    Deserialized extends DeserializedData,
    NextData = I[],
  >(
    // eslint-disable-next-line max-len
    this: Action<C & ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>>,
    transform?: (
      data: AllData<Data, DeserializedDataOf<I, Deserialized>, I>,
    ) => Awaitable<NextData>,
  ): Promise<Awaited<NextData>>;
}>;
