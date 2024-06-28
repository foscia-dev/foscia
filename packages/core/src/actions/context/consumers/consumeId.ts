import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeId } from '@foscia/core/actions/types';

export default <C extends {}, D = never>(
  context: C & Partial<ConsumeId>,
  defaultValue?: D,
) => consumeContext(context, 'id', [
  'query',
  'update',
  'destroy',
], defaultValue);
