import {
  Action,
  InferModelPropType,
  Model,
  ModelInstance,
  ModelProp,
  ModelRelationProp,
  ModelShallowSnapshot,
  ModelSnapshot,
} from '@foscia/core';
import { Arrayable, Awaitable } from '@foscia/shared';

export type SerializationInstanceValue<Prop extends ModelProp> =
  Prop extends ModelRelationProp ? Arrayable<ModelInstance> | null | undefined
    : InferModelPropType<Prop>;

/**
 * Configuration for generic data deserializer.
 *
 * @interface
 *
 * @internal
 */
export interface DataDeserializerConfig<
  Data,
  DeserializedData,
  ExtractedData,
  Record,
> {
  /**
   * Extract data for deserialization or later use (e.g. related records deserialization).
   *
   * @param data
   * @param action
   */
  extractData?: (
    context: { action: Action; data: Data; },
  ) => Awaitable<ExtractedData>;
  /**
   * Extract records to be deserialized.
   *
   * @param data
   * @param action
   */
  extractRecords: (
    context: { action: Action; data: Data; },
  ) => Awaitable<Arrayable<Record> | null | undefined>;
  /**
   * Deserialize a record type.
   *
   * @param record
   */
  deserializeType?: (
    context: { action: Action; data: ExtractedData; record: Record; },
  ) => Awaitable<string | null>;
  /**
   * Deserialize a key for an instance's property.
   *
   * @param context
   */
  deserializeKey?: <T, Instance extends ModelInstance>(
    context: {
      action: Action;
      data: ExtractedData;
      record: Record;
      instance: Instance | null;
      prop: ModelProp<T, Instance>;
    },
  ) => Awaitable<string>;
  /**
   * Deserialize a value for an instance's property.
   *
   * @param context
   */
  deserializeValue: <T, Instance extends ModelInstance>(
    context: {
      action: Action;
      data: ExtractedData;
      record: Record;
      instance: Instance | null;
      prop: ModelProp<T, Instance>;
      key: string;
    },
    deserialize: (record: Record) => Promise<ModelInstance>,
  ) => Awaitable<T | undefined>;
  /**
   * Deserialize data for later use (e.g. by some runners).
   *
   * @param data
   * @param action
   * @param instances
   */
  deserializeData?: (
    context: { action: Action; data: ExtractedData; instances: ModelInstance[]; },
  ) => Awaitable<DeserializedData>;
}

/**
 * Array of previously serialized relationships to avoid circular relations
 * serialization.
 *
 * @internal
 */
export type SerializerParents = { model: Model; prop: ModelRelationProp }[];

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
 * Value to be serialized from a snapshot by the serializer for a property.
 *
 * @internal
 */
export type SerializerSnapshotValue<Prop extends ModelProp> =
  Prop extends ModelRelationProp ? Arrayable<ModelSnapshot | ModelShallowSnapshot> | null | undefined
    : unknown;

/**
 * Context for an instance's property serialization.
 *
 * @internal
 */
export interface SerializerContext<
  Prop extends ModelProp,
  Value = SerializationInstanceValue<Prop>,
> {
  readonly snapshot: ModelSnapshot<InstanceType<Prop['parent']>>;
  readonly prop: Prop;
  readonly key: string;
  readonly value: Value;
}

/**
 * Configuration for generic snapshots serializer.
 *
 * @internal
 */
export interface SnapshotsSerializerConfig<
  SerializedData,
  PendingRecord,
  Record,
> {
  /**
   * Serialize records to data.
   *
   * @param records
   * @param action
   */
  serializeData: (
    context: { action: Action; records: Arrayable<Record> | null; },
  ) => Awaitable<SerializedData>;
  /**
   * Create a pending record.
   *
   * @param snapshot
   */
  createRecord: <Instance extends ModelInstance>(
    context: {
      action: Action;
      snapshot: ModelShallowSnapshot<Instance>;
    },
  ) => Awaitable<PendingRecord>;
  /**
   * Serialize a key for an instance's property.
   *
   * @param context
   */
  serializeKey?: <T, Instance extends ModelInstance>(
    context: {
      action: Action;
      snapshot: ModelShallowSnapshot<Instance>;
      record: PendingRecord;
      prop: ModelProp<T, Instance>;
      value: T | undefined;
    },
  ) => Awaitable<string>;
  /**
   * Serialize a value for an instance's property.
   *
   * @param context
   */
  serializeValue?: <T, Instance extends ModelInstance>(
    context: {
      action: Action;
      snapshot: ModelShallowSnapshot<Instance>;
      record: PendingRecord;
      prop: ModelProp<T, Instance>;
      key: string;
      value: T | undefined;
    },
    serialize: (record: ModelShallowSnapshot<ModelInstance>) => Promise<Record>,
  ) => Awaitable<void>;
  /**
   * Release a pending record.
   *
   * @param pendingRecord
   */
  releaseRecord?: <Instance extends ModelInstance>(
    context: {
      action: Action;
      snapshot: ModelShallowSnapshot<Instance>;
      record: PendingRecord;
    },
  ) => Awaitable<Record>;
  /**
   * Tell how circular relations serialization should behave.
   *
   * - `skip` relation serialization when encountering a relation circularity.
   * - `throw` a {@link SerializerCircularRelationError | `SerializerCircularRelationError`}
   *   when encountering a relation circularity.
   * - `keep` serialized relation when encountering a relation circularity.
   */
  onCircularBehavior?: 'skip' | 'throw' | 'keep';
}
