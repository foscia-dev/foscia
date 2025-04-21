import { Model } from '@foscia/core/model/types';
import { ModelsRegistry } from '@foscia/core/types';

/**
 * Config for registry map implementation.
 *
 * @interface
 *
 * @internal
 */
export type MapRegistryConfig<M extends readonly Model[]> = {
  models: M;
  normalizeType?: (type: string) => string;
};

/**
 * Registry implementation using mapped models by types.
 *
 * @interface
 *
 * @internal
 */
export type MapRegistry<M extends readonly Model[]> = ModelsRegistry<M>;
