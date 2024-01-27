import {
  DeserializedData,
  DeserializerI,
  Model,
  ModelAttribute,
  ModelIdType,
  ModelInstance,
  ModelRelation,
  SerializerI,
} from '@foscia/core';
import { type Arrayable, Awaitable, IdentifiersMap } from '@foscia/shared';

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
  deserializer: Deserializer<Record, Data, Deserialized>;
};

export type DeserializerRecordIdentifier = {
  type?: string;
  id?: ModelIdType;
  lid?: ModelIdType;
};

export type DeserializerModelIdentifier = {
  model: Model;
  type: string;
  id?: ModelIdType;
  lid?: ModelIdType;
};

export type DeserializerExtract<Record> = {
  records: Arrayable<Record> | null;
};

export type DeserializerRecordParent = {
  instance: ModelInstance;
  def: ModelRelation;
};

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

export type DeserializerInstancesMap = IdentifiersMap<string, ModelIdType, Promise<ModelInstance>>;

export type DeserializerConfig<
  Record,
  Data,
  Deserialized extends DeserializedData,
  Extract extends DeserializerExtract<Record>,
> = {
  extractData: (data: Data, context: {}) => Awaitable<Extract>;
  createRecord: DeserializerRecordFactory<Record, Data, Deserialized, Extract>;
  createData?: (
    instances: ModelInstance[],
    extract: Extract,
    context: {},
  ) => Awaitable<Deserialized>;
  shouldDeserialize?: (
    deserializerContext: DeserializerContext<Record, Data, Deserialized>,
  ) => Awaitable<boolean>;
  deserializeKey?: (
    deserializerContext: DeserializerContext<Record, Data, Deserialized>,
  ) => Awaitable<string>;
  deserializeAttribute?: (
    deserializerContext: DeserializerContext<Record, Data, Deserialized, ModelAttribute>,
  ) => Awaitable<unknown>;
  deserializeRelated?: (
    deserializerContext: DeserializerContext<Record, Data, Deserialized, ModelRelation>,
    related: DeserializerRecord<Record, Data, Deserialized>,
    instancesMap: DeserializerInstancesMap,
  ) => Awaitable<unknown>;
};

export interface Deserializer<Record, Data, Deserialized extends DeserializedData>
  extends DeserializerI<Data, Deserialized> {
  deserializeRecord(
    record: DeserializerRecord<Record, Data, Deserialized>,
    context: {},
    instancesMap?: DeserializerInstancesMap,
  ): Awaitable<ModelInstance>;
}

/**
 * Serializer context passed to config callbacks.
 */
export type SerializerContext<
  Record = unknown,
  Related = unknown,
  Data = unknown,
  Def = ModelAttribute | ModelRelation,
> = {
  instance: ModelInstance;
  def: Def;
  key: string;
  value: unknown;
  context: {};
  serializer: Serializer<Record, Related, Data>;
};

/**
 * Pending serializer record.
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

export type SerializerRecordFactory<Record, Related, Data> = (
  instance: ModelInstance,
  context: {},
) => Awaitable<SerializerRecord<Record, Related, Data>>;

/**
 * Array of previously serialized relationships to avoid circular relations
 * serialization.
 */
export type SerializerParents = { instance: ModelInstance; def: ModelRelation }[];

export type SerializerConfig<Record, Related, Data> = {
  createRecord: SerializerRecordFactory<Record, Related, Data>;
  createData?: (records: Arrayable<Record> | null, context: {}) => Awaitable<Data>;
  shouldSerialize?: (
    serializerContext: SerializerContext<Record, Related, Data>,
  ) => Awaitable<boolean>;
  serializeKey?: (
    serializerContext: SerializerContext<Record, Related, Data>,
  ) => Awaitable<string>;
  serializeAttribute?: (
    serializerContext: SerializerContext<Record, Related, Data, ModelAttribute>,
  ) => Awaitable<unknown>;
  serializeRelation?: (
    serializerContext: SerializerContext<Record, Related, Data, ModelRelation>,
    related: ModelInstance,
    parents: SerializerParents,
  ) => Awaitable<unknown>;
  serializeRelated?: (
    serializerContext: SerializerContext<Record, Related, Data, ModelRelation>,
    related: ModelInstance,
    parents: SerializerParents,
  ) => Awaitable<Arrayable<Related> | null>;
};

export interface Serializer<Record, Related, Data> extends SerializerI<Record, Related, Data> {
  serializeInstance(
    instance: ModelInstance,
    context: {},
    parents?: SerializerParents,
  ): Awaitable<Record>;
}
