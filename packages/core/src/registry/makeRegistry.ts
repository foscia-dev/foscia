import { Model } from '@foscia/core/model/types';
import makeMapRegistry from '@foscia/core/registry/makeMapRegistry';
import { ModelsRegistry } from '@foscia/core/types';
import { kebabCase } from '@foscia/shared';

/**
 * Make a default {@link ModelsRegistry | `ModelsRegistry`} implementation.
 *
 * @param models
 *
 * @category Factories
 */
export default <M extends readonly Model[]>(models: M): ModelsRegistry<M> => makeMapRegistry({
  models,
  normalizeType: kebabCase,
});
