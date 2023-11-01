import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeInclude } from '@foscia/core/actions/types';

export default function consumeInclude<C extends {}, D = never>(
  context: C & Partial<ConsumeInclude>,
  defaultValue?: D,
) {
  return consumeContext(context, 'include', ['include'], defaultValue);
}
