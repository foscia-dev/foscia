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
import ExpectedRunFailureError from '@foscia/core/errors/expectedRunFailureError';
import { Model } from '@foscia/core/model/types';
import { Awaitable } from '@foscia/shared';

/**
 * Retrieve an instance from the cache.
 * If the instance is not in cache or if the included relations are not loaded,
 * throws an "ExpectedRunFailureError".
 *
 * @category Runners
 */
function cachedOrFail<
  C extends {},
  M extends Model,
  I extends InstanceType<M>,
  ND = I,
>(transform?: (data: CachedData<I>) => Awaitable<ND>) {
  return cachedOr<C, any, M, I, never, ND>(() => {
    throw new ExpectedRunFailureError(
      '`cachedOrFail` failed. You may handle this error globally as a "not found" record error.',
    );
  }, transform);
}

export default /* @__PURE__ */ appendExtension(
  'cachedOrFail',
  cachedOrFail,
  'run',
) as WithParsedExtension<typeof cachedOrFail, {
  cachedOrFail<
    C extends {},
    M extends Model,
    I extends InstanceType<M>,
    ND = I,
  >(
    this: Action<C & ConsumeCache & ConsumeModel<M> & ConsumeInclude & ConsumeId>,
    transform?: (data: CachedData<I>) => Awaitable<ND>,
  ): Promise<ND>;
}>;
