import consumeAction from '@foscia/core/actions/context/consumers/consumeAction';
import consumeAdapter from '@foscia/core/actions/context/consumers/consumeAdapter';
import { ConsumeAdapter } from '@foscia/core/actions/types';
import { AdapterResponseI } from '@foscia/core/types';

export default async function executeContextThroughAdapter<RawData, Data>(
  context: ConsumeAdapter<RawData, Data>,
): Promise<AdapterResponseI<RawData, Data>> {
  const adapter = await consumeAdapter(context);
  const action = consumeAction(context, null);
  if (action && action in adapter && typeof (adapter as any)[action] === 'function') {
    return (adapter as any)[action](context);
  }

  return adapter.execute(context);
}
