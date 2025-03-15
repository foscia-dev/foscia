import type { TimedRefFactoryConfig } from '@foscia/core/cache/makeTimedRefFactory';
import { ModelIdType, ModelInstance } from '@foscia/core/model/types';
import { InstancesCache } from '@foscia/core/types';
import { Awaitable } from '@foscia/shared';

export type {
  TimedRefFactoryConfig,
};

/**
 * Function which stores a reference to a value.
 * Calling the function retrieves the value, or `null` if the reference
 * expired.
 *
 * @internal
 */
export type RefValue<V> = () => Awaitable<V | null>;

/**
 * Factory to create a reference to a value.
 *
 * @internal
 */
export type RefFactory<V> = (value: V) => Awaitable<RefValue<V>>;

/**
 * Config for refs cache implementation.
 *
 * @interface
 *
 * @internal
 */
export type RefsCacheConfig = {
  /**
   * Create a reference to a model instance.
   */
  makeRef: RefFactory<ModelInstance>;
  /**
   * Normalize the type before storing and resolving instances.
   */
  normalizeType?: (type: string) => string;
  /**
   * Normalize the ID before storing and resolving instances.
   */
  normalizeId?: (id: ModelIdType) => ModelIdType;
};

/**
 * Cache implementation using references.
 *
 * @interface
 *
 * @internal
 */
export type RefsCache = InstancesCache;
