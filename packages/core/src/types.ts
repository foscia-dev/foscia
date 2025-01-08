import type { Model, ModelIdType, ModelInstance, ModelRelation } from '@foscia/core/model/types';
import type { Arrayable, Awaitable } from '@foscia/shared';

/**
 * Registry containing available models.
 *
 * It will be used by other dependencies, like {@link Deserializer | `Deserializer`},
 * to deserialize raw data source records in the correct models.
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
 * Serializer converting model instances to adapter data source format.
 *
 * @typeParam Record Serialized value for an instance.
 * @typeParam Related Serialized value for a related instance.
 * @typeParam Data Serialized value for one/many/none instances.
 * Usually, it is a wrapper type for `Record` or `Related` records.
 */
export type Serializer<Record, Related, Data> = {
  /**
   * Serialize a given instance value.
   *
   * @param value
   * @param context
   */
  serializeInstance(value: ModelInstance, context: {}): Awaitable<Record>;
  /**
   * Serialize a given instance's relation value.
   *
   * @param instance
   * @param def
   * @param value
   * @param context
   */
  serializeRelation(
    instance: ModelInstance,
    def: ModelRelation,
    value: Arrayable<ModelInstance> | null,
    context: {},
  ): Awaitable<Arrayable<Related> | null>;
  /**
   * Serialize a set of already serialized records.
   * This should be used to "wrap" records.
   *
   * @param records
   * @param context
   */
  serialize(records: Arrayable<Record | Related> | null, context: {}): Awaitable<Data>;
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
