import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeRegistry } from '@foscia/core/actions/types';
import { value } from '@foscia/shared';

export default <C extends {}, D = never>(
  context: C & Partial<ConsumeRegistry>,
  defaultValue?: D,
) => value(consumeContext(context, 'registry', ['context'], defaultValue));
