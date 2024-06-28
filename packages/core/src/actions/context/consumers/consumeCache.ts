import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeCache } from '@foscia/core/actions/types';
import { value } from '@foscia/shared';

export default <C extends {}, D = never>(
  context: C & Partial<ConsumeCache>,
  defaultValue?: D,
) => value(consumeContext(context, 'cache', ['context'], defaultValue));
