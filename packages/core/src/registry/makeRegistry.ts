import { Model } from '@foscia/core/model/types';
import makeMapRegistry from '@foscia/core/registry/makeMapRegistry';
import { ModelsRegistry } from '@foscia/core/types';
import { toKebabCase } from '@foscia/shared';

/**
 * Make a default {@link ModelsRegistry | `ModelsRegistry`} implementation.
 *
 * @param models
 *
 * @category Factories
 */
export default (models: Model[]): { registry: ModelsRegistry; } => makeMapRegistry({
  models,
  normalizeType: toKebabCase,
});
