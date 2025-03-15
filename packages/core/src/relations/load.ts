import consumeLoader from '@foscia/core/actions/context/consumers/consumeLoader';
import resolveModelAction from '@foscia/core/connections/resolveModelAction';
import logger from '@foscia/core/logger/logger';
import { ModelInstance } from '@foscia/core/model/types';
import { RawInclude, RawIncludeOptions } from '@foscia/core/relations/types';
import toParsedRawInclude from '@foscia/core/relations/utilities/toParsedRawInclude';
import { wrap } from '@foscia/shared';

/**
 * Lazy eager load given relations on instances through configured
 * {@link RelationsLoader | `RelationsLoader`}.
 *
 * @param instance
 * @param relations
 * @param options
 *
 * @since 0.13.0
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { load } from '@foscia/core';
 *
 * await load(post, ['comments', 'comments.author']);
 * ```
 */
export default async <I extends ModelInstance>(
  instance: I | I[],
  relations: RawInclude<I>,
  options?: RawIncludeOptions,
) => {
  const instances = wrap(instance);
  if (instances.length) {
    const action = resolveModelAction(instances[0].$model)();
    const loader = await consumeLoader(action);
    if (!loader.lazyLoad) {
      logger.warn('Load has no effect when no relations lazy loader is setup.');
    }

    await loader.lazyLoad?.(instances, [toParsedRawInclude(relations, options)]);
  }
};
