import type { Model, ModelIdType, ModelInstance, ModelRelation } from '@foscia/core/model/types';
import type { Arrayable, Awaitable } from '@foscia/shared';

/**
 * Registry containing available models for actions.
 */
export interface RegistryI {
  /**
   * Resolve a registered model by its type.
   * Type may be normalized for easier resolve.
   *
   * @param rawType
   */
  modelFor(rawType: string): Promise<Model | null>;
}

/**
 * Cache containing already synced models instances.
 */
export interface CacheI {
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
}

/**
 * Adapter response data wrapper object.
 *
 * @typeParam RawData Adapter's original response its implementation
 * (e.g. a Response object for HTTP adapter using fetch).
 * @typeParam Data Content of the adapter's original response, containing
 * records or relations data.
 */
export interface AdapterResponseI<RawData, Data = unknown> {
  /**
   * The raw original data (e.g. a Response object for HttpAdapter).
   */
  readonly raw: RawData;

  /**
   * Read the original response data.
   * This will be used to deserialize instances from data.
   * This method may not support to be called multiple times,
   * prefer calling it only once and reusing returned value.
   */
  read(): Promise<Data>;
}

/**
 * Adapter interacting with the data source.
 *
 * @typeParam RawData Adapter's original response its implementation
 * (e.g. a Response object for HTTP adapter using fetch).
 * @typeParam Data Content of the adapter's original response, containing
 * records or relations data.
 */
export interface AdapterI<RawData, Data = any> {
  /**
   * Execute a given context to retrieve a raw data response.
   * Context data will already be serialized using serializer if available.
   *
   * @param context
   */
  execute(context: {}): Awaitable<AdapterResponseI<RawData, Data>>;
}

/**
 * Serializer converting model instances to adapter data source format.
 *
 * @typeParam Record Serialized value for an instance.
 * @typeParam Related Serialized value for a related instance.
 * @typeParam Data Serialized value for one/many/none instances.
 */
export interface SerializerI<Record, Related, Data> {
  /**
   * Serialize a given instance.
   *
   * @param instance
   * @param context
   */
  serializeInstance(instance: ModelInstance, context: {}): Awaitable<Record>;

  /**
   * Serialize a given instance's relation.
   *
   * @param instance
   * @param def
   * @param context
   */
  serializeRelation(
    instance: ModelInstance,
    def: ModelRelation,
    context: {},
  ): Awaitable<Arrayable<Related> | null>;

  /**
   * Serialize a set of already serialized records.
   * This can be used to "wrap" records.
   *
   * @param records
   * @param context
   */
  serialize(records: Arrayable<Record | Related> | null, context: {}): Awaitable<Data>;
}

/**
 * Base deserialized data which must contain at least an instances set.
 */
export interface DeserializedData<I extends ModelInstance = ModelInstance> {
  instances: I[];
}

/**
 * Deserializer converting adapter data to a deserialized set of instances.
 *
 * @typeParam Data Content of the adapter's original response, containing
 * records or relations data.
 * @typeParam Deserialized Object containing deserialized instances and other
 * relevant deserialized data (e.g. the document for a JSON:API response).
 */
export interface DeserializerI<Data, Deserialized extends DeserializedData = DeserializedData> {
  /**
   * Deserialize adapter data to a deserialized set of instances.
   *
   * @param data
   * @param context
   */
  deserialize(data: Data, context: {}): Awaitable<Deserialized>;
}
