import consumeAdapter from '@foscia/core/actions/context/consumers/consumeAdapter';
import { Action, ConsumeAdapter } from '@foscia/core/actions/types';
import makeRunner from '@foscia/core/actions/utilities/makeRunner';
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
 * const response = await action(query(post, '123'), raw());
 * ```
 */
export default makeRunner('raw', <C extends {}, RawData, NextData = RawData>(
  transform?: (data: RawData) => Awaitable<NextData>,
) => async (action: Action<C & ConsumeAdapter<RawData>>) => {
  const response = await (await consumeAdapter(action)).execute(action);

  return (transform ? transform(response.raw) : response.raw) as Awaitable<NextData>;
});
