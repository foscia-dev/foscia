import { DeserializedData, ModelAttribute, ModelIdType, ModelRelation } from '@foscia/core';
import { HttpAdapterConfig } from '@foscia/http';
import {
  DeserializerConfig,
  DeserializerContext,
  DeserializerExtract,
  DeserializerRecordIdentifier,
  SerializerConfig,
} from '@foscia/serialization';
import { Arrayable, Awaitable, Dictionary } from '@foscia/shared';

export type RestAbstractResource = Dictionary & {
  type?: string;
};

export type RestNewResource = RestAbstractResource & {
  id?: ModelIdType;
};

export type RestAdapterConfig<Data = any> = HttpAdapterConfig<Data> & {
  includeParamKey?: string | null;
  includeQueryParameter?: string | null;
};

export type RestDeserializerConfig<
  Record,
  Data,
  Deserialized extends DeserializedData,
  Extract extends DeserializerExtract<Record>,
> =
  & {
    pullIdentifier: (record: Record, context: {}) => Awaitable<DeserializerRecordIdentifier>;
    pullAttribute: (
      record: Record,
      deserializerContext: DeserializerContext<Record, Data, Deserialized, ModelAttribute>,
      extract: Extract,
    ) => Awaitable<unknown>;
    pullRelation: (
      record: Record,
      deserializerContext: DeserializerContext<Record, Data, Deserialized, ModelRelation>,
      extract: Extract,
    ) => Awaitable<Arrayable<Record> | null | undefined>;
  }
  & DeserializerConfig<Record, Data, Deserialized, Extract>;

export type RestSerializerConfig<
  Record extends RestNewResource,
  Related,
  Data,
> =
  & {
    serializeType?: boolean;
  }
  & SerializerConfig<Record, Related, Data>;
