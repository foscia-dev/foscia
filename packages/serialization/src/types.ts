import {
  DeserializedData,
  Deserializer,
  Model,
  ModelAttribute,
  ModelIdType,
  ModelInstance,
  ModelRelation,
  ModelSnapshot,
  Serializer,
} from '@foscia/core';
import { type Arrayable, Awaitable, IdentifiersMap } from '@foscia/shared';

/**
 * Context given for an instance property deserialization.
 */
export type DeserializerContext<
  Record,
  Data = unknown,
  Deserialized extends DeserializedData = DeserializedData,
  Def = ModelAttribute | ModelRelation,
> = {
  instance: ModelInstance;
  def: Def;
  key: string;
  value: unknown;
  context: {};
  deserializer: RecordDeserializer<Record, Data, Deserialized>;
};

/**
 * Deserializer record identifiers object.
 */
export type DeserializerRecordIdentifier = {
  type?: string;
  id?: ModelIdType;
  lid?: ModelIdType;
};

/**
 * Deserializer record identifiers object with resolved model.
 */
export type DeserializerModelIdentifier = {
  model: Model;
  type: string;
  id?: ModelIdType;
  lid?: ModelIdType;
};

/**
 * Data extracted from adapter data.
 */
export type DeserializerExtract<Record> = {
  records: Arrayable<Record> | null;
};

/**
 * Parent context of a deserializer record.
 *
 * @internal
 */
export type DeserializerRecordParent = {
  instance: ModelInstance;
  def: ModelRelation;
};

/**
 * Wrapper for a deserializer record with identification properties
 * and raw attributes/relations data extraction.
 *
 * @internal
 */
export type DeserializerRecord<Record, Data, Deserialized extends DeserializedData> = {
  readonly raw: Record;
  readonly identifier: DeserializerRecordIdentifier;
  readonly parent?: DeserializerRecordParent;
  pullAttribute(
    deserializerContext: DeserializerContext<Record, Data, Deserialized, ModelAttribute>,
  ): Awaitable<unknown>;
  pullRelation(
    deserializerContext: DeserializerContext<Record, Data, Deserialized, ModelRelation>,
  ): Awaitable<Arrayable<DeserializerRecord<Record, Data, Deserialized>> | null | undefined>;
};

/**
 * Factory to create a deserializer record from a data extraction and a context.
 *
 * @internal
 */
export type DeserializerRecordFactory<
  Record,
  Data = unknown,
  Deserialized extends DeserializedData = DeserializedData,
  Extract extends DeserializerExtract<Record> = DeserializerExtract<Record>,
> = (
  extract: Extract,
  record: Record,
  context: {},
  parent?: DeserializerRecordParent,
) => Promise<DeserializerRecord<Record, Data, Deserialized>>;

/**
 * Deserializer map of instance promises by type and ID.
 *
 * @internal
 */
export type DeserializerInstancesMap = IdentifiersMap<string, ModelIdType, Promise<ModelInstance>>;

/**
 * Configuration for generic record deserializer.
 *
 * @interface
 *
 * @internal
 */
export type RecordDeserializerConfig<
  Record,
  Data,
  Deserialized extends DeserializedData,
  Extract extends DeserializerExtract<Record>,
> = {
  /**
   * Extract a records set from adapter's response data.
   *
   * @param data
   * @param context
   */
  extractData: (data: Data, context: {}) => Awaitable<Extract>;
  /**
   * Create a deserializer record from.
   */
  createRecord: DeserializerRecordFactory<Record, Data, Deserialized, Extract>;
  /**
   * Create deserialized instances wrapper object which might contain other data.
   * Defaults to no additional data provided.
   *
   * @param instances
   * @param extract
   * @param context
   */
  createData?: (
    instances: ModelInstance[],
    extract: Extract,
    context: {},
  ) => Awaitable<Deserialized>;
  /**
   * Check if an instance attribute or relation should be deserialized or not.
   * Defaults to checking if value is not `undefined`.
   *
   * @param deserializerContext
   */
  shouldDeserialize?: (
    deserializerContext: DeserializerContext<Record, Data, Deserialized>,
  ) => Awaitable<boolean>;
  /**
   * Deserialize an instance attribute or relation key.
   * Defaults to key aliasing and normalization.
   *
   * @param deserializerContext
   */
  deserializeKey?: (
    deserializerContext: DeserializerContext<Record, Data, Deserialized>,
  ) => Awaitable<string>;
  /**
   * Deserialize an instance attribute value.
   * Defaults to the use of attribute transformer if set.
   *
   * @param deserializerContext
   */
  deserializeAttribute?: (
    deserializerContext: DeserializerContext<Record, Data, Deserialized, ModelAttribute>,
  ) => Awaitable<unknown>;
  /**
   * Deserialize an instance relation's related instance(s).
   * Defaults to instance deserialization through deserializer.
   *
   * @param deserializerContext
   * @param related
   * @param instancesMap
   */
  deserializeRelated?: (
    deserializerContext: DeserializerContext<Record, Data, Deserialized, ModelRelation>,
    related: DeserializerRecord<Record, Data, Deserialized>,
    instancesMap: DeserializerInstancesMap,
  ) => Awaitable<ModelInstance>;
};

/**
 * Generic record deserializer.
 *
 * @interface
 *
 * @internal
 */
export type RecordDeserializer<Record, Data, Deserialized extends DeserializedData> =
  & {
    /**
     * Deserialize one record.
     *
     * @param record
     * @param context
     * @param instancesMap
     *
     * @internal
     */
    deserializeRecord(
      record: DeserializerRecord<Record, Data, Deserialized>,
      context: {},
      instancesMap?: DeserializerInstancesMap,
    ): Awaitable<ModelInstance>;
  }
  & Deserializer<Data, Deserialized>;

/**
 * Serializer context passed to config callbacks.
 */
export type SerializerContext<
  Record = unknown,
  Related = unknown,
  Data = unknown,
  Def = ModelAttribute | ModelRelation,
> = {
  snapshot: ModelSnapshot;
  def: Def;
  key: string;
  value: unknown;
  context: {};
  serializer: RecordSerializer<Record, Related, Data>;
};

/**
 * Pending serializer record which holds properties building.
 *
 * @internal
 */
export type SerializerRecord<Record, Related, Data> = {
  /**
   * Hydrate an instance value on the pending serializer record.
   * Serializer context's key and value are already serialized.
   *
   * @param serializerContext
   */
  put(serializerContext: SerializerContext<Record, Related, Data>): Awaitable<void>;

  /**
   * Retrieve the finally serialized record.
   */
  retrieve(): Awaitable<Record>;
};

/**
 * Factory to create a pending serializer record.
 *
 * @internal
 */
export type SerializerRecordFactory<Record, Related, Data> = (
  snapshot: ModelSnapshot,
  context: {},
) => Awaitable<SerializerRecord<Record, Related, Data>>;

/**
 * Array of previously serialized relationships to avoid circular relations
 * serialization.
 *
 * @internal
 */
export type SerializerParents = { model: Model; def: ModelRelation }[];

/**
 * Available behaviors to apply when encountering a circular relation:
 *
 * - `throw` will throw an exception on circular relation encounter.
 * - `keep` will keep the circular relation serialized value.
 * - `skip` will not serialize the circular relation.
 *
 * @internal
 */
export type SerializerCircularRelationBehavior = 'throw' | 'skip' | 'keep';

/**
 * Configuration for generic record serializer.
 *
 * @interface
 *
 * @internal
 */
export type RecordSerializerConfig<Record, Related, Data> = {
  /**
   * Create a serializer record object which can be hydrated and retrieved.
   */
  createRecord: SerializerRecordFactory<Record, Related, Data>;
  /**
   * Create adapter data value from a set of serialized record.
   * Defaults to records without any wrapper object or anything.
   *
   * @param records
   * @param context
   */
  createData?: (records: Arrayable<Record> | null, context: {}) => Awaitable<Data>;
  /**
   * Check if an instance attribute or relation should be serialized or not.
   * Defaults to checking if value did not change since last sync and is not `undefined`.
   *
   * @param serializerContext
   */
  shouldSerialize?: (
    serializerContext: SerializerContext<Record, Related, Data>,
  ) => Awaitable<boolean>;
  /**
   * Serialize an instance attribute or relation key.
   * Defaults to key aliasing and normalization.
   *
   * @param serializerContext
   */
  serializeKey?: (
    serializerContext: SerializerContext<Record, Related, Data>,
  ) => Awaitable<string>;
  /**
   * Serialize an instance attribute value.
   * Defaults to the use of attribute transformer if set.
   *
   * @param serializerContext
   */
  serializeAttribute?: (
    serializerContext: SerializerContext<Record, Related, Data, ModelAttribute>,
  ) => Awaitable<unknown>;
  /**
   * Serialize an instance relation's related instance(s).
   * Defaults to the instance ID.
   *
   * @param serializerContext
   * @param related
   * @param parents
   */
  serializeRelation?: (
    serializerContext: SerializerContext<Record, Related, Data, ModelRelation>,
    related: ModelSnapshot,
    parents: SerializerParents,
  ) => Awaitable<unknown>;
  /**
   * Serialize an instance relation's related instance(s) when outside a parent
   * serialization context, such as in attach/detach queries.
   * Defaults to the instance ID.
   *
   * @param serializerContext
   * @param related
   * @param parents
   */
  serializeRelated?: (
    serializerContext: SerializerContext<Record, Related, Data, ModelRelation>,
    related: ModelSnapshot,
    parents: SerializerParents,
  ) => Awaitable<Arrayable<Related> | null>;
  /**
   * Detect if the given context is a circular relation.
   * Defaults to true if model's relation is in the parents chain.
   *
   * @param serializerContext
   * @param parents
   */
  isCircularRelation?: (
    serializerContext: SerializerContext<Record, Related, Data, ModelRelation>,
    parents: SerializerParents,
  ) => Awaitable<boolean>;
  /**
   * Tell how circular relation should be handled by returning the
   * {@link SerializerCircularRelationBehavior | behavior} to apply.
   * Default to `skip`.
   *
   * @param serializerContext
   * @param parents
   */
  circularRelationBehavior?: (
    serializerContext: SerializerContext<Record, Related, Data, ModelRelation>,
    parents: SerializerParents,
  ) => Awaitable<SerializerCircularRelationBehavior>;
};

/**
 * Generic record serializer.
 *
 * @interface
 *
 * @internal
 */
export type RecordSerializer<Record, Related, Data> =
  & {
    /**
     * Serialize snapshots to records.
     * This overload handles circular relations using the parents of the instance.
     *
     * @param value
     * @param context
     * @param parents
     *
     * @internal
     */
    serializeToRecords(
      value: ModelSnapshot,
      context: {},
      parents: SerializerParents,
    ): Awaitable<Record>;
  }
  & Serializer<Record, Related, Data>;
