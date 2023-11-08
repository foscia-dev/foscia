import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeAdapter } from '@foscia/core/actions/types';
import { value } from '@foscia/shared';

export default function consumeAdapter<C extends {}, AD, D = never>(
  context: C & Partial<ConsumeAdapter<AD>>,
  defaultValue?: D,
) {
  return value(consumeContext(context, 'adapter', ['context'], defaultValue));
}
