import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeSerializer } from '@foscia/core/actions/types';
import { value } from '@foscia/shared';

export default function consumeSerializer<C extends {}, Record, Related, Data, D = never>(
  context: C & Partial<ConsumeSerializer<Record, Related, Data>>,
  defaultValue?: D,
) {
  return value(consumeContext(context, 'serializer', ['context'], defaultValue));
}
