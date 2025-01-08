import consumeAction from '@foscia/core/actions/context/consumers/consumeAction';
import consumeAdapter from '@foscia/core/actions/context/consumers/consumeAdapter';
import { ConsumeAdapter } from '@foscia/core/actions/types';
import { AdapterResponse } from '@foscia/core/types';

export default async <RawData, Data>(
  context: ConsumeAdapter<RawData, Data>,
): Promise<AdapterResponse<RawData, Data>> => {
  const adapter = await consumeAdapter(context);
  const action = consumeAction(context, null);
  if (action && action in adapter && typeof (adapter as any)[action] === 'function') {
    return (adapter as any)[action](context);
  }

  return adapter.execute(context);
};
