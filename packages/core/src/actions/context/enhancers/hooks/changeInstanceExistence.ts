import onSuccess from '@foscia/core/actions/context/enhancers/hooks/onSuccess';
import { Action, ConsumeInstance } from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';

export default function changeInstanceExistence<C extends {}, I extends ModelInstance>(
  willExists: boolean,
) {
  return (action: Action<C & ConsumeInstance<I>>) => action.use(onSuccess(({ context }) => {
    context.instance.$exists = willExists;
  }));
}
