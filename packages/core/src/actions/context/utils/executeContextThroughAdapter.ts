import consumeAction from '@foscia/core/actions/context/consumers/consumeAction';
import consumeAdapter from '@foscia/core/actions/context/consumers/consumeAdapter';
import { ConsumeAdapter } from '@foscia/core/actions/types';

export default async function executeContextThroughAdapter<AD>(
  context: ConsumeAdapter<AD>,
): Promise<AD> {
  const adapter = consumeAdapter(context);
  const action = consumeAction(context, 'read');
  if (action in adapter && typeof (adapter as any)[action] === 'function') {
    return (adapter as any)[action](context);
  }

  return adapter.execute(context);
}
