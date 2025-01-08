import { Model } from '@foscia/core/model/types';
import { ModelsRegistry } from '@foscia/core/types';
import { Optional, Transformer } from '@foscia/shared';

/**
 * Config for registry map implementation.
 *
 * @internal
 */
export type MapRegistryConfig = {
  models?: Model[];
  normalizeType?: Optional<Transformer<string>>;
};

/**
 * Registry implementation using mapped models by types.
 *
 * @internal
 */
export type MapRegistry = ModelsRegistry;
