import { Model } from '@foscia/core/model/types';
import makeMapRegistry from '@foscia/core/registry/makeMapRegistry';
import { RegistryI } from '@foscia/core/types';
import { toKebabCase } from '@foscia/shared';

/**
 * Make a default {@link RegistryI | `RegistryI`} implementation.
 *
 * @param models
 *
 * @category Factories
 */
export default (models: Model[]): { registry: RegistryI; } => makeMapRegistry({
  models,
  normalizeType: toKebabCase,
});
