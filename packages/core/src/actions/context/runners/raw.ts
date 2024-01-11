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
export default function raw<C extends {}, AD, ND = AD>(
  transform?: (data: AD) => Awaitable<ND>,
) {
  return async (action: Action<C & ConsumeAdapter<AD>>) => {
    const response = await executeContextThroughAdapter(
      await action.useContext(),
    );

    return (transform ? transform(response.raw) : response.raw) as Awaitable<ND>;
  };
}

type RunnerExtension = ActionParsedExtension<{
  raw<C extends {}, AD>(
    this: Action<C & ConsumeAdapter<AD>>,
  ): Promise<AD>;
}>;

raw.extension = makeRunnersExtension({ raw }) as RunnerExtension;
