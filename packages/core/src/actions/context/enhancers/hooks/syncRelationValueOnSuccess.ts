import consumeInstance from '@foscia/core/actions/context/consumers/consumeInstance';
import consumeRelation from '@foscia/core/actions/context/consumers/consumeRelation';
import onSuccess from '@foscia/core/actions/context/enhancers/hooks/onSuccess';
import { Action, ConsumeInstance, ConsumeRelation } from '@foscia/core/actions/types';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import { ModelInferPropValue, ModelInstance, ModelRelation } from '@foscia/core/model/types';

export default function syncRelationValueOnSuccess<
  C extends {},
  I extends ModelInstance,
  R extends ModelRelation,
>(value: ModelInferPropValue<R>) {
  return (
    action: Action<C & ConsumeInstance<I> & ConsumeRelation<R>>,
  ) => action.use(onSuccess(({ context }) => {
    const instance = consumeInstance(context);
    const relation = consumeRelation(context);
    instance[relation.key as keyof I] = value;
    markSynced(instance, relation.key as any);
  }));
}
