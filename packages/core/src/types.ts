import type { Action } from '@foscia/core/actions/types';
import type {
  Model,
  ModelIdType,
  ModelInstance,
  ModelRelation,
  ModelSnapshot,
} from '@foscia/core/model/types';
import { ParsedRawInclude } from '@foscia/core/relations/types';
import { Arrayable, Awaitable } from '@foscia/shared';

declare global {
  /**
   * Foscia namespace can be overloaded by end-users for better types resolution.
   *
   * @since 0.13.0
   *
   * @example
   * ```typescript
   * import type Comment from './models/comment';
   * import type Post from './models/post';
   * import type User from './models/user';
   * import type FileV2 from './models/v2/file';
   *
   * declare global {
   *   namespace Foscia {
   *     interface CustomTypes {
   *       /**
   *        * Define mapping between type strings and models.
   *        *\/
   *       models: {
   *         // If using default connection.
   *         comments: Comment;
   *         posts: Post;
   *         users: User;
   *         // If using multiple connections.
   *         'v2:files': FileV2;
   *       };
   *     }
   *   }
   * }
   * ```
   */
  export namespace Foscia {
    export interface CustomTypes {
    }
  }
}

/**
 * Registry containing available models.
 *
 * It will be used by other dependencies, like {@link Deserializer | `Deserializer`},
 * to deserialize raw data source records in the correct models.
 *
 * @interface
 *
 * @remarks
 * `rawType` must be using the `<connection?>:<type>` format. If connection is
 * omitted, `default` connection is used.
 */
export type ModelsRegistry = {
  /**
   * Resolve a registered model by its raw type.
   *
   * @param rawType
   */
  resolve(rawType: string): Awaitable<Model | null>;
};

/**
 * Cache containing already synced models instances.
 *
 * It is used by some runners, like {@link cachedOr | `cachedOr`}, to extract
 * a cached instance instead of fetching it.
 * It will also be used by other dependencies, like {@link Deserializer | `Deserializer`},
 * to prevent multiple instance of the same record coexisting or to store an instance
 * as retrieved.
 *
 * @interface
 *
 * @remarks
 * `rawType` must be using the `<connection?>:<type>` format. If connection is
 * omitted, `default` connection is used.
 */
export type InstancesCache = {
  // TODO More map alike methods?
  /**
   * Retrieve a model instance from cache.
   *
   * @param rawType
   * @param id
   */
  find(
    rawType: string,
    id: ModelIdType,
  ): Awaitable<ModelInstance | null>;
  /**
   * Put a model instance inside cache.
   *
   * @param rawType
   * @param id
   * @param instance
   */
  put(
    rawType: string,
    id: ModelIdType,
    instance: ModelInstance,
  ): Awaitable<void>;
  /**
   * Forget a model's instance.
   *
   * @param rawType
   * @param id
   */
  forget(
    rawType: string,
    id: ModelIdType,
  ): Awaitable<void>;
  /**
   * Forget all model's instances.
   *
   * @param rawType
   */
  forgetAll(
    rawType: string,
  ): Awaitable<void>;
  /**
   * Forget all models' instances.
   */
  clear(): Awaitable<void>;
};

/**
 * Adapter raw response wrapper.
 *
 * @typeParam RawData Adapter's original response (e.g. a
 * {@link !Response | `Response`} object for HTTP adapter).
 * @typeParam Data Adapter's original response data, containing records or relations data.
 */
export type AdapterResponse<RawData, Data = unknown> = {
  /**
   * The original response (e.g. a {@link !Response | `Response`} object for HTTP adapter).
   */
  readonly raw: RawData;
  /**
   * Read the original response data.
   * This will be used to deserialize instances from data
   * by {@link Deserializer | `Deserializer`}.
   * This method may not support to be called multiple times,
   * prefer calling it only once and reusing returned value.
   */
  read(): Awaitable<Data>;
};

/**
 * Adapter interacting with the data source.
 *
 * @typeParam RawData Adapter's original response (e.g. a
 * {@link !Response | `Response`} object for HTTP adapter).
 * @typeParam Data Adapter's original response data, containing records or relations data.
 *
 * @interface
 */
export type Adapter<RawData, Data = any> = {
  /**
   * Execute a given action to retrieve a raw data response.
   * Context data will already be serialized using serializer if available.
   *
   * @param action
   */
  execute(action: Action): Awaitable<AdapterResponse<RawData, Data>>;
};

/**
 * Base deserialized data which must contain at least an instances array.
 */
export type DeserializedData<I extends ModelInstance = ModelInstance> = {
  /**
   * Deserialized instances.
   */
  instances: I[];
};

/**
 * Deserializer converting adapter response read data to a deserialized array of instances.
 *
 * @typeParam Data Adapter's original response data, containing records or relations data.
 * @typeParam Deserialized Object containing deserialized instances and other
 * relevant deserialized data (e.g. the document for a JSON:API response).
 *
 * @interface
 */
export type Deserializer<Data, Deserialized extends DeserializedData = DeserializedData> = {
  /**
   * Deserialize adapter data to a deserialized array of instances.
   *
   * @param data
   * @param action
   */
  deserialize(data: Data, action: Action): Awaitable<Deserialized>;
};

/**
 * Serializer converting model instances to adapter data source format.
 *
 * @typeParam Record Serialized value for an instance.
 * @typeParam RelatedRecord Serialized value for a related instance.
 * @typeParam Data Serialized value for one/many/none instances.
 * Usually, it is a wrapper type for `Record` or `RelatedRecord` records.
 *
 * @interface
 */
export type Serializer<Record, RelatedRecord, Data> = {
  /**
   * Serialize snapshots to records.
   *
   * @param snapshot
   * @param action
   */
  serializeToRecords(snapshot: ModelSnapshot, action: Action): Awaitable<Record>;
  /**
   * Serialize snapshots to records.
   *
   * @param snapshots
   * @param action
   */
  serializeToRecords(snapshots: ModelSnapshot[], action: Action): Awaitable<Record[]>;
  /**
   * Serialize snapshots to records.
   *
   * @param snapshot
   * @param action
   */
  serializeToRecords(snapshot: null, action: Action): Awaitable<null>;
  /**
   * Serialize snapshots to records.
   *
   * @param snapshot
   * @param action
   */
  serializeToRecords(
    snapshot: ModelSnapshot[] | ModelSnapshot | null,
    action: Action,
  ): Awaitable<Record[] | Record | null>;
  /**
   * Serialize related snapshots to related records.
   *
   * @param parent
   * @param prop
   * @param snapshot
   * @param action
   */
  serializeToRelatedRecords(
    parent: ModelSnapshot,
    prop: ModelRelation,
    snapshot: ModelSnapshot,
    action: Action,
  ): Awaitable<RelatedRecord>;
  /**
   * Serialize related snapshots to related records.
   *
   * @param parent
   * @param prop
   * @param snapshots
   * @param action
   */
  serializeToRelatedRecords(
    parent: ModelSnapshot,
    prop: ModelRelation,
    snapshots: ModelSnapshot[],
    action: Action,
  ): Awaitable<RelatedRecord[]>;
  /**
   * Serialize related snapshots to related records.
   *
   * @param parent
   * @param prop
   * @param snapshot
   * @param action
   */
  serializeToRelatedRecords(
    parent: ModelSnapshot,
    prop: ModelRelation,
    snapshot: null,
    action: Action,
  ): Awaitable<null>;
  /**
   * Serialize related snapshots to related records.
   *
   * @param parent
   * @param prop
   * @param snapshot
   * @param action
   */
  serializeToRelatedRecords(
    parent: ModelSnapshot,
    prop: ModelRelation,
    snapshot: ModelSnapshot[] | ModelSnapshot | null,
    action: Action,
  ): Awaitable<RelatedRecord[] | RelatedRecord | null>;
  /**
   * Serialize already serialized records to data.
   * It will usually only wrap records if necessary (e.g. to a `data` key
   * in a JSON:API context).
   *
   * @param records
   * @param action
   */
  serializeToData(
    records: Arrayable<Record | RelatedRecord> | null,
    action: Action,
  ): Awaitable<Data>;
};

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
