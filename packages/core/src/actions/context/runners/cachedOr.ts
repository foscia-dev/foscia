import consumeCache from '@foscia/core/actions/context/consumers/consumeCache';
import consumeId from '@foscia/core/actions/context/consumers/consumeId';
import consumeModel from '@foscia/core/actions/context/consumers/consumeModel';
import makeRunnersExtension from '@foscia/core/actions/extensions/makeRunnersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeCache,
  ConsumeId,
  ConsumeInclude,
  ConsumeModel,
  ContextRunner,
} from '@foscia/core/actions/types';
import loaded from '@foscia/core/model/relations/loaded';
import { Model, ModelInstance } from '@foscia/core/model/types';
import { Awaitable, isNil } from '@foscia/shared';

export type CachedData<I extends ModelInstance> = {
  instance: I;
};

/**
 * Retrieve an instance from the cache.
 * If the instance is not in cache or if the included relations are not loaded,
 * run the given runner.
 *
 * @param nilRunner
 * @param transform
 *
 * @category Runners
 */
export default function cachedOr<
  C extends {},
  E extends {},
  M extends Model,
  I extends InstanceType<M>,
  RD,
  ND = I,
>(
  nilRunner: ContextRunner<C & ConsumeCache & ConsumeModel<M>, E, Awaitable<RD>>,
  transform?: (data: CachedData<I>) => Awaitable<ND>,
) {
  return async (
    action: Action<C & ConsumeCache & ConsumeModel<M> & ConsumeInclude & ConsumeId, E>,
  ) => {
    const context = await action.useContext();
    const id = consumeId(context);
    const cache = await consumeCache(context);
    const instance = !isNil(id)
      ? await cache.find(consumeModel(context).$type, id)
      : null;
    if (isNil(instance) || !loaded(instance, context.include ?? [])) {
      return action.run(nilRunner);
    }

    return (transform ? transform({ instance: instance as I }) : instance) as ND;
  };
}

type RunnerExtension = ActionParsedExtension<{
  cachedOr<
    C extends {},
    E extends {},
    M extends Model,
    I extends InstanceType<M>,
    RD,
    ND = I,
  >(
    this: Action<C & ConsumeCache & ConsumeModel<M> & ConsumeInclude & ConsumeId, E>,
    nilRunner: ContextRunner<C & ConsumeCache & ConsumeModel<M>, E, Awaitable<RD>>,
    transform?: (data: CachedData<I>) => Awaitable<ND>,
  ): Promise<Awaited<ND> | Awaited<RD>>;
}>;

cachedOr.extension = makeRunnersExtension({ cachedOr }) as RunnerExtension;
