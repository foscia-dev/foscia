import consumeCache from '@foscia/core/actions/context/consumers/consumeCache';
import consumeId from '@foscia/core/actions/context/consumers/consumeId';
import consumeModel from '@foscia/core/actions/context/consumers/consumeModel';
import {
  Action,
  AnonymousRunner,
  ConsumeCache,
  ConsumeId,
  ConsumeModel,
  InferQueryInstance,
} from '@foscia/core/actions/types';
import makeRunner from '@foscia/core/actions/utilities/makeRunner';
import logger from '@foscia/core/logger/logger';
import { ModelInstance } from '@foscia/core/model/types';
import filled from '@foscia/core/model/utilities/filled';
import { Awaitable } from '@foscia/shared';

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
 * const post = await action(query(Post, '123'), cachedOr(() => null));
 * ```
 */
export default /* @__PURE__ */ makeRunner('cachedOr', <
  C extends {},
  I extends InferQueryInstance<C>,
  RD,
  ND = I,
>(
  nilRunner: AnonymousRunner<C & ConsumeCache & ConsumeModel, Awaitable<RD>>,
  // TODO No transform, instead, options that allow using relations loader.
  transform?: (data: CachedData<I>) => Awaitable<ND>,
) => async (
  action: Action<C & ConsumeCache & ConsumeModel & ConsumeId>,
) => {
  const model = await consumeModel(action);
  const id = await consumeId(action);
  const cache = await consumeCache(action);
  const instance = await cache.find(`${model.$connection}:${model.$type}`, id);
  if (instance) {
    // TODO If lazyLoadMissing available, use it.
    // TODO Otherwise, consider missing relations if eager loaded relations.
    if (filled(instance)) {
      return (transform ? transform({ instance: instance as I }) : instance) as ND;
    }

    logger.debug(
      `Record matching \`${model.$type}:${id}\` found in cache, but missing attributes or loaded relations.`,
    );
  } else {
    logger.debug(`No record matching \`${model.$type}:${id}\` found in cache.`);
  }

  return action.run(nilRunner);
});
