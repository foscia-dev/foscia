import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeInstance } from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';

export default function consumeInstance<C extends {}, I extends ModelInstance, D = never>(
  context: C & Partial<ConsumeInstance<I>>,
  defaultValue?: D,
) {
  return consumeContext(context, 'instance', [
    'create',
    'update',
    'save',
    'destroy',
    'forInstance',
  ], defaultValue) as I | D;
}
