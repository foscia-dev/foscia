import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeQueryAs } from '@foscia/core/actions/types';
import { Model } from '@foscia/core/model/types';

/**
 * Retrieve the "query as" models from a context.
 *
 * @param context
 * @param defaultValue
 */
export default <C extends {}, M extends Model, D = never>(
  context: C & Partial<ConsumeQueryAs<M>>,
  defaultValue?: D,
) => consumeContext(context, 'queryAs', ['queryAs'], defaultValue);
