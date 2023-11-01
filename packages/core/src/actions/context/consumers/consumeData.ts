import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeData } from '@foscia/core/actions/types';

export default function consumeData<C extends {}, D = never>(
  context: C & Partial<ConsumeData>,
  defaultValue?: D,
) {
  return consumeContext(context, 'data', ['context'], defaultValue);
}
