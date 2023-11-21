import { ModelIdType } from '@foscia/core';
import { HttpAdapterConfig } from '@foscia/http';
import { ObjectDeserializerConfig, ObjectSerializerConfig } from '@foscia/object';
import { Awaitable, Dictionary } from '@foscia/shared';

export type RestResourceId = ModelIdType;

export type RestAbstractResource = Dictionary & {
  type?: string;
};

export type RestResource = RestAbstractResource & {
  id: RestResourceId;
};

export type RestNewResource = RestAbstractResource & {
  id?: RestResourceId;
};

export type RestAdapterConfig = HttpAdapterConfig & {
  includeQueryParameter?: string | null;
};

export type RestDeserializerConfig = ObjectDeserializerConfig & {
  dataReader: DataReader;
  dataExtractor?: DataExtractor | null;
};

export type RestSerializerConfig = ObjectSerializerConfig & {
  dataWrapper?: DataWrapper | null;
};

export type DataReader = (response: Response) => Awaitable<any>;
export type DataExtractor = (
  document: any,
) => Awaitable<RestResource[] | RestResource | RestNewResource | null>;
export type DataWrapper<
  Resource extends Dictionary = Dictionary,
  Data extends Dictionary = Dictionary,
> = (resource: Resource) => Awaitable<Data>;
