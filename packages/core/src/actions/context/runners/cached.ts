import cachedOr, { CachedData } from '@foscia/core/actions/context/runners/cachedOr';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import {
  Action,
  ConsumeCache,
  ConsumeId,
  ConsumeInclude,
  ConsumeModel,
  WithParsedExtension,
} from '@foscia/core/actions/types';
import { Model } from '@foscia/core/model/types';
import { Awaitable } from '@foscia/shared';

/**
 * Retrieve an instance from the cache.
 * If the instance is not in cache or if the included relations are not loaded,
 * returns null.
 *
 * @category Runners
 */
function cached<
  C extends {},
  M extends Model,
  I extends InstanceType<M>,
  ND = I,
>(transform?: (data: CachedData<I>) => Awaitable<ND>) {
  return cachedOr<C, any, M, I, null, ND>(() => null, transform);
}

export default /* @__PURE__ */ appendExtension(
  'cached',
  cached,
  'run',
) as WithParsedExtension<typeof cached, {
  cached<
    C extends {},
    M extends Model,
    I extends InstanceType<M>,
    ND = I,
  >(
    this: Action<C & ConsumeCache & ConsumeModel<M> & ConsumeInclude & ConsumeId>,
    transform?: (data: CachedData<I>) => Awaitable<ND>,
  ): Promise<ND | null>;
}>;
