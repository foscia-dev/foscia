import include from '@foscia/core/actions/context/enhancers/include';
import query from '@foscia/core/actions/context/enhancers/query';
import all from '@foscia/core/actions/context/runners/all';
import one from '@foscia/core/actions/context/runners/one';
import { AnonymousRunner } from '@foscia/core/actions/types';
import resolveModelRelationAction from '@foscia/core/connections/resolveModelRelationAction';
import isPluralRelationDef from '@foscia/core/model/props/checks/isPluralRelationDef';
import groupRelationsByRoots from '@foscia/core/model/props/utilities/groupRelationsByRoots';
import loadUsingValue from '@foscia/core/model/props/utilities/loadUsingValue';
import {
  ModelInstance,
  ModelRelation,
  ModelRelationDotKey,
  ModelRelationKey,
} from '@foscia/core/model/types';
import { Arrayable, wrap } from '@foscia/shared';

export default async <I extends ModelInstance>(
  instance: I,
  relations: Arrayable<ModelRelationDotKey<I>>,
) => {
  const groupedRelations = groupRelationsByRoots(wrap(relations));

  await Promise.all([...groupedRelations.entries()].map(async ([relation, nested]) => {
    const def = instance.$model.$schema[relation] as ModelRelation;
    const isPlural = isPluralRelationDef(def);

    const action = await resolveModelRelationAction(def);
    const value = await action(
      query(instance, relation),
      include(nested as any),
      (
        isPlural ? all() : one()
      ) satisfies AnonymousRunner<any, Promise<Arrayable<ModelInstance> | null>>,
    );

    loadUsingValue(instance, relation as ModelRelationKey<I>, value as any);
  }));
};
