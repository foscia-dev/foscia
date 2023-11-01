import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeAdapter } from '@foscia/core/actions/types';

export default function consumeAdapter<C extends {}, AD, D = never>(
  context: C & Partial<ConsumeAdapter<AD>>,
  defaultValue?: D,
) {
  return consumeContext(context, 'adapter', ['context'], defaultValue);
}
