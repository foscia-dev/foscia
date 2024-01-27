import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeAdapter } from '@foscia/core/actions/types';
import { value } from '@foscia/shared';

export default function consumeAdapter<C extends {}, RawData, Data, D = never>(
  context: C & Partial<ConsumeAdapter<RawData, Data>>,
  defaultValue?: D,
) {
  return value(consumeContext(context, 'adapter', ['context'], defaultValue));
}
