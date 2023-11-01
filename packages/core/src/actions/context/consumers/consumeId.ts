import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeId } from '@foscia/core/actions/types';

export default function consumeId<C extends {}, D = never>(
  context: C & Partial<ConsumeId>,
  defaultValue?: D,
) {
  return consumeContext(context, 'id', [
    'find',
    'update',
    'destroy',
    'forInstance',
    'forId',
  ], defaultValue);
}
