import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeModel } from '@foscia/core/actions/types';
import { Model } from '@foscia/core/model/types';

export default <C extends {}, M extends Model, D = never>(
  context: C & Partial<ConsumeModel<M>>,
  defaultValue?: D,
) => consumeContext(context, 'model', [
  'query',
  'create',
  'update',
  'save',
  'destroy',
], defaultValue);
