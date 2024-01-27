import { DeserializedData, ModelIdType } from '@foscia/core';
import { HttpAdapterConfig } from '@foscia/http';
import { DeserializerConfig, DeserializerExtract, SerializerConfig } from '@foscia/serialization';
import { Dictionary } from '@foscia/shared';

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
  & {}
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
