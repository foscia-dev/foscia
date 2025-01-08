import { ModelIdType, ModelInstance } from '@foscia/core/model/types';
import { InstancesCache } from '@foscia/core/types';
import { Awaitable, Optional, Transformer } from '@foscia/shared';

/**
 * Config for the timeout ref manager.
 *
 * @internal
 */
export type TimeoutRefConfig = {
  timeout: number;
};

/**
 * Timeout ref object.
 *
 * @internal
 */
export type TimeoutRef<T> = { deref: () => T | undefined; };

/**
 * Reference manager to retain cached instances in cache.
 *
 * @internal
 */
export type RefManager<R> = {
  /**
   * Create a ref to an instance.
   *
   * @param instance
   */
  ref(instance: ModelInstance): Awaitable<R>;
  /**
   * Retrieve an instance from a ref. If ref expired, it can return `undefined`.
   *
   * @param ref
   */
  value(ref: R): Awaitable<ModelInstance | undefined>;
};

/**
 * Config for refs cache implementation.
 *
 * @internal
 */
export type RefsCacheConfig<R = unknown> = {
  /**
   * Manager to use to create and resolve reference to instances.
   */
  manager: RefManager<R>;
  /**
   * Normalize the type before storing and resolving instances.
   */
  normalizeType?: Optional<Transformer<string>>;
  /**
   * Normalize the ID before storing and resolving instances.
   */
  normalizeId?: Optional<Transformer<ModelIdType>>;
};

/**
 * Cache implementation using references.
 *
 * @internal
 */
export type RefsCache = InstancesCache;
