import { Action, ConsumeModel } from '@foscia/core/actions/types';
import { ModelIdType, ModelInstance, ModelRelation } from '@foscia/core/model/types';
import { ParsedIncludeMap } from '@foscia/core/relations/types';
import { Awaitable } from '@foscia/shared';

/**
 * Standardized eager loader which loads from parsed include.
 *
 * @interface
 *
 * @internal
 */
export type StandardizedEagerLoader = {
  load: (action: Action, relations: ParsedIncludeMap) => Awaitable<void>;
  supportsQueries: boolean;
};

/**
 * Standardized lazy loader which loads from parsed include.
 *
 * @interface
 *
 * @internal
 */
export type StandardizedLazyLoader = {
  load: (instances: ModelInstance[], relations: ParsedIncludeMap) => Awaitable<void>;
};

/**
 * Configuration for {@link makeLoader | `makeLoader`}.
 *
 * @interface
 *
 * @internal
 */
export type LoaderConfig = {
  eagerLoader?: StandardizedEagerLoader;
  lazyLoader?: StandardizedLazyLoader;
};

/**
 * Configuration for {@link makeSmartLoader | `makeSmartLoader`}.
 *
 * @interface
 *
 * @internal
 */
export type SmartLoaderConfig = {
  eagerLoader: StandardizedEagerLoader;
  lazyLoader: StandardizedLazyLoader;
};

/**
 * Configuration for {@link makeFilteredLazyLoader | `makeFilteredLazyLoader`}.
 *
 * @interface
 *
 * @internal
 */
export type FilteredLazyLoaderConfig<Reference> = {
  extract: (
    instance: ModelInstance,
    relation: ModelRelation,
  ) => Awaitable<Reference[] | Reference | null | undefined>;
  prepare: (
    action: Action<ConsumeModel>,
    references: Reference[],
    relation: ModelRelation | null,
  ) => Awaitable<unknown>;
  remap: (
    references: Reference[],
    related: ModelInstance[],
    relation: ModelRelation | null,
  ) => Awaitable<Map<Reference, ModelInstance[]>>;
};

/**
 * Preloaded reference extracted from a raw record.
 *
 * @internal
 */
export type PreloadedReference = {
  type?: string;
  id: ModelIdType;
};

/**
 * Configuration for {@link makePreloadedLazyLoader | `makePreloadedLazyLoader`}.
 *
 * @interface
 *
 * @internal
 */
export type PreloadedLazyLoaderConfig<
  Reference extends PreloadedReference,
  RawReference = any,
> = {
  extract?: (
    instance: ModelInstance,
    relation: ModelRelation,
  ) => RawReference[] | RawReference | null | undefined;
  normalize?: (
    raw: RawReference,
  ) => Awaitable<Reference>;
  prepare: (
    action: Action<ConsumeModel>,
    references: Reference[],
  ) => Awaitable<unknown>;
};
