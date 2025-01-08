import executeContextThroughAdapter
  from '@foscia/core/actions/context/utils/executeContextThroughAdapter';
import makeRunner from '@foscia/core/actions/makeRunner';
import { Action, ConsumeAdapter } from '@foscia/core/actions/types';
import { Awaitable } from '@foscia/shared';

/**
 * Run the action and retrieve the raw adapter's data.
 *
 * @category Runners
 * @requireContext adapter
 *
 * @example
 * ```typescript
 * import { query, raw } from '@foscia/core';
 *
 * const response = await action().run(query(post, '123'), raw());
 * ```
 */
export default makeRunner('raw', <C extends {}, RawData, NextData = RawData>(
  transform?: (data: RawData) => Awaitable<NextData>,
) => async (action: Action<C & ConsumeAdapter<RawData>>) => {
  const response = await executeContextThroughAdapter(
    await action.useContext(),
  );

  return (transform ? transform(response.raw) : response.raw) as Awaitable<NextData>;
});
