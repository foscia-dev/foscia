import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeAction } from '@foscia/core/actions/types';

export default function consumeAction<C extends {}, D = never>(
  context: C & Partial<ConsumeAction>,
  defaultValue?: D,
) {
  return consumeContext(context, 'action', ['context'], defaultValue);
}
