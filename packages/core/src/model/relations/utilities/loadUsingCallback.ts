import { ModelInstance, ModelRelationDotKey, ModelRelationKey } from '@foscia/core/model/types';
import { Arrayable, ArrayableVariadic, Awaitable, wrap, wrapVariadic } from '@foscia/shared';

export default async <
  I extends ModelInstance,
  K extends ModelRelationKey<I> | ModelRelationDotKey<I>,
>(
  instances: Arrayable<I>,
  relations: ArrayableVariadic<K>,
  loader: (instances: I[], relations: K[]) => Awaitable<void>,
) => {
  const allRelations = wrapVariadic(...relations);
  const allInstances = wrap(instances);

  if (!allInstances.length || !allRelations.length) {
    return;
  }

  await loader(allInstances, allRelations);
};
