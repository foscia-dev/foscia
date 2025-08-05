import type { Action } from '@foscia/core/actions/types';
import {
  Model,
  ModelInstance,
  ModelPrimaryDictionary,
  ModelPrimaryType, ModelShallowSnapshot,
  ModelSnapshot,
} from '@foscia/core/models/types';
import type { ParsedRawInclude } from '@foscia/core/relations/types';
import { Arrayable, Awaitable } from '@foscia/shared';

/**
 * Registry of available models.
 *
 * It may be used to identify a model to use for a given type (e.g. when deserializing
 * a record into an instance inside a {@link Deserializer | `Deserializer`}).
 */
export interface ModelRegistry {
  /**
   * Get a registered model.
   *
   * @param type
   */
  get(type: string): Promise<Model | undefined>;

  /**
   * Set a registered model.
   *
   * @param model
   */
  set(model: Model): Promise<void>;
}

/**
 * Cache for models' instances.
 *
 * It may be used to cache and retrieve instances (e.g. using {@link cachedOr | `cachedOr`})
 * or keep a unique instance in memory per record (e.g. in a {@link Deserializer | `Deserializer`}).
 */
export interface InstancesCache {
  /**
   * Get a cached instance.
   *
   * @param model
   * @param primary
   */
  get(
    model: Model,
    primary: ModelPrimaryType | ModelPrimaryDictionary,
  ): Promise<ModelInstance | undefined>;

  /**
   * Set a cached instance.
   *
   * @param instance
   */
  set(instance: ModelInstance): Promise<void>;

  /**
   * Delete a cached instance.
   *
   * @param model
   * @param primary
   */
  delete(
    model: Model,
    primary: ModelPrimaryType | ModelPrimaryDictionary,
  ): Promise<void>;
}

/**
 * Action adapter's response.
 */
export interface ActionAdapterResponse<OriginalResponse, Data> {
  /**
   * The original response (e.g. a {@link !Response | `Response`} object for HTTP adapter).
   */
  readonly raw: OriginalResponse;

  /**
   * Read the data from the original response.
   */
  read(): Promise<Data>;
}

/**
 * Adapter to execute actions over a data source.
 *
 * @typeParam OriginalResponse The original response from the data source.
 * @typeParam Data The data which can be read from the original response.
 */
export interface ActionAdapter<OriginalResponse, Data> {
  /**
   * Execute action over the data source.
   *
   * @param action
   */
  execute(action: Action): Promise<ActionAdapterResponse<OriginalResponse, Data>>;
}

/**
 * Data deserializer result.
 */
export interface DataDeserializerResult<
  Instance extends ModelInstance,
  DeserializedData,
> {
  /**
   * Deserialized instances.
   */
  readonly instances: Instance[];
  /**
   * Deserialized complementary data.
   */
  readonly data: DeserializedData;
}

/**
 * Data deserializer to extract models' instances from an adapter's response's data.
 */
export interface DataDeserializer<Data, DeserializedData> {
  /**
   * Deserialize data retrieved using an action into a deserialized data object.
   *
   * @param data
   * @param action
   */
  deserialize(
    data: Data,
    action: Action,
  ): Promise<DataDeserializerResult<ModelInstance, DeserializedData>>;
}

/**
 * Snapshots serializer to transform models' snapshots to serialized records.
 *
 * @interface
 */
export interface SnapshotsSerializer<SerializedData> {
  /**
   * Serialize snapshots to data.
   *
   * @param snapshots
   * @param action
   */
  serialize(
    snapshots: Arrayable<ModelSnapshot | ModelShallowSnapshot> | null,
    action: Action,
  ): Promise<SerializedData>;
}

// TODO Operation adapter (extract CRUD logic from adapter).
// TODO Filtering adapter (where logic).
// TODO Sorting adapter (sort logic).
// TODO Pagination adapter (pagination logic).

/**
 * Relations loader to eager and/or lazy load relations.
 *
 * @since 0.13.0
 *
 * @interface
 */
export type RelationsLoader = {
  /**
   * Prepare the given action's context to request inclusion of relations
   * through the adapter. It will usually update the action's context
   * to request relationships eager loading to the adapter (e.g. `include`
   * query parameter in a JSON:API context). It can also schedule a lazy
   * eager loading if needed.
   *
   * @param action
   * @param relations
   */
  eagerLoad?: (
    action: Action,
    relations: ParsedRawInclude[],
  ) => Awaitable<void>;
  /**
   * Lazy load relations on multiple instances.
   * It will usually read relations for each instance (e.g. relations endpoint
   * in a JSON:API context) or read each related models with appropriate
   * filters (e.g. models endpoint with specific parameters to filter related
   * records in a REST or SQL context).
   *
   * @param instances
   * @param relations
   */
  lazyLoad?: (
    instances: ModelInstance[],
    relations: ParsedRawInclude[],
  ) => Awaitable<void>;
  /**
   * Lazy load missing (non-loaded) relations on multiple instances.
   *
   * @param instances
   * @param relations
   */
  lazyLoadMissing?: (
    instances: ModelInstance[],
    relations: ParsedRawInclude[],
  ) => Awaitable<void>;
};
