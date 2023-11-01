import type { Model, ModelIdType, ModelInstance } from '@foscia/core/model/types';
import type { Awaitable } from '@foscia/shared';

/**
 * Registry containing available models for actions.
 */
export type RegistryI = {
  /**
   * Resolve a registered model by its type.
   * Type may be normalized for easier resolve.
   *
   * @param rawType
   */
  modelFor(rawType: string): Promise<Model | null>;
};

/**
 * Cache containing already synced models instances.
 */
export type CacheI = {
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
 * Adapter interacting with the data source.
 */
export type AdapterI<Data> = {
  /**
   * Execute a given context to retrieve a raw data response.
   * Context data will already be serialized using serializer if available.
   *
   * @param context
   */
  execute(context: {}): Awaitable<Data>;
  /**
   * Check if an adapter thrown error is a "not found" error,
   * allowing to throw a generic error on "<x>OrFail" runners.
   *
   * @param error
   */
  isNotFound(error: unknown): Awaitable<boolean>;
};

/**
 * Serializer converting model instances to adapter data source format.
 */
export type SerializerI<Data> = {
  /**
   * Serialize a given instance to the adapter data source format.
   *
   * @param instance
   * @param context
   */
  serialize(instance: ModelInstance, context: {}): Awaitable<Data>;
};

/**
 * Base deserialized data which must contain at least an instances set.
 */
export type DeserializedData<I extends ModelInstance = ModelInstance> = {
  instances: I[];
};

/**
 * Deserializer converting adapter data to a deserialized set of instances.
 */
export type DeserializerI<AdapterData, Data extends DeserializedData> = {
  /**
   * Deserialize adapter data to a deserialized set of instances.
   *
   * @param data
   * @param context
   */
  deserialize(data: AdapterData, context: {}): Awaitable<Data>;
};
