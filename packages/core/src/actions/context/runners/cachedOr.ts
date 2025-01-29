import consumeCache from '@foscia/core/actions/context/consumers/consumeCache';
import consumeId from '@foscia/core/actions/context/consumers/consumeId';
import consumeModel from '@foscia/core/actions/context/consumers/consumeModel';
import makeRunner from '@foscia/core/actions/makeRunner';
import {
  Action,
  ConsumeCache,
  ConsumeId,
  ConsumeInclude,
  ConsumeModel,
  ContextRunner,
  InferQueryInstance,
} from '@foscia/core/actions/types';
import logger from '@foscia/core/logger/logger';
import filled from '@foscia/core/model/filled';
import loaded from '@foscia/core/model/relations/loaded';
import { ModelInstance } from '@foscia/core/model/types';
import { Awaitable, isNil } from '@foscia/shared';

/**
 * Data retrieved with {@link cachedOr | `cachedOr`} which can be transformed
 * to another return value than an instance.
 */
export type CachedData<I extends ModelInstance> = {
  instance: I;
};

/**
 * Retrieve an instance from the cache.
 * If the instance is not in cache or if the included relations are not loaded,
 * run the given anonymous runner.
 *
 * @param nilRunner
 * @param transform
 *
 * @category Runners
 * @requireContext cache, model, id
 *
 * @example
 * ```typescript
 * import { cachedOr, query } from '@foscia/core';
 *
 * const post = await action().run(query(Post, '123'), cachedOr(() => null));
 * ```
 */
export default /* @__PURE__ */ makeRunner('cachedOr', <
  C extends {},
  I extends InferQueryInstance<C>,
  RD,
  ND = I,
>(
  nilRunner: ContextRunner<C & ConsumeCache & ConsumeModel, Awaitable<RD>>,
  transform?: (data: CachedData<I>) => Awaitable<ND>,
) => async (
  action: Action<C & ConsumeCache & ConsumeModel & ConsumeInclude & ConsumeId>,
) => {
  const context = await action.useContext();
  const model = consumeModel(context);
  const id = consumeId(context);
  const cache = await consumeCache(context);
  if (!isNil(id)) {
    const instance = await cache.find(model.$type, id);
    if (instance) {
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
});
