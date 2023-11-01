import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeModel } from '@foscia/core/actions/types';
import { Model } from '@foscia/core/model/types';

export default function consumeModel<C extends {}, M extends Model, D = never>(
  context: C & Partial<ConsumeModel<M>>,
  defaultValue?: D,
) {
  return consumeContext(context, 'model', [
    'forModel',
    'find',
    'create',
    'update',
    'save',
    'destroy',
    'forInstance',
    'forRelation',
    'target',
  ], defaultValue);
}
