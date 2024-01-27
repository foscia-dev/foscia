import { all, forRelation, one, when } from '@foscia/core/actions';
import { ActionFactory, ConsumeAdapter, ConsumeDeserializer } from '@foscia/core/actions/types';
import isPluralRelationDef from '@foscia/core/model/checks/isPluralRelationDef';
import loadUsingValue from '@foscia/core/model/relations/loadUsingValue';
import { ModelInstance, ModelRelationKey } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Arrayable, ArrayableVariadic, wrap, wrapVariadic } from '@foscia/shared';

export default function makeForRelationLoader<
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
>(action: ActionFactory<[], C, any>) {
  return async <I extends ModelInstance>(
    instances: Arrayable<I>,
    ...relations: ArrayableVariadic<ModelRelationKey<I>>
  ) => {
    const allRelations = wrapVariadic(...relations);
    if (!allRelations.length) {
      return;
    }

    await Promise.all(wrap(instances).map(async (instance) => {
      await Promise.all(wrapVariadic(...relations).map(async (relation) => {
        const def = instance.$model.$schema[relation];
        const isPlural = isPluralRelationDef(def);

        const value = await action()
          .use(forRelation(instance, relation))
          .run(when(isPlural, all(), one()));

        loadUsingValue(instance, relation, value as any);
      }));
    }));
  };
}
