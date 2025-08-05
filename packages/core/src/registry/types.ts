import { Model } from '@foscia/core/models/oldTypes';
import { ModelRegistry } from '@foscia/core/types';

/**
 * Config for registry map implementation.
 *
 * @interface
 *
 * @internal
 */
export type MapRegistryConfig = {
  models: Model[];
  normalizeType?: (type: string) => string;
};

/**
 * Registry implementation using mapped models by types.
 *
 * @interface
 *
 * @internal
 */
export type MapRegistry = ModelRegistry;
