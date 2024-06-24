import executeContextThroughAdapter
  from '@foscia/core/actions/context/utils/executeContextThroughAdapter';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import { Action, ConsumeAdapter, WithParsedExtension } from '@foscia/core/actions/types';
import { Awaitable } from '@foscia/shared';

/**
 * Run the action and retrieve the raw adapter's data.
 *
 * @category Runners
 */
function raw<C extends {}, RawData, NextData = RawData>(
  transform?: (data: RawData) => Awaitable<NextData>,
) {
  return async (action: Action<C & ConsumeAdapter<RawData>>) => {
    const response = await executeContextThroughAdapter(
      await action.useContext(),
    );

    return (transform ? transform(response.raw) : response.raw) as Awaitable<NextData>;
  };
}

export default /* @__PURE__ */ appendExtension(
  'raw',
  raw,
  'run',
) as WithParsedExtension<typeof raw, {
  raw<C extends {}, RawData, NextData = RawData>(
    this: Action<C & ConsumeAdapter<RawData>>,
    transform?: (data: RawData) => Awaitable<NextData>,
  ): Promise<NextData>;
}>;
