import executeContextThroughAdapter
  from '@foscia/core/actions/context/utils/executeContextThroughAdapter';
import makeRunnersExtension from '@foscia/core/actions/extensions/makeRunnersExtension';
import { Action, ActionParsedExtension, ConsumeAdapter } from '@foscia/core/actions/types';
import { Awaitable } from '@foscia/shared';

/**
 * Run the action and retrieve the raw adapter's data.
 *
 * @category Runners
 */
export default function raw<C extends {}, RawData, NextData = RawData>(
  transform?: (data: RawData) => Awaitable<NextData>,
) {
  return async (action: Action<C & ConsumeAdapter<RawData>>) => {
    const response = await executeContextThroughAdapter(
      await action.useContext(),
    );

    return (transform ? transform(response.raw) : response.raw) as Awaitable<NextData>;
  };
}

type RunnerExtension = ActionParsedExtension<{
  raw<C extends {}, RawData, NextData = RawData>(
    this: Action<C & ConsumeAdapter<RawData>>,
    transform?: (data: RawData) => Awaitable<NextData>,
  ): Promise<NextData>;
}>;

raw.extension = makeRunnersExtension({ raw }) as RunnerExtension;
