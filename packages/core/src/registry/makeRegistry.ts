import { Model } from '@foscia/core/models/types';
import makeMapRegistry from '@foscia/core/registry/makeMapRegistry';
import { ModelRegistry } from '@foscia/core/types';

/**
 * Make a default {@link ModelsRegistry | `ModelsRegistry`} implementation.
 *
 * @param models
 *
 * @category Factories
 */
export default function makeRegistry(models: Model[]): ModelRegistry {
  const registry = makeMapRegistry();

  models.forEach((model) => registry.set(model));

  return registry;
}
