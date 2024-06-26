import consumeCache from '@foscia/core/actions/context/consumers/consumeCache';
import consumeId from '@foscia/core/actions/context/consumers/consumeId';
import consumeModel from '@foscia/core/actions/context/consumers/consumeModel';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import {
  Action,
  ConsumeCache,
  ConsumeId,
  ConsumeInclude,
  ConsumeModel,
  ContextRunner,
  WithParsedExtension,
} from '@foscia/core/actions/types';
import logger from '@foscia/core/logger/logger';
import filled from '@foscia/core/model/filled';
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
const cachedOr = <
  C extends {},
  E extends {},
  M extends Model,
  I extends InstanceType<M>,
  RD,
  ND = I,
>(
  nilRunner: ContextRunner<C & ConsumeCache & ConsumeModel<M>, E, Awaitable<RD>>,
  transform?: (data: CachedData<I>) => Awaitable<ND>,
) => async (
  action: Action<C & ConsumeCache & ConsumeModel<M> & ConsumeInclude & ConsumeId, E>,
) => {
  const context = await action.useContext();
  const model = consumeModel(context);
  const id = consumeId(context);
  const cache = await consumeCache(context);
  if (!isNil(id)) {
    const instance = await cache.find(model.$type, id);
    if (!isNil(instance)) {
      if (filled(instance) && loaded(instance, context.include ?? [])) {
        return (transform ? transform({ instance: instance as I }) : instance) as ND;
      }

      logger.debug(
        `Record matching \`${model.$type}:${id}\` found in cache, but missing attributes or relations.`,
      );
    } else {
      logger.debug(`No record matching \`${model.$type}:${id}\` found in cache.`);
    }
  } else {
    logger.warn('`cachedOr` has no effect when context ID is null or undefined.');
  }

  return action.run(nilRunner);
};

export default /* @__PURE__ */ appendExtension(
  'cachedOr',
  cachedOr,
  'run',
) as WithParsedExtension<typeof cachedOr, {
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
