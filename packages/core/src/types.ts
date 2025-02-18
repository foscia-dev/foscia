import type { ActionFactory } from '@foscia/core/actions/types';
import type {
  Model,
  ModelIdType,
  ModelInstance,
  ModelRelation,
  ModelSnapshot,
} from '@foscia/core/model/types';
import { Arrayable, Awaitable } from '@foscia/shared';

/**
 * Registry containing mapping between connections names
 * and corresponding action factories.
 *
 * @interface
 *
 * @internal
 */
export type ConnectionsRegistry = {
  /**
   * Register an action factory.
   *
   * @param connection
   * @param action
   */
  register(connection: string, action: ActionFactory<any>): void;
  /**
   * Get an action factory.
   *
   * @param connection
   *
   * @internal
   */
  get(connection?: string | undefined): ActionFactory<any>;
  /**
   * Get all available action factories keyed by connection name.
   *
   * @internal
   */
  all(): Map<string, ActionFactory<any>>;
};

/**
 * Registry containing available models.
 *
 * It will be used by other dependencies, like {@link Deserializer | `Deserializer`},
 * to deserialize raw data source records in the correct models.
 *
 * @interface
 */
export type ModelsRegistry = {
  /**
   * Resolve a registered model by its type.
   * Type may be normalized during resolution to support multiple casing/patterns.
   *
   * @param rawType
   */
  modelFor(rawType: string): Promise<Model | null>;
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
 */
export type InstancesCache = {
  /**
   * Retrieve a model instance from cache.
   *
   * @param type
   * @param id
   */
  find(type: string, id: ModelIdType): Promise<ModelInstance | null>;
  /**
   * Put a model instance inside cache.
   *
   * @param type
   * @param id
   * @param instance
   */
  put(type: string, id: ModelIdType, instance: ModelInstance): Promise<void>;
  /**
   * Forget a model's instance.
   *
   * @param type
   * @param id
   */
  forget(type: string, id: ModelIdType): Promise<void>;
  /**
   * Forget all model's instances.
   *
   * @param type
   */
  forgetAll(type: string): Promise<void>;
  /**
   * Forget all models' instances.
   */
  clear(): Promise<void>;
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
  read(): Promise<Data>;
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
   * Execute a given context to retrieve a raw data response.
   * Context data will already be serialized using serializer if available.
   *
   * @param context
   */
  execute(context: {}): Awaitable<AdapterResponse<RawData, Data>>;
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
   * @param context
   */
  deserialize(data: Data, context: {}): Awaitable<Deserialized>;
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
   * @param context
   */
  serializeToRecords(snapshot: ModelSnapshot, context: {}): Awaitable<Record>;
  /**
   * Serialize snapshots to records.
   *
   * @param snapshots
   * @param context
   */
  serializeToRecords(snapshots: ModelSnapshot[], context: {}): Awaitable<Record[]>;
  /**
   * Serialize snapshots to records.
   *
   * @param snapshot
   * @param context
   */
  serializeToRecords(snapshot: null, context: {}): Awaitable<null>;
  /**
   * Serialize snapshots to records.
   *
   * @param snapshot
   * @param context
   */
  serializeToRecords(
    snapshot: ModelSnapshot[] | ModelSnapshot | null,
    context: {},
  ): Awaitable<Record[] | Record | null>;
  /**
   * Serialize related snapshots to related records.
   *
   * @param parent
   * @param def
   * @param snapshot
   * @param context
   */
  serializeToRelatedRecords(
    parent: ModelSnapshot,
    def: ModelRelation,
    snapshot: ModelSnapshot,
    context: {},
  ): Awaitable<RelatedRecord>;
  /**
   * Serialize related snapshots to related records.
   *
   * @param parent
   * @param def
   * @param snapshots
   * @param context
   */
  serializeToRelatedRecords(
    parent: ModelSnapshot,
    def: ModelRelation,
    snapshots: ModelSnapshot[],
    context: {},
  ): Awaitable<RelatedRecord[]>;
  /**
   * Serialize related snapshots to related records.
   *
   * @param parent
   * @param def
   * @param snapshot
   * @param context
   */
  serializeToRelatedRecords(
    parent: ModelSnapshot,
    def: ModelRelation,
    snapshot: null,
    context: {},
  ): Awaitable<null>;
  /**
   * Serialize related snapshots to related records.
   *
   * @param parent
   * @param def
   * @param snapshot
   * @param context
   */
  serializeToRelatedRecords(
    parent: ModelSnapshot,
    def: ModelRelation,
    snapshot: ModelSnapshot[] | ModelSnapshot | null,
    context: {},
  ): Awaitable<RelatedRecord[] | RelatedRecord | null>;
  /**
   * Serialize already serialized records to data.
   * It will usually only wrap records if necessary (e.g. to a `data` key
   * in a JSON:API context).
   *
   * @param records
   * @param context
   */
  serializeToData(records: Arrayable<Record | RelatedRecord> | null, context: {}): Awaitable<Data>;
};
