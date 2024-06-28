import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeAction } from '@foscia/core/actions/types';

export default <C extends {}, D = never>(
  context: C & Partial<ConsumeAction>,
  defaultValue?: D,
) => consumeContext(context, 'action', ['context'], defaultValue);
