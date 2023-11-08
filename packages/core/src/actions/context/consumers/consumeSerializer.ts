import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeSerializer } from '@foscia/core/actions/types';
import { value } from '@foscia/shared';

export default function consumeSerializer<C extends {}, SD, D = never>(
  context: C & Partial<ConsumeSerializer<SD>>,
  defaultValue?: D,
) {
  return value(consumeContext(context, 'serializer', ['context'], defaultValue));
}
