import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeRelation } from '@foscia/core/actions/types';

export default <C extends {}, D = never>(
  context: C & Partial<ConsumeRelation>,
  defaultValue?: D,
) => consumeContext(context, 'relation', ['query'], defaultValue);
