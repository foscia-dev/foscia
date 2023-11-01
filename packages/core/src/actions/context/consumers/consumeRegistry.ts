import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeRegistry } from '@foscia/core/actions/types';

export default function consumeRegistry<C extends {}, D = never>(
  context: C & Partial<ConsumeRegistry>,
  defaultValue?: D,
) {
  return consumeContext(context, 'registry', ['context'], defaultValue);
}
